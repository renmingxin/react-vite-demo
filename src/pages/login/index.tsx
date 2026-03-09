import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "../../api/login";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    try {
      const res: any = await loginApi();
      if (res.code === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        message.success("登录成功");
        navigate("/");
      } else {
        message.error(res.message || "登录失败");
      }
    } catch (error) {
      console.log(error);
      message.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className="login-title">后台管理系统</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
