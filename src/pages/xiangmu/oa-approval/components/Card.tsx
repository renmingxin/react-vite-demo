import type { ReactNode } from "react";
import styles from "../index.module.less";
import { RenderCounter } from "./RenderCounter";

export default function Card({
  title,
  extra,
  counter,
  children,
}: {
  title: string;
  extra?: ReactNode;
  /** 传了就展示该组件的渲染次数 */
  counter?: number;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardExtra}>
          {extra}
          {typeof counter === "number" && <RenderCounter count={counter} />}
        </span>
      </header>
      {children}
    </section>
  );
}
