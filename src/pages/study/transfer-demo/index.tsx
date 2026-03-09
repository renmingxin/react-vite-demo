import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { Typography } from "antd";
import { DownCircleOutlined } from "@ant-design/icons";
const { Paragraph } = Typography;

function Index() {
  console.log("Index");
  const article =
    "中文文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文";
  return (
    <div className={styles.container}>
      <Paragraph
        ellipsis={{
          rows: 2,
          expandable: true,
          // suffix: <StarOutlined />,
          symbol: <DownCircleOutlined />,
          onEllipsis: (ellipsis) => {
            console.log("Ellipsis changed:", ellipsis);
          },
        }}
        title={`${article}`}
      >
        {article}
      </Paragraph>
    </div>
  );
}

export default Index;
