// @ts-nocheck
import React, { useState } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import type { ResizeCallbackData } from "react-resizable";
import { Resizable } from "react-resizable";
import styles from "./draggableColWidthTable.module.less";

interface DataType {
  key: React.Key;
  date: string;
  amount: number;
  type: string;
  note: string;
}

interface TitlePropsType {
  width: number;
  onResize: (
    e: React.SyntheticEvent<Element>,
    data: ResizeCallbackData
  ) => void;
}

const ResizableTitle: React.FC<
  Readonly<React.HTMLAttributes<any> & TitlePropsType>
> = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      // style={{ position: "relative", backbackgroundClip: "padding-box" }}
      width={width}
      height={0}
      handle={
        <span
          className={styles["react-resizable-handle"]}
          // style={{
          //   position: "absolute",
          //   insetInlineEnd: "-5px",
          //   bottom: "0",
          //   zIndex: 1,
          //   width: "10px",
          //   height: "100%",
          //   cursor: "ew-resize",
          // }}
          onClick={(e) => e.stopPropagation()}
        ></span>
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const data: DataType[] = [
  {
    key: 0,
    date: "2018-02-11",
    amount: 120,
    type: "income",
    note: "transfer",
  },
  {
    key: 1,
    date: "2018-03-11",
    amount: 243,
    type: "income",
    note: "transfer",
  },
  {
    key: 2,
    date: "2018-04-11",
    amount: 98,
    type: "income",
    note: "transfer",
  },
];

const App: React.FC = () => {
  const [columns, setColumns] = useState<TableColumnsType<DataType>>([
    {
      title: "流程实例ID",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.caseId:com.seeyon.bpm.domain.entity.BpmCase.id",
      width: 100,
      ellipsis: true,
    },
    {
      title: "流程标题",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.caseTitle",
      width: 100,
      ellipsis: true,
    },
    {
      title: "发起者编码",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.caseSender:com.seeyon.organization.domain.core.entity.OrgMember.code",
      width: 100,
      ellipsis: true,
    },
    {
      title: "发起者姓名",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.caseSender:com.seeyon.organization.domain.core.entity.OrgMember.name",
      width: 100,
      ellipsis: true,
    },
    {
      title: "发起时间",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.createTime",
      width: 100,
      ellipsis: true,
    },
    {
      title: "申请人",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.applicant",
      width: 100,
      ellipsis: true,
    },
    {
      title: "字段1",
      dataIndex:
        "com.seeyon.dynamic4769605634304723545.domain.entity.Shiti1.ziduan1",
      width: 100,
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "com_operation",
      fixed: "right",
      width: 120,
    },
  ]);

  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      console.log("handleResize", index, size);

      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergedColumns = columns.map<TableColumnsType<DataType>[number]>(
    (col, index) => ({
      ...col,
      onHeaderCell: (column: TableColumnsType<DataType>[number]) => ({
        width: column.width,
        onResize: handleResize(index) as React.ReactEventHandler<any>,
      }),
    })
  );

  return (
    <div className={styles.myTable}>
      <Table<DataType>
        // bordered
        loading={false}
        components={{ header: { cell: ResizableTitle } }}
        columns={mergedColumns}
        dataSource={[]}
        scroll={{ y: 200 }}
        pagination={false}
      />
    </div>
  );
};

export default App;
