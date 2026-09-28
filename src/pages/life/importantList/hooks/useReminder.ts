import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { tasksState } from "../store";
import type { TaskItem } from "../types";

// 用 AudioContext 合成一个短促提示音，避免引入额外音频文件
const playBeep = () => {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.warn("[reminder] 播放提示音失败", e);
  }
};

// 请求浏览器通知权限
export const ensureNotificationPermission = async () => {
  if (typeof Notification === "undefined") return "unsupported" as const;
  if (Notification.permission === "granted") return "granted" as const;
  if (Notification.permission === "denied") return "denied" as const;
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch {
    return "default" as const;
  }
};

// 显示浏览器原生通知
const showSystemNotification = (task: TaskItem) => {
  if (
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  )
    return;
  try {
    new Notification(`⏰ 事项提醒：${task.title}`, {
      body: task.description || "该事项到时间了，去处理吧！",
      tag: task.id,
    });
  } catch (e) {
    console.warn("[reminder] 发送系统通知失败", e);
  }
};

// 自定义事件：提醒时由页面监听并弹模态
const fireReminderEvent = (task: TaskItem) => {
  window.dispatchEvent(
    new CustomEvent("importantList:reminder", { detail: task }),
  );
};

/**
 * 全局定时巡检 Hook：每秒扫描未完成且到点的任务
 * - 播放提示音
 * - 发送系统通知
 * - 派发自定义事件以便 UI 弹窗
 * - 写入 notified 字段避免重复提醒
 */
export const useReminderWatcher = () => {
  const tasks = useRecoilValue(tasksState);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      tasksRef.current.forEach((t) => {
        if (t.completed || t.notified || !t.remindAt) return;
        const ts = new Date(t.remindAt).getTime();
        if (Number.isNaN(ts)) return;
        if (ts <= now) {
          playBeep();
          showSystemNotification(t);
          fireReminderEvent(t);
          // 标记已通知（就地修改通过触发 setter 持久化）
          window.dispatchEvent(
            new CustomEvent("importantList:markNotified", {
              detail: { id: t.id },
            }),
          );
        }
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
};
