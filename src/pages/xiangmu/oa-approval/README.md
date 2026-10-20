# OA 运行态审批工作台（useSyncExternalStore 架构 Demo）

一个「架构演示优先、业务逻辑其次」的 OA 审批工作台运行态页面。
目标是把 BPM 审批动作（20+ 个按钮）的触发、校验、提交、回调，以及细粒度状态订阅，
收敛成一套可以讲清楚、可以照着扩展的架构。

- 路由：`/xiangmu/approval`（侧边栏「项目难点 → OA运行态工作台」）
- 入口：`src/pages/xiangmu/oa-approval/index.tsx`
- 依赖：React 18 + antd 5，**没有新增任何 npm 依赖**（等值比较、深比较、事件总线、store 都是自研）

---

## 一、怎么跑起来

```bash
cd e:/code/my/react-vite-demo
npm start          # 或 pnpm start
# 打开 http://localhost:5173/xiangmu/approval
```

建议按顺序做一遍：

1. 点「同意」→ 弹窗填意见 → 确定：看流程轨迹、摘要同步时间、事件日志同时变化。
2. 再点「同意」，意见里输入「垃圾」→ 被敏感词中间件拦截（这是 pipeline 在工作）。
3. 打开「更多动作 → 打印」：无弹窗动作，激活即执行。
4. 打开「性能与取值层实验台」：先点「写无关字段 100 次」，再点「写表单字段 100 次」，对比各卡片右上角的 `render ×N`。
5. 点实验台里的「1s 后读取」两个按钮，在 1 秒内改「报销金额」，对比 Proxy 和闭包快照的结果。
6. 打开「模拟接口失败」开关，再执行任意动作，观察失败回调（弹窗保留，可直接重试）。

> 说明：`main.tsx` 开了 `StrictMode`，开发环境初次挂载会渲染两次，所以计数从 2 起跳，这是正常的。
> 对比时看「点击前后有没有变化」，不要看绝对值。

---

## 二、一次点击的完整运行链路

以点击「同意」为例（这是理解整套代码最关键的路径）：

```
ApprovalToolbar
  └─ launch("agree")                                // core/useApprovalAction.ts useActionLauncher
       ├─ 用 useStoreValue()（Proxy）读最新 permission  ← 不订阅、不受闭包影响
       ├─ dispatch.ui.setActiveAction("agree")       // 写入 store 的命令式更新
       └─ approvalBus.emit("action:open")            // 事件总线广播给外部系统

ActionModal（唯一视图宿主）
  ├─ useStoreData(selectActiveAction) 拿到 "agree"
  ├─ getAction("agree") 从注册表取动作定义
  ├─ view.type === "modal" → 按 view.fields 配置渲染表单
  └─ onOk → form.getFieldsValue() → run(payload, { validate })

useApprovalAction.run
  └─ compose(buildMiddlewares(action, options))(ctx)
       ctx = { action, payload, getState, dispatch, api, notify, emit }

core/middlewares.ts 的固定顺序：
  withErrorBoundary      捕获一切异常（ActionBlocked 只提示，其它走失败回调）
  withPending            防重复点击 + 全局 loading（真正的并发闸门）
  withPermission         权限兜底（UI 过滤只是"不给看"，这里才是"不给做"）
  withFormValidation     调视图注入的 form.validateFields()
  withRequiredFields     按 view.fields 的 required 推导必填
  withSensitiveWords     意见/原因命中敏感词直接拦截
  action.middlewares     动作私有中间件（可选）
  withBeforeSubmit       action.beforeSubmit 钩子
  withHandler            执行 handler → 结果统一收敛

actions/agree.tsx 的 handler
  ├─ callApi(ctx, "agree")            // 读最新 state.document.id / ui.simulateFailure
  ├─ dispatch.document.patch(...)     // 语义化命令
  └─ appendTrace(ctx, { title: "同意", comment })

withHandler 收尾
  ├─ result.success === false → 抛 ActionFailed → 回到 withErrorBoundary
  ├─ action.afterSubmit → 提示成功 → emit("action:success") → action.onSuccess
  └─ dispatch.ui.setActiveAction(null)   // 关闭弹窗也走命令，UI 无本地状态
```

数据反向流回来时，只有**订阅了对应切片的组件**重渲染：

| 组件 | 订阅的东西 | 备注 |
| --- | --- | --- |
| `ApprovalHeader` | `document.title/status/code/currentNode` | 4 个独立 selector |
| `ApprovalToolbar` | `permission`、`ui.pending` | 按钮由注册表 + 权限过滤生成 |
| `FormSection` | `form`（shallowEqual） | 改表单只动这一块 |
| `SummaryPanel` | `summaryDetail.groups`（deepEqual） | 后端整包下发 |
| `ApprovalTimeline` | `timeline`（deepEqual） | |
| `ActionModal` | `ui.activeAction`、`ui.pending` | |

---

## 三、目录地图与每个文件负责什么

```
oa-approval/
├─ index.tsx                  页面装配：副作用注册动作 → Provider → 布局 → 挂桥接协议
├─ index.module.less          样式（含各卡片的 render 计数样式）
├─ types.ts                   全部类型：动作协议、状态树、dispatch、中间件
├─ constants.ts               23 个动作的中文名/成功文案、流程节点、人员、敏感词
├─ mock/initialState.ts       初始状态（permission 里有几个 false，用来演示过滤与拦截）
├─ services/approvalApi.ts    模拟接口：固定 320~580ms 耗时，可开关失败
│
├─ store/                     ← 第一优先级：状态层
│   ├─ createStore.ts         框架无关内核：闭包 state + Set 订阅 + transaction 批量通知
│   ├─ context.ts             只放 store 实例的 Context（value 永不变化）
│   ├─ ApprovalStoreContext.tsx  Provider（useState 惰性创建 store）
│   ├─ useApprovalStore.ts    取 store 实例的 hook
│   ├─ useStoreData.ts        ★ useSyncExternalStore + selector + 等值比较
│   ├─ useDispatch.ts         ★ 命令式更新收口（patch / summaryDetail / transaction…）
│   ├─ useStoreValue.ts       ★ Proxy 非响应式取值层
│   ├─ equal.ts               shallowEqual / deepEqual
│   ├─ selectors.ts           稳定 selector（模块级常量）
│   └─ index.ts               对外统一出口
│
├─ core/                      ← 第二优先级：动作调度层
│   ├─ registry.ts            注册表：registerAction / getAction / getVisibleActions / groupActions
│   ├─ defineAction.ts        动作工厂 + 字段配置构造器（opinionField/nodeField/…）
│   ├─ eventBus.ts            on/once/onAny/emit（跨团队解耦）
│   ├─ pipeline.ts            koa 风格 compose + ActionBlocked/ActionFailed
│   ├─ middlewares.ts         ★ 公共能力中间件（权限/防重/校验/敏感词/成功失败回调）
│   ├─ useApprovalAction.ts   ★ run 执行器 + useActionLauncher
│   ├─ execute.ts             handler 里调接口的固定开场
│   ├─ trace.ts               流程轨迹写入收口
│   ├─ bridge.ts              对外桥接协议 window.__OA_APPROVAL_BRIDGE__
│   └─ index.ts               统一出口
│
├─ actions/                   ← 第三优先级：业务动作（每个动作一个文件）
│   ├─ index.ts               显式注册表（新增动作在这里加一行）
│   ├─ submit.tsx / agree.tsx / disagree.tsx / rollback.tsx / reject.tsx
│   ├─ countersign.tsx / addSign.tsx / notify.tsx / transfer.tsx / delegate.tsx
│   ├─ fetchBack.tsx / revoke.tsx / terminate.tsx / carbonCopy.tsx / urge.tsx
│   ├─ archive.tsx / saveDraft.tsx / comment.tsx / batchAgree.tsx / print.tsx
│   └─ jump.tsx / suspend.tsx / reopen.tsx
│
└─ components/                ← 第四优先级：视图层
    ├─ ActionModal.tsx        ★ 唯一动作视图宿主（配置驱动，不写业务）
    ├─ ApprovalToolbar.tsx    按权限渲染按钮，点击只调 launch(key)
    ├─ ApprovalHeader.tsx     单据头（4 个细粒度 selector）
    ├─ FormSection.tsx        可编辑表单，只订阅 form
    ├─ SummaryPanel.tsx       摘要详情 groups[].items[]
    ├─ ApprovalTimeline.tsx   流程轨迹
    ├─ PerfLab.tsx            ★ 性能/取值层实验台（可点出结论）
    ├─ EventLogPanel.tsx      事件总线日志 + 模拟外部系统调用
    ├─ Card.tsx / RenderCounter.tsx / useRenderCount.ts
    └─ （架构说明文字在 tips.md，不在页面里）
```

---

## 四、这套代码的核心设计（看懂这 5 条就懂全局）

### 1. Context 只放 store 实例，不放状态树

`store/context.ts` 的 `value` 是一个**永远不变**的 store 对象。
状态变化不经过 Context，而是通过 `store.subscribe` 通知到真正关心它的组件。
这是干掉「任意字段变动 → 全树重渲染」的关键。

### 2. `useStoreData`：`useSyncExternalStore` + 快照缓存 + 等值比较

`store/useStoreData.ts` 的 `getSnapshot` 做三件事：

1. `state` 引用没变且 selector 没变 → 直接返回上次的派生值；
2. `state` 变了但派生值等价（默认 `shallowEqual`，可传 `deepEqual`）→ **返回旧引用**，
   React 侧 `Object.is` 判定相等，组件不重渲染；
3. 真变了才返回新值。

这一步是必需的：`useSyncExternalStore` 要求 `getSnapshot` 同步且稳定，
返回新对象/新数组会导致 "The result of getSnapshot should be cached to avoid an infinite loop"。

> selector 一律写成 `store/selectors.ts` 里的模块级函数（引用稳定），不要在渲染里内联 `state => ({...})`。

### 3. `useDispatch`：语义化命令，而不是散落的展开运算

```ts
dispatch.form.patch({ amount: 100 });
dispatch.document.patch({ status: "审批中" });
dispatch.summaryDetail.replace(detail);            // 后端整包下发
dispatch.summaryDetail.upsertItem("flow", item);   // 局部更新某一项
dispatch.ui.setActiveAction("agree");
dispatch.transaction(() => { ...多次写入只通知一次... });
```

好处：BPM 特有的「摘要全量替换」与「普通字段局部合并」在 dispatch 内部隔离，
业务层不用再写 `{...prev, form: {...prev.form, ...patch}}` 这种代码。

### 4. `useStoreValue`：Proxy 代理的"非响应式"取值层

`store/useStoreValue.ts` 返回一个 Proxy：`get` 时读 `store.getState()`，`set` 时写回去。

- 用在**点击事件、setTimeout、接口回调**里，永远读到最新值，不怕闭包；
- 它**不订阅**，所以不能用来驱动 UI；
- 禁止在渲染顶层解构（`const { form } = useStoreValue()`），否则又变成一次性快照。

需要驱动 UI 时用 `useStoreData(selector)`；需要在回调里读最新值时用 `useStoreValue()`。

### 5. 动作协议 + Pipeline：新增按钮不改分发器

动作 = `{ key, label, group, order, permission?, view, handler, beforeSubmit?, afterSubmit?, onSuccess?, onError?, middlewares? }`。

- `view` 只有两种：`{ type: "none" }`（激活即执行）或 `{ type: "modal", fields: [...] }`（配置驱动弹窗）；
- `handler` 只写业务：调接口、`dispatch` 更新、写轨迹；
- 权限、防重、表单校验、必填、敏感词、成功/失败回调、loading、关闭弹窗，**全部由公共中间件统一处理**。

---

## 五、建议的学习路径（按顺序，约 3~4 小时）

### Step 1｜先看"结果"（15 分钟）

打开页面，按第一节的 6 个操作全点一遍，建立直观印象：
哪些动作有弹窗、哪些没有，点完之后轨迹/摘要/事件日志怎么变。

### Step 2｜读状态层（60 分钟，最重要）

按这个顺序读，每读一个文件回答一个问题：

1. `store/createStore.ts` —— 为什么状态要放在闭包里？`Set` 相比数组有什么好处？`transaction` 解决了什么？
2. `store/useStoreData.ts` —— 三行分支分别在什么情况下命中？如果去掉等值比较会发生什么？
3. `store/useDispatch.ts` —— 为什么不直接暴露 `setState` 给业务？
4. `store/useStoreValue.ts` —— Proxy 的 `get`/`set`/`ownKeys` 分别为了支持什么写法？
5. `store/selectors.ts` —— 为什么 selector 必须稳定？

读完试着回答：**「为什么 Context 里放 store 实例就不会全量重渲染？」**

### Step 3｜读动作调度层（45 分钟）

1. `types.ts` 里的 `ApprovalAction` 和 `ActionContext`：动作拿到了什么、能做什么。
2. `core/pipeline.ts`：`compose` 是怎么把中间件串起来的（`next()` 只能调一次的原因）。
3. `core/middlewares.ts`：按顺序读 8 个中间件，重点看 `withPending` 和 `withHandler`。
4. `core/useApprovalAction.ts`：`run` 如何组装 ctx，`useActionLauncher` 如何把点击翻译成命令。

读完试着回答：**「一个动作从点击到关闭弹窗，会写几次 store？」**

### Step 4｜读一个动作 + 视图宿主（30 分钟）

- `actions/agree.tsx`：最短的完整动作。
- `actions/terminate.tsx`：带 `beforeSubmit` 私有钩子的高危动作。
- `actions/print.tsx`：`view: none` 的无弹窗动作。
- `components/ActionModal.tsx`：看看 `view.fields` 是怎么变成表单的、`onOk` 怎么把 payload 交给 `run`。

读完试着回答：**「为什么 23 个按钮只需要一个弹窗组件？」**

### Step 5｜读性能与解耦（30 分钟）

- `components/PerfLab.tsx` + `PerfLab` 里的两个读取按钮：理解 Proxy 与闭包快照的差别。
- `core/eventBus.ts` + `components/EventLogPanel.tsx`：事件总线怎么解耦上下游。
- `core/bridge.ts`：外部系统怎么不依赖内部 hook 也能触发动作。

### Step 6｜动手改（60 分钟，检验是否真懂）

从易到难挑一个做：

1. 新增「抄送财务共享中心」动作：`actions/carbonCopyFinance.tsx` + `actions/index.ts` 加一行 + 初始 permission 加一个 key，跑通即可。
2. 把 `agree` 改成「金额 > 100000 时必须填意见」：在 `actions/agree.tsx` 的 `middlewares` 里加一个自定义中间件（不改公共逻辑）。
3. 把 `SummaryPanel` 拆成「基础信息」和「流程信息」两个独立组件，各自订阅自己的分组，观察 render 计数变化。
4. 给 `actions/index.ts` 改成按需加载（`React.lazy` 或动态 import），体会注册时机的影响。

### Step 7｜自测清单（能答上来就算过关）

1. 为什么 `useSyncExternalStore` 的 `getSnapshot` 必须返回稳定引用？不稳定的报错信息是什么？
2. `shallowEqual` 和 `deepEqual` 分别用在什么场景？deepEqual 的成本在哪里？
3. `withPending` 为什么比按钮 `disabled` 更可靠？
4. `ActionBlocked` 和 `ActionFailed` 的区别是什么？分别走哪条提示路径？
5. `useStoreValue` 为什么不能用于渲染？误用会有什么症状？
6. 新增一个审批动作需要改哪些文件？为什么不需要改 `ActionModal`？
7. 失败时为什么保留弹窗、而无弹窗动作失败后要复位 `activeAction`？
8. `transaction` 在什么场景下能把 N 次通知压成 1 次？

---

## 六、常见误区 / 陷阱提醒

| 现象 | 原因 | 正确做法 |
| --- | --- | --- |
| `The result of getSnapshot should be cached...` | selector 每次返回新对象/新数组且没做等值比较 | 用模块级 selector + `shallowEqual`/`deepEqual` |
| 组件不更新 | 用了 `useStoreValue` 却期望它驱动渲染 | 驱动 UI 用 `useStoreData(selector)` |
| 异步回调里拿到旧数据 | 闭包捕获了渲染时快照 | 回调里用 `useStoreValue()` 或 `ctx.getState()` |
| 表单值串到下一个动作 | 弹窗复用了同一个 form 实例 | `Form preserve={false}` + 关闭时 `resetFields()` |
| 动作点了没反应 | 权限里该 key 是 `false`（如 `revoke`/`archive`/`batchAgree`/`reopen`） | 在 `mock/initialState.ts` 打开权限再看 |
| 开发环境计数翻倍 | `StrictMode` 双渲染 | 看点击前后的增量，不看绝对值 |

---

## 七、面试时怎么讲（30 秒版）

> 这个模块把 OA 运行态的 20 多个审批动作从「UI 里写按钮 + 写弹窗 + 写业务」收敛成了
> 「动作注册表 + 配置驱动视图 + 中间件链路」：新增按钮只要加一个动作文件和一行注册。
> 状态层用 `useSyncExternalStore` + 稳定 selector + 等值比较做细粒度订阅，
> Context 只放 store 实例，所以无关字段变化时无关组件重渲染为 0；
> 用 Proxy 做了一层非响应式取值，专门解决异步回调里的闭包陷阱；
> 对外用事件总线和桥接协议解耦 BPM 老页面。整个过程零新增依赖，老代码可以渐进式接入。
