import React, { useState } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      navigate("/login");
    } catch (error) {
      console.error("退出登录失败", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <SideMenu collapsed={collapsed} />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div className="header-right">
            <Dropdown
              menu={{
                items: [
                  { label: userInfo.username || "管理员", key: "1" }, // 菜单项务必填写 key
                  { label: "退出登录", key: "2" },
                ],
              }}
              trigger={["click"]}
              onClick={(e) => {
                if (e.key === "2") {
                  handleLogout();
                }
              }}
            >
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">
                  {userInfo.username || "管理员"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            background: "#fff",
            minHeight: 280,
            width: "100%",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
