import React from "react";
import { Dropdown, Button } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Category } from "../types";
import styles from "../index.module.less";

interface Props {
  categories: Category[];
  activeId: string;
  counts: Record<string, number>;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

const CategoryBar: React.FC<Props> = ({
  categories,
  activeId,
  counts,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}) => {
  return (
    <div className={styles.categoryBar}>
      {categories.map((c) => {
        const active = c.id === activeId;
        return (
          <div
            key={c.id}
            className={`${styles.catChip} ${active ? styles.catChipActive : ""}`}
            style={{ "--cat-color": c.color } as React.CSSProperties}
            onClick={() => onSelect(c.id)}
            title={c.name}
          >
            <span className={styles.catDot} />
            <span className={styles.catName}>{c.name}</span>
            <span className={styles.catCount}>{counts[c.id] || 0}</span>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "rename",
                    icon: <EditOutlined />,
                    label: "重命名 / 改色",
                  },
                  {
                    key: "delete",
                    icon: <DeleteOutlined />,
                    label: "删除分类",
                    danger: true,
                  },
                ],
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  if (key === "rename") onRename(c);
                  else onDelete(c);
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
      })}

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
