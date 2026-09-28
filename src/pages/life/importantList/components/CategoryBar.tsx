import React, { useRef } from "react";
import { Dropdown, Button } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useDrag, useDrop } from "react-dnd";
import type { Category } from "../types";
import { CATEGORY_DRAG_MIME } from "../constants";
import styles from "../index.module.less";

interface ChipProps {
  category: Category;
  index: number;
  active: boolean;
  count: number;
  onSelect: (id: string) => void;
  onRename: (c: Category) => void;
  onDelete: (c: Category) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const CategoryChip: React.FC<ChipProps> = ({
  category,
  index,
  active,
  count,
  onSelect,
  onRename,
  onDelete,
  onReorder,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // 整个标签既是拖拽源也是放置目标（点击仍然正常切换分类）
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: CATEGORY_DRAG_MIME,
      item: { id: category.id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [category.id, index],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: CATEGORY_DRAG_MIME,
      hover: (item: { id: string; index: number }, monitor) => {
        if (!ref.current || item.id === category.id) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        // 横向排列：以标签水平中线为界，避免临界点抖动
        const rect = ref.current.getBoundingClientRect();
        const middleX = (rect.right - rect.left) / 2;
        const offset = monitor.getClientOffset();
        if (!offset) return;
        const clientX = offset.x - rect.left;

        if (dragIndex < hoverIndex && clientX < middleX) return;
        if (dragIndex > hoverIndex && clientX > middleX) return;

        onReorder(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    }),
    [category.id, index, onReorder],
  );

  return (
    <div
      ref={(node) => {
        ref.current = node;
        dropRef(node);
      }}
      className={[
        styles.catChip,
        active ? styles.catChipActive : "",
        isDragging ? styles.catChipDragging : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--cat-color": category.color } as React.CSSProperties}
      onClick={() => onSelect(category.id)}
      title={category.name}
    >
      {/* 只有这个手柄可拖拽，避免整个标签变成拖动光标 */}
      <span
        ref={dragRef as unknown as React.LegacyRef<HTMLSpanElement>}
        className={styles.catHandle}
        onClick={(e) => e.stopPropagation()}
        title="按住拖动调整分类顺序"
      >
        <HolderOutlined />
      </span>
      <span className={styles.catDot} />
      <span className={styles.catName}>{category.name}</span>
      <span className={styles.catCount}>{count}</span>
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            { key: "rename", icon: <EditOutlined />, label: "重命名 / 改色" },
            {
              key: "delete",
              icon: <DeleteOutlined />,
              label: "删除分类",
              danger: true,
            },
          ],
          onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === "rename") onRename(category);
            else onDelete(category);
          },
        }}
      >
        <span
          className={styles.catMore}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreOutlined />
        </span>
      </Dropdown>
    </div>
  );
};

interface Props {
  categories: Category[];
  activeId: string;
  counts: Record<string, number>;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const CategoryBar: React.FC<Props> = ({
  categories,
  activeId,
  counts,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onReorder,
}) => {
  return (
    <div className={styles.categoryBar}>
      {categories.map((c, idx) => (
        <CategoryChip
          key={c.id}
          category={c}
          index={idx}
          active={c.id === activeId}
          count={counts[c.id] || 0}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onReorder={onReorder}
        />
      ))}

      <Button
        size="small"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className={styles.catAddBtn}
      >
        新建分类
      </Button>
    </div>
  );
};

export default CategoryBar;
