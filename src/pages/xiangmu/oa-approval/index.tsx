// 副作用导入：在渲染前完成动作注册（放在最前面，保证注册表就绪）
import "./actions";

import { useEffect } from "react";
import { App as AntdApp } from "antd";
import ActionModal from "./components/ActionModal";
import ApprovalHeader from "./components/ApprovalHeader";
import ApprovalTimeline from "./components/ApprovalTimeline";
import ApprovalToolbar from "./components/ApprovalToolbar";
import EventLogPanel from "./components/EventLogPanel";
import FormSection from "./components/FormSection";
import PerfLab from "./components/PerfLab";
import SummaryPanel from "./components/SummaryPanel";
import { createApprovalBridge } from "./core";
import { createInitialState } from "./mock/initialState";
import { ApprovalStoreProvider, useApprovalStore } from "./store";
import styles from "./index.module.less";

/**
 * 运行态工作台骨架：
 *
 *   ApprovalStoreProvider（只放 store 实例）
 *     └─ Workbench
 *          ├─ ApprovalHeader      订阅 document 字段
 *          ├─ ApprovalToolbar     订阅 permission，按注册表渲染按钮
 *          ├─ FormSection         订阅 form
 *          ├─ SummaryPanel        订阅 summaryDetail（deepEqual）
 *          ├─ ApprovalTimeline    订阅 timeline（deepEqual）
 *          ├─ PerfLab             性能 / 取值层实验台
 *          └─ ActionModal         配置驱动的动作视图宿主
 */
function Workbench() {
  const store = useApprovalStore();

  // 对外暴露桥接协议：老 BPM 页面 / 微前端宿主可据此触发动作
  useEffect(() => {
    window.__OA_APPROVAL_BRIDGE__ = createApprovalBridge(store);
    return () => {
      delete window.__OA_APPROVAL_BRIDGE__;
    };
  }, [store]);

  return (
    <div className={styles.page}>
      <ApprovalHeader />
      <ApprovalToolbar />

      <div className={styles.body}>
        <div className={styles.main}>
          <FormSection />
          <PerfLab />
        </div>
        <aside className={styles.side}>
          <SummaryPanel />
          <ApprovalTimeline />
          <EventLogPanel />
        </aside>
      </div>

      <ActionModal />
    </div>
  );
}

function OaApproval() {
  return (
    <AntdApp>
      <ApprovalStoreProvider initialState={createInitialState()}>
        <Workbench />
      </ApprovalStoreProvider>
    </AntdApp>
  );
}

export default OaApproval;
