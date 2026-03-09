import React from "react";
import { Menu } from "antd";
import {
  UsergroupAddOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    key: "/study",
    icon: <UsergroupAddOutlined />,
    label: "学习",
    children: [
      {
        key: "/study/webWorker",
        label: "webWorker实例",
      },
      {
        key: "/study/requestAnimationFrame",
        label: "requestAnimationFrame实例",
      },
      {
        key: "/study/requestIdleCallback",
        label: "requestIdleCallback实例",
      },
      {
        key: "/study/ueseRef",
        label: "ueseRef实例",
      },
      {
        key: "/study/recoil",
        label: "recoil实例(redux替代)",
      },
      {
        key: "/study/transfer",
        label: "demo编写",
      },
    ],
  },

  {
    key: "work",
    icon: <TeamOutlined />,
    label: "工作",
    children: [
      {
        key: "/work/dropDown",
        label: "选人选分支下拉交互",
      },
      {
        key: "/work/draggableTable",
        label: "拖拽列宽表格",
      },
      {
        key: "/work/myTable",
        label: "拖拽列表格调整列的位置",
      },
      {
        key: "/work/virtualList",
        label: "虚拟滚动",
      },
      {
        key: "/work/workingHours",
        label: "工作时长划分",
      },
      {
        key: "/work/system-setting-antdTable",
        label: "参数设置用antdTable重写",
      },
      {
        key: "/work/bpm-dataQuery-tree",
        label: "数据查询扩展方案tree联动",
      },
    ],
  },
  {
    key: "life",
    icon: <TeamOutlined />,
    label: "生活",
    children: [{ key: "/life/travelCuangxi", label: "川西" }],
  },
];

const SideMenu = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      inlineCollapsed={collapsed}
    />
  );
};

export default SideMenu;
