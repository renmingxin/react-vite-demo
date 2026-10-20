import styles from "../index.module.less";

export function RenderCounter({ count }: { count: number }) {
  return <span className={styles.renderCounter}>render ×{count}</span>;
}
