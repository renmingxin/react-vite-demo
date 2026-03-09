import React, { useState } from "react";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  COLUMN: "column",
};

const DraggableColumn = ({
  column,
  index: _index, //目标当前index
  moveColumn,
  isOver: _isOver,
  setIsOver,
}: any) => {
  const ref = React.useRef(null);
  const index = Number(_index);
  const isOver = Number(_isOver);
  console.log("DraggableColumn", {
    column,
    index,
    moveColumn,
    isOver,
    setIsOver,
    _index,
    _isOver,
  });

  //是否是操作列
  const isOperationCol = column?.dataIndex === "com_operation";

  const [, drop] = useDrop({
    accept: ItemType.COLUMN,
    hover(item: any) {
      if (!ref.current || item?.column?.dataIndex === "com_operation") return;
      console.log("hover", item, index, column);
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex && dragIndex !== hoverIndex - 1) {
        setIsOver(hoverIndex);
      } else {
        setIsOver(null);
      }
    },
    drop(item) {
      if (item?.column?.dataIndex === "com_operation") return;
      console.log("drop", item);

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex && dragIndex !== hoverIndex - 1) {
        moveColumn(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
      setIsOver(null);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.COLUMN,
    item: { type: ItemType.COLUMN, index, column },
    canDrag: !isOperationCol,
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        opacity: isOperationCol && isDragging ? 0.5 : 1,
        cursor: !isOperationCol ? "move" : "",
        borderLeft: isOver === index ? "2px dashed #1890ff" : "none",
        ...(isOperationCol ? { position: "sticky", right: 0 } : {}), //自定义会导致fixed:right丢失
      }}
    >
      {column.title}
    </th>
  );
};

/**列拖动表格组件 */
const DraggableTable = () => {
  const [columns, setColumns] = useState([
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    { title: "年龄", dataIndex: "age", key: "age", width: 200 },
    { title: "地址", dataIndex: "address", key: "address", width: 200 },
    { title: "发送人", dataIndex: "sender", key: "sender", width: 200 },
    { title: "日期", dataIndex: "date", key: "date", width: 200 },
    { title: "备注", dataIndex: "dsc", key: "dsc", width: 200 },
    {
      title: "操作",
      dataIndex: "com_operation",
      fixed: "right",
      width: 120,
      render: (data: any, _record: any) => {
        return <a>查看明细</a>;
      },
    },
  ]);

  const [isOver, setIsOver] = useState(null);

  const data = [
    {
      key: "1",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },
    {
      key: "2",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },

    {
      key: "3",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },

    {
      key: "4",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },

    {
      key: "5",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },

    {
      key: "6",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },

    {
      key: "7",
      name: "John",
      age: 32,
      address: "New York",
      sender: "啊啊啊",
      date: new Date().toLocaleString(),
      dsc: "备注备注备注备注备注",
    },
  ];

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const newColumns = [...columns];
    const [removed] = newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, removed);
    setColumns(newColumns);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={
          columns.map((col, index) => ({
            ...col,
            onHeaderCell: () => ({
              index,
              moveColumn,
              column: col,
              isOver,
              setIsOver,
            }),
          })) as any
        }
        components={{
          header: {
            cell: DraggableColumn,
          },
        }}
        dataSource={data}
        scroll={{ x: 1300 }}
      />

      <Table columns={columns as any} dataSource={data} scroll={{ x: 1000 }} />
    </DndProvider>
  );
};

export default DraggableTable;
