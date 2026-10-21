# useSyncExternalStore 最佳实践

> 一句话结论：**当「数据的真相」不在 React 里，而 React 只是它的一个消费者时，用 `useSyncExternalStore`。**
> 它不是 Redux 的替代品，它是 Redux / Zustand / React Router 的**底座**。

页面地址：`/study/useSyncExternalStore`

> 只想先跑起来、把页面点一遍：直接跳到 **第九节「使用步骤」**（含每个演示的操作顺序与预期现象）。
> 想搞清楚「什么时候该用、为什么不用 Redux」：看第二 ~ 四节。

---

## 一、心智模型：只有三个参数

```ts
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

| 参数 | 作用 | 硬性要求 |
| --- | --- | --- |
| `subscribe(callback)` | 注册监听，数据变化时调用 `callback` | **必须返回「取消订阅」函数** |
| `getSnapshot()` | 返回当前快照 | **数据没变时必须返回同一个引用**（幂等） |
| `getServerSnapshot()` | SSR / 水合时使用 | 返回值必须与客户端首帧一致 |

它的语义不是「把数据同步到 state」，而是「**渲染时就地读取外部数据**」。
所以组件里没有 `useState`、没有 `useEffect`，也没有「初始值 → 修正」的中间态。

一个能用的最小模板：

```ts
// store.ts —— 数据源完全脱离 React
let state = { count: 0 };
const listeners = new Set<() => void>();

export const store = {
  getState: () => state,
  setState: (next: { count: number }) => {
    if (Object.is(next, state)) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener); // 一定要返回
  },
};

// useCounter.ts —— 接进 React
export const useCounter = () => useSyncExternalStore(store.subscribe, store.getState);
```

**就这么多。** 没有再多的 API 了 —— 这也是它「最好学、最难写错（只要你记住两条铁律）」的原因。

---

## 二、什么场景下该用

### 1. 集成非 React 的第三方库 / 老代码（最本职的用途）

地图 SDK、播放器、编辑器（Monaco / CodeMirror）、WebSocket 客户端、埋点 SDK、公司内部的旧状态中心……
它们的内部状态本来就是「外部的」，你不可能把它改造成 Redux。

```ts
useSyncExternalStore(player.subscribe, player.getCurrentTime);
```

React Router、Zustand、Redux、Jotai、Valtio 内部都用了它 / 它的 shim 来做这件事。

### 2. 订阅浏览器 API

`navigator.onLine`、`window.innerWidth`、`matchMedia`、`devicePixelRatio`、`localStorage`、剪贴板、权限状态、电池状态……

传统写法 `useState + useEffect` 的问题：
- 首帧先用初始值渲染，再被修正（视觉抖动）；
- 服务端渲染访问 `window` 直接报错；
- 每个组件都要重复写一遍事件绑定和清理；
- 并发渲染下 `setState` 与渲染不同步，可能出现撕裂。

```ts
const online = useOnlineStatus();       // useBrowserState.ts 里有完整实现
const { width } = useWindowSize();
const isDark = useMediaQuery("(prefers-color-scheme: dark)");
```

### 3. 跨标签页 / 跨窗口同步

`storage` 事件天生就是「外部事件源」，`useSyncExternalStore` 是它最自然的接法。
本项目 `createLocalStorageStore.ts` 演示了完整实现（含引用缓存和事件兜底）。

### 4. 你正在写一个库 / SDK，需要给别人提供 React 绑定

这是很多人忽略的一点：**写库的人不能强迫使用者安装某个状态管理库。**
`useSyncExternalStore` 是 React 官方认可的唯一「标准接线口」，零依赖、零 Provider。

（本仓库 `src/pages/study/sdk` 那类场景，如果 SDK 内部有可变状态，就应该这样暴露绑定。）

### 5. 状态很少、但需要「全局」的场景

主题、语言、登录用户、侧边栏折叠、全局 loading……
为这几个字段引入一个状态管理库，收益是负的：多了一层 Provider、多了一份 bundle、多了一次心智负担。

```ts
// 一个文件，一个 store，搞定
export const themeStore = createStore({ mode: "light" as "light" | "dark" });
```

### 6. 高频更新、但只有局部组件关心

鼠标位置、滚动进度、拖拽坐标、Canvas 尺寸……
用 Context 会导致所有消费者重渲染；用 selector + `useSyncExternalStore` 可以做到只有真正用到的那几个组件更新。

---

## 三、什么场景下**不该**用

| 场景 | 更合适的选择 | 原因 |
| --- | --- | --- |
| 状态只在父子/兄弟间流动 | `useState` / props / `useReducer` | 外部 store 是「全局」的，别把局部状态污染成全局 |
| 需要 DevTools 时间旅行、action 日志 | Redux Toolkit | `useSyncExternalStore` 只给你「读」，不给你调试生态 |
| 服务端数据（列表、详情、分页缓存） | TanStack Query / SWR / RTK Query | 这类库解决的是缓存、去重、重试、失效，不是「怎么读状态」 |
| 表单 | react-hook-form 等 | 同上，是专门问题 |
| 大量派生状态、依赖追踪 | Jotai / Recoil / MobX / Vue 式响应式 | 手写 selector 组合与缓存会很快变成体力活 |
| 需要持久化 / 撤销重做 / 协同 | 有对应中间件或方案 | 库的中间件生态更成熟 |

判断标准很简单：

> **你是在「读一份已经存在的数据」，还是在「管理一份需要被组织起来的状态」？**
> 前者用 `useSyncExternalStore`；后者才需要状态管理库。

---

## 四、为什么不用 Redux / Zustand / Recoil？

先纠正一个常见误解：**这不是二选一。**

`useSyncExternalStore` 和它们不是同一层的东西：

```
你的组件
   ↑
useSyncExternalStore      ← React 提供的「官方接线口」
   ↑
Redux / Zustand / ...     ← 状态管理方案（内部就用它来接线）
   ↑
数据源
```

Redux 的 `useSelector` 内部就是 `useSyncExternalStoreWithSelector`。
所以你真正要回答的问题是：**「我要不要引入一个状态管理库」**，而不是「要不要用这个 hook」。

### 成本对比

| 维度 | 手写 useSyncExternalStore | Redux Toolkit | Zustand | Recoil / Jotai |
| --- | --- | --- | --- | --- |
| 额外依赖 | **0（React 内置）** | ~13KB+ | ~1KB | 各几 KB |
| 需要 Provider | 否 | **是** | 否 | **是** |
| DevTools / 时间旅行 | 无 | **强** | 有插件 | 有 |
| 异步 / 中间件 | 自己写 | thunk、listener | 中间件 | 异步 atom |
| 约定与规范 | 靠自己 | **强（团队协作友好）** | 中 | 中 |
| 学习成本 | 理解 2 个参数 | 高 | 低 | 中 |

### 手写更划算的 5 个理由

1. **数据源本来就是外部的**
   浏览器 API、SDK、WebSocket、localStorage —— 引入状态库并不能让它们变得「更 React」，只是多包一层。React 需要的只是「能读 + 能收到通知」，这两点内置 API 已经给了。

2. **零依赖 = 零升级负担**
   没有版本冲突、没有 breaking change、没有「Redux 又出了新写法」的追更成本。对需要长期维护、或要发布给外部使用的代码（SDK、组件库、微前端子应用）尤其重要。

3. **不需要 Provider，天然支持多实例**
   `createStore()` 是函数，想要几个实例就创建几个；测试时直接 new 一个干净的 store，不需要 `render(<Provider store={...}>)` 包裹。

4. **包体积**
   C 端 H5、嵌入式 Widget、小程序 webview，每 KB 都算钱。为了几个全局字段引入 13KB 的运行时并不划算。

5. **可控性**
   你的 store 只有 40 行，出问题能一眼看完。库的行为（批处理、selector 缓存、中间件顺序）出问题时，你需要读它的源码。

### 该上库的 5 个信号

1. 状态跨十几个模块，需要**强约定**（action 命名、单向数据流、谁能改什么）；
2. 需要 **DevTools 时间旅行 / action 日志** 来排查线上问题；
3. 需要 **persist / immer / undo / 协同** 这类现成中间件；
4. 团队里新人多，**文档和生态**比「代码短」更重要；
5. 你有大量**派生状态**，手写 selector 组合与依赖追踪已经开始失控。

一句话总结：

> **库的价值在「约定、工具链、生态」，而不在「能不能让组件读到外部数据」。**
> 后者，React 内置的 `useSyncExternalStore` 就够了。

### 顺便说说 Context

Context 常被误当成「轻量状态管理」，但：

- Context 的值一变，**所有消费者**都会重渲染，无法按 selector 精确订阅；
- 高频更新（鼠标位置、滚动）放 Context 会让整棵树抖动；
- Context 更适合「依赖注入」（主题、i18n、当前用户），而不是「高频可变状态」。

要精确订阅，`useSyncExternalStore` 是更合适的工具。

---

## 五、最佳实践清单

### ✅ 应该做

1. **`getSnapshot` 必须幂等**
   返回原始值（string / number / boolean）最安全；返回对象就必须自己缓存。

   ```ts
   let cached = null;
   function getSnapshot() {
     const w = window.innerWidth;
     const h = window.innerHeight;
     if (!cached || cached.w !== w || cached.h !== h) cached = { w, h };
     return cached; // 没变化时返回同一个引用
   }
   ```

2. **`subscribe` / `getSnapshot` 引用保持稳定**
   放在模块作用域，或挂在 store 上，或用 `useCallback` 包。引用一变，React 就会「取消订阅 → 重新订阅」。

3. **`subscribe` 一定要返回取消订阅函数**
   否则组件卸载后订阅还在，既泄漏内存，又会往已卸载组件上推更新。

4. **selector 提到组件外**

   ```ts
   // ✅ 模块作用域，引用恒定
   const selectName = (s: State) => s.user.name;
   function Name() {
     return useStoreSelector(store, selectName);
   }
   ```

5. **selector 返回新对象时，给 `isEqual`**

   ```ts
   const selectCard = (s: State) => ({ name: s.user.name, level: s.user.level });
   const card = useStoreSelector(store, selectCard, shallowEqual);
   ```

6. **SSR 一定提供 `getServerSnapshot`**
   且服务端与客户端首帧结果必须一致，否则水合报 mismatch。

7. **store 更新保持不可变**
   `setState` 用 `{ ...state, x }` 而不是 `state.x = ...`，否则引用没变，订阅者不会收到通知。

### ❌ 不要做

1. ❌ 在 `getSnapshot` 里发请求、做重计算、`new Date()`（每次返回新值 → 无限循环）。
2. ❌ 在 `getSnapshot` 里读 `localStorage` 却不缓存（`JSON.parse` 每次都是新对象）。
3. ❌ 用 `useSyncExternalStore` 管理只属于一个组件的临时状态。
4. ❌ 监听 `mousemove` / `scroll` 却不节流 —— 把它节流放到 store 里，而不是让每个组件自己扛。
5. ❌ 忘记处理 StrictMode 的双调用 —— 在开发环境 `subscribe` 会被调用两次，如果你的订阅有副作用，要保证它是幂等的。

---

## 六、常见坑速查

| 现象 | 原因 | 解法 |
| --- | --- | --- |
| 控制台报 `The result of getSnapshot should be cached to avoid an infinite loop` | `getSnapshot` 每次返回新对象/新数组 | 缓存快照，或用 selector + `isEqual` |
| 页面疯狂重渲染 | 同上，或 `subscribe` 引用每次都变 | 稳定引用 + 缓存快照 |
| 组件不更新 | `setState` 直接改了原对象，引用没变 | 保持不可变更新 |
| 组件卸载后仍然报错 / 内存泄漏 | `subscribe` 没返回 unsubscribe | 补上清理函数 |
| 选出的值变了但组件没更新 | `isEqual` 写错（比如深度比较了函数） | 检查比较函数；`Object.is` 是默认值 |
| SSR 水合报 mismatch | 服务端与客户端 `getServerSnapshot` 不一致 | 首帧用同一份确定性数据 |

---

## 七、和 `useState + useEffect` 的本质区别：tearing

```ts
// ❌ 老写法：订阅发生在「渲染提交之后」
const [count, setCount] = useState(store.getState().count);
useEffect(() => store.subscribe(() => setCount(store.getState().count)), []);
```

在并发渲染（`startTransition`、`Suspense`）下，React 可能把一次渲染**拆成几段、中途被打断**。
如果这期间 store 变了，不同组件会在不同时间点读到不同版本的数据，同一屏上出现「新旧混杂」——这就是 **tearing（撕裂）**。

`useSyncExternalStore` 的做法是：**在渲染阶段直接读快照**，并在提交前检查快照是否变化，变了就重渲染，从而保证同一帧里所有组件看到的是同一份数据。

这就是它叫「**sync** external store」的原因：不是「同步执行」，而是「**保证与 React 的渲染同步**」。

---

## 八、目录导读

```
useSyncExternalStore-demo/
├── index.tsx                     页面骨架（五个演示区块）
├── index.module.less             样式
├── createStore.ts                ★ 40 行极简 store，演示三件套契约
├── useStore.ts                   ★ useStore / useStoreSelector / shallowEqual
├── useBrowserState.ts            ★ 用 useSyncExternalStore 重写浏览器 API 订阅
├── createLocalStorageStore.ts    ★ 跨标签页同步的 store
├── stores.ts                     本页用到的全部数据源
├── useRenderCount.ts             渲染次数统计（教学用）
└── components/
    ├── BasicCounter.tsx          ① 基础：两个组件共享一个 store
    ├── SelectorDemo.tsx          ② 精确订阅：selector / isEqual 的效果
    ├── BrowserApiDemo.tsx        ③ 网络状态、窗口尺寸、媒体查询
    ├── CrossTabDemo.tsx          ④ 跨标签页同步
    └── SubscribePitfallDemo.tsx  ⑤ 两个必踩的坑（可运行）
```

建议阅读顺序：`createStore.ts` → `useStore.ts` → `components/BasicCounter.tsx` → `components/SelectorDemo.tsx`。

## 九、使用步骤（照着做一遍）

> 建议顺序：先照着 9.2 ~ 9.6 把页面点一遍（每步都有「预期现象」），再回头看对应源码；最后按 9.7 把套路搬进自己的项目。

### 9.1 启动项目

```bash
cd react-vite-demo
pnpm install        # 或 npm install / yarn
pnpm start          # 等价于 vite
```

- 端口在 `vite.config.ts` 里固定为 **5734**；被占用时 Vite 会自动 +1（终端会打印实际地址），以终端为准。
- 打开 `http://localhost:5734/study/useSyncExternalStore`。
- 或从左侧菜单「学习 → useSyncExternalStore的最佳实践」进入。
- 页面顶部三张灰卡片（`subscribe` / `getSnapshot` / `getServerSnapshot`）就是全部 API，先记住它们再看演示。

> 关于「渲染 N 次」：本项目开启了 `<StrictMode>`，开发环境下组件会被额外调用一次，所以首次挂载看到 **2** 是正常的，看到 **1** 也正常（取决于是否发生二次渲染）。判断标准永远是「**点完之后有没有增长**」，而不是「等于几」。

---

### 9.2 步骤一：跑通最小闭环（① 基础用法）

1. 找到「订阅者 A」「订阅者 B」两张卡片，记下各自的「渲染 N 次」。
2. 点 **A** 卡片上的 `+1`。
3. 观察：**A 和 B 的数字同时变成 1** —— 两个组件之间没有任何 props 传递，也没有 Provider，它们读的是同一个模块级 store。
4. 再点 **B** 卡片上的 `-1`，A 会同步变回 0 —— 反向同样成立。
5. 点 `重置`，回到 0；观察两张卡片的渲染次数各 +1。
6. 刷新整页：数字回到 0 —— 说明 store 在内存里，页面刷新即重建（需要持久化就用 9.5 的 localStorage 版本）。

**对照源码**（`components/BasicCounter.tsx` + `createStore.ts`），只看三处：

| 看哪里 | 看什么 |
| --- | --- |
| `subscribe` 的返回值 | 必须返回 `() => listeners.delete(listener)`，这是「取消订阅」 |
| `setState` 里的 `Object.is` | 引用没变就直接 return，不通知订阅者 |
| `getState` / `subscribe` 的定义位置 | 定义一次、挂在 store 上，所以引用永远不变 |

**这一步要建立的直觉**：组件里没有 `useState`、没有 `useEffect`、没有 `.then(setState)`，只有一行 `useStore(store)`。

---

### 9.3 步骤二：验证 selector 精确订阅（② selector）

1. 先记下四张卡片的初始渲染次数（大概率都是 1 或 2）。
2. 点 **`改 name`** → 预期：
   - 「只订阅 name」**+1**
   - 「只订阅 todos.length」**不变**
   - 「返回新对象 + shallowEqual」**+1**（它选的也是 name）
   - 「全量订阅（对照组）」**+1**
3. 点 **`level + 1`** → 预期（**这是本节的核心结论**）：
   - 「只订阅 name」**不变** ✅
   - 「只订阅 todos.length」**不变** ✅
   - 「返回新对象 + shallowEqual」**+1**（level 变了，浅比较判定不等）
   - 「全量订阅（对照组）」**+1**
4. 点 **`加一条 todo`** → 预期：只有「todos.length」和「全量订阅」增长，name 那两个不动。
5. 如果某次看到的是 **+2 而不是 +1**：一个 store 会同时通知多个订阅者，React 可能把一次事件拆成两批渲染。**看「有没有变」，不要纠结「变了几次」。**
6. 打开 `useStore.ts`，对着 `useStoreSelector` 读三遍：
   - `getSnapshot` 幂等（快照没变就直接返回上次结果）→ 防止无限循环；
   - `isEqual` 命中就复用旧引用 → 防止 selector 返回新对象导致误判；
   - `selector` / `isEqual` 也参与缓存比对 → 换 selector 时不会拿到旧切片。

**这一步要建立的直觉**：`useStore` 是「全量订阅」，`useStoreSelector` 才是「精确订阅」；selector 一律提到组件外部（模块作用域），否则每次渲染都是新函数。

---

### 9.4 步骤三：订阅浏览器 API（③）

1. 打开 DevTools → **Network** → 把 Throttling 切成 `Offline`：第一行标签立刻变成红色「离线」。
2. 切回 `No throttling`：变回绿色「在线」。
3. 拖动浏览器窗口改变大小：第二行的 `宽 × 高` 实时跟着变。
4. 把窗口拖窄到 768px 以下：第三行 `max-width: 768px` 变成 `true`。
5. 系统切换深色模式（或 DevTools → Rendering → `Emulate CSS media feature prefers-color-scheme`）：`prefers-color-scheme: dark` 标签变色。
6. 打开 `useBrowserState.ts` 确认：三个 hook 里**都没有 `useState` 和 `useEffect`**，只有 `subscribe` + `getSnapshot`。
7. 重点看 `getWindowSizeSnapshot`：它返回的是对象，所以必须先比较宽高、再决定要不要创建新对象 —— 这一行就是「坑 1」的正确写法。

---

### 9.5 步骤四：跨标签页同步（④）

1. 复制当前地址，在**第二个标签页**打开。
2. 在标签页 A 点 `+1` → 标签页 B 的数字自动跟着变（底层是 `storage` 事件）。
3. 在标签页 B 点 `+1` → 标签页 A 同样同步。
4. 刷新任一标签页 → 数字**保留**（数据在 localStorage 里）。
5. 想恢复初始状态：DevTools → Application → Local Storage → 删除 key `useSyncExternalStore-demo:shared-counter`，再刷新。
6. 打开 `createLocalStorageStore.ts`，理解两个细节：
   - `storage` 事件只发给「**其它**标签页」，所以当前页写完后必须**手动 notify 一次**；
   - 读出来的是字符串，`JSON.parse` 每次都产生新对象，所以必须缓存「原始字符串 + 解析结果」。

---

### 9.6 步骤五：亲手制造两个坑（⑤）

**A. subscribe 抖动（可运行）**

1. 默认开关处于「**不稳定**」，记下「subscribe 被调用 N 次」和「当前存活订阅者」。
2. 连续点 **5 次**「强制重新渲染」→ `subscribe 被调用` 一路飙升（大约 +5），但「存活订阅者」始终是 **1**。
   → 结论：**没有泄漏，只是订阅在抖动**（每次渲染都取消再重新订阅）。
3. 把开关切到「**稳定**」，点「重置统计」，再连点 5 次「强制重新渲染」→ 次数基本不再增长。
4. 数字为什么不从 1 开始、而且有时滞后一拍？StrictMode 会故意执行两次「订阅 → 取消订阅」，且订阅发生在 commit 之后，而统计数字是在 render 阶段读的。

**B. getSnapshot 返回新对象（只能看代码）**

5. 向下滚动阅读两段代码：
   - 坑 1：`getSnapshot` 每次 `return { ... }` → React 报 `The result of getSnapshot should be cached to avoid an infinite loop`，页面疯狂重渲染。
   - 坑 2：`subscribe` 写在组件里 → 每次渲染都是新函数 → effect 依赖 `[subscribe]` 变化 → 重新订阅。
6. 对照 `createStore.ts` 与 `useBrowserState.ts`，确认正确写法都做到了「引用恒定」。

---

### 9.7 把套路搬进自己的项目（6 步）

1. **先判断该不该用**：数据源是否在 React 之外？（浏览器 API / SDK / WebSocket / localStorage / 外部缓存）
   是 → 继续；否（只是组件内部的临时状态）→ 直接用 `useState`，不要过度设计。
2. **写数据源**：`state` + `listeners` + `getState` / `setState` / `subscribe`，可以直接复制 `createStore.ts`（约 40 行）。
3. **保证 `getSnapshot` 幂等**：原始值（string / number / boolean）直接用；返回对象/数组就必须缓存。
4. **封装 hook**：

   ```ts
   export const useCounter = () =>
     useSyncExternalStore(store.subscribe, store.getState, store.getState);
   ```

5. **需要精确订阅再加 selector**：复制 `useStore.ts` 里的 `useStoreSelector` + `shallowEqual`，并把 selector 写到组件外。
6. **按需补齐三件事**：
   - 服务端渲染 / 水合 → 传第三个参数 `getServerSnapshot`，且服务端与客户端首帧一致；
   - 跨标签页 → 在 `subscribe` 里挂 `storage` 监听（参考 `createLocalStorageStore.ts`）；
   - 高频事件（`mousemove` / `scroll`）→ 在写入 store 之前先节流/`requestAnimationFrame`，而不是让每个组件自己扛。

---

### 9.8 自检清单（改完自己的代码后过一遍）

- [ ] 控制台没有 `The result of getSnapshot should be cached to avoid an infinite loop`；
- [ ] 组件卸载后不报错、监听器数量不增长（`subscribe` 返回了取消订阅函数吗？）；
- [ ] 点一个与某组件无关的按钮，那个组件的「渲染次数」**保持不变**（selector 生效了吗？）；
- [ ] `subscribe` / `getSnapshot` 不是每次渲染都新建的（是否写在模块作用域或 store 上？）；
- [ ] 更新 store 时没有原地修改对象（`{ ...state, x }`，而不是 `state.x = ...`）。

---

## 十、参考

- React 官方文档：`useSyncExternalStore`
- React 源码：`ReactFiberHooks.js` 中的 `mountSyncExternalStore` / `updateSyncExternalStore`
- `use-sync-external-store` 包（React 17 及以下的 shim，以及 `useSyncExternalStoreWithSelector` 的官方实现）
