import React, { useState, useMemo } from "react";
import { InputNumber, Row, Col, Card, Typography, Space, Progress } from "antd";
import styles from "./index.module.less";
import { formatDateToYYMMWeek } from "./tools";

const { Title, Text, Paragraph } = Typography;

function WorkingHours() {
  const [hours, setHours] = useState<number>(40);

  const days = useMemo(() => {
    return Number((hours / 8).toFixed(2));
  }, [hours]);

  const separation = [
    {
      id: 1,
      title: "价值创造",
      content:
        "技术预研及难题攻关、详细设计、代码开发、Jira Bug修复和客户Bug修复",
      ratio: 0.7,
      color: "#52c41a", // 绿色系-核心工作
      class: "Develop",
    },
    {
      id: 2,
      title: "价值管理",
      content: "计划与进度管理（jira Bug）、评审管理、日常会议",
      ratio: 0.15,
      color: "#1890ff", // 蓝色系-管理工作
      class: "Meeting",
    },
    {
      id: 3,
      title: "价值传递",
      content: "客户反馈与支持",
      ratio: 0.1,
      color: "#faad14", // 黄色系-沟通工作
      class: "Customer",
    },
    {
      id: 4,
      title: "组织与发展",
      content: "自我学习",
      ratio: 0.05,
      color: "#722ed1", // 紫色系-成长工作
      class: "Improvement",
    },
  ];

  return (
    <Card
      title={<Title level={4}>工作时长分配计算器</Title>}
      className={styles.container}
      bordered
      style={{ maxWidth: 800, margin: "20px auto" }}
    >
      <Row gutter={[16, 24]}>
        {/* 输入区域 */}
        <Col span={24}>
          <Card type="inner" title="基本信息设置">
            <Space size="middle" align="center">
              <Text strong>工作总时长（小时）：</Text>
              <InputNumber
                value={hours}
                onChange={setHours}
                min={0}
                style={{ width: 120 }}
                formatter={(value) => `${value}h`}
                parser={(value) => value?.replace("h", "")}
              />
              <Text type="secondary">（按每天8小时计算，共 {days} 天）</Text>
            </Space>
          </Card>
        </Col>

        {/* 分配详情区域 */}
        <Col span={24}>
          <Card type="inner" title="工作内容分配详情">
            <Space direction="vertical" size="large" className={styles.content}>
              {separation.map((item: any) => {
                const day = days * item.ratio.toFixed(2);
                const hour = (hours * item.ratio).toFixed(0);
                return (
                  <div key={item.id} className={styles.item}>
                    <Row gutter={[16, 8]} align="middle">
                      {/* 标题与占比 */}
                      <Col xs={24} sm={14}>
                        <Space size="small" align="center">
                          <Text strong style={{ color: item.color }}>
                            {item.title}
                          </Text>
                          <Text type="secondary">（{item.ratio * 100}%）</Text>
                        </Space>
                        <Paragraph
                          size="small"
                          style={{ marginTop: 4, marginBottom: 0 }}
                        >
                          {item.content}
                        </Paragraph>

                        <Text type="secondary">
                          RCRW{formatDateToYYMMWeek()}-{item.class}
                        </Text>
                      </Col>

                      {/* 时间数据 */}
                      <Col xs={24} sm={10} style={{ textAlign: "right" }}>
                        <Space size="middle">
                          <Text>
                            <Text type="primary" strong>
                              {day.toFixed(2)}
                            </Text>{" "}
                            天
                          </Text>
                          <Text>
                            <Text type="primary" strong>
                              {(hours * item.ratio).toFixed(0)}
                            </Text>{" "}
                            小时
                          </Text>
                        </Space>
                      </Col>
                    </Row>

                    {/* 进度条可视化 */}
                    <Progress
                      percent={item.ratio * 100}
                      strokeColor={item.color}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default WorkingHours;
