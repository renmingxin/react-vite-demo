import { Button, Space, Tag, Typography } from "antd";
import styles from "../index.module.less";
import { profileStore } from "../stores";
import type { ProfileState } from "../stores";
import { shallowEqual, useStore, useStoreSelector } from "../useStore";
import { useRenderCount } from "../useRenderCount";

const { Text } = Typography;

/* ------------------------------------------------------------------
 * ★ 最佳实践：selector 定义在模块作用域。
 *   引用天然稳定 → useSyncExternalStore 不会因为「函数换了」而重复订阅。
 *   如果一定要写在组件里，请用 useCallback 包起来。
 * ------------------------------------------------------------------ */
const selectUserName = (state: ProfileState) => state.user.name;
const selectTodoCount = (state: ProfileState) => state.todos.length;

// 返回「新对象」的 selector：必须配一个 isEqual（这里是浅比较）
const selectUserCard = (state: ProfileState) => ({
  name: state.user.name,
  level: state.user.level,
  // todos: state.todos
});

/** 只订阅 name */
function NamePanel() {
  const name = useStoreSelector(profileStore, selectUserName);
  const renders = useRenderCount();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>selector：只订阅 name</Text>
        <Tag color="green">渲染 {renders} 次</Tag>
      </div>
      <div className={styles.value}>{name}</div>
      <Text type="secondary">改 level / 加 todo 时，这个组件不该重渲染</Text>
    </div>
  );
}

/** 只订阅 todos 的长度 */
function TodoPanel() {
  const todoCount = useStoreSelector(profileStore, selectTodoCount);
  const renders = useRenderCount();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>selector：只订阅 todos.length</Text>
        <Tag color="green">渲染 {renders} 次</Tag>
      </div>
      <div className={styles.value}>{todoCount} 条</div>
      <Text type="secondary">改 name / level 时，这个组件不该重渲染</Text>
    </div>
  );
}

/** 用 selector 返回新对象，但靠 shallowEqual 兜住引用 */
function UserCardPanel() {
  const user = useStoreSelector(profileStore, selectUserCard, shallowEqual);
  const renders = useRenderCount();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>selector：返回新对象 + shallowEqual</Text>
        <Tag color="orange">渲染 {renders} 次</Tag>
      </div>
      <div className={styles.value}>
        {user.name} · Lv.{user.level}
      </div>
      <Text type="secondary">没有 shallowEqual 会无限重渲染</Text>
    </div>
  );
}

/** 对照：全量订阅 */
function FullStatePanel() {
  const state = useStore(profileStore);
  const renders = useRenderCount();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Text strong>useStore：全量订阅（对照组）</Text>
        <Tag color="red">渲染 {renders} 次</Tag>
      </div>
      <div className={styles.value}>{state.user.name}</div>
      <Text type="secondary">任何字段变化都会重渲染</Text>
    </div>
  );
}

/**
 * ② 精确订阅
 *
 * 点不同的按钮，观察每个卡片右上角的「渲染次数」：
 *   - 改 level：只有「全量订阅」和「UserCard」会 +1
 *   - 加 todo：只有「todos.length」和「全量订阅」会 +1
 *
 * 这就是业界常说的「selector 精确订阅」，
 * 也是 Zustand 的 useStore(selector)、Redux 的 useSelector 的底层原理。
 */
export default function SelectorDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space wrap>
        <Button
          size="small"
          onClick={() =>
            profileStore.setState((state) => ({
              ...state,
              user: {
                ...state.user,
                name: `小明-${Math.random().toString(36).slice(2, 5)}`,
              },
            }))
          }
        >
          改 name
        </Button>
        <Button
          size="small"
          onClick={() =>
            profileStore.setState((state) => ({
              ...state,
              user: { ...state.user, level: state.user.level + 1 },
            }))
          }
        >
          level + 1
        </Button>
        <Button
          size="small"
          onClick={() =>
            profileStore.setState((state) => ({
              ...state,
              todos: [...state.todos, `新任务 ${state.todos.length + 1}`],
            }))
          }
        >
          加一条 todo
        </Button>
      </Space>

      <div className={styles.panelGrid}>
        <NamePanel />
        <TodoPanel />
        <UserCardPanel />
        <FullStatePanel />
      </div>

      <Text type="secondary">
        看「有没有变」比看「变了几次」更重要：一个 store 会同时通知多个订阅者，
        React 可能在一次事件里合并或拆成两批渲染，所以次数可能出现 +2。
      </Text>
    </Space>
  );
}
