import { Space, Tag, Typography } from "antd";
import styles from "../index.module.less";
import {
  useMediaQuery,
  useOnlineStatus,
  useWindowSize,
} from "../useBrowserState";

const { Text } = Typography;

/**
 * ③ 订阅浏览器 API
 *
 * 这三个 hook 都只有几行代码，却比 useState + useEffect 更正确：
 *   - 首帧读到的就是真实值，不是「初始值 → 修正」；
 *   - 服务端渲染时有安全的默认值（getServerSnapshot）；
 *   - 逻辑可复用，用的时候不用再关心事件名和清理。
 *
 * 同样的套路还能写：prefers-reduced-motion、键盘按键状态、
 * 剪贴板内容、WebSocket 连接状态、IndexedDB 查询结果……
 */
export default function BrowserApiDemo() {
  const online = useOnlineStatus();
  const { width, height } = useWindowSize();
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isNarrow = useMediaQuery("(max-width: 768px)");

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div className={styles.statRow}>
        <Text strong>navigator.onLine</Text>
        {online ? (
          <Tag color="green">在线</Tag>
        ) : (
          <Tag color="red">离线（请检查网络）</Tag>
        )}
        <Text type="secondary">在 DevTools → Network 里切 Offline 试试</Text>
      </div>

      <div className={styles.statRow}>
        <Text strong>window.innerWidth / innerHeight</Text>
        <Tag color="blue">
          {width} × {height}
        </Tag>
        <Text type="secondary">拖动窗口大小，值会跟着变</Text>
      </div>

      <div className={styles.statRow}>
        <Text strong>matchMedia</Text>
        <Tag color={isDark ? "purple" : "default"}>
          prefers-color-scheme: dark → {String(isDark)}
        </Tag>
        <Tag color={isNarrow ? "volcano" : "default"}>
          max-width: 768px → {String(isNarrow)}
        </Tag>
      </div>
    </Space>
  );
}
