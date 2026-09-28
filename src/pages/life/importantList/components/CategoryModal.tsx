import React from "react";
import { Modal, Form, Input, message } from "antd";
import type { Category, CategoryFormValues } from "../types";
import { CATEGORY_COLORS } from "../constants";
import styles from "../index.module.less";

interface Props {
  open: boolean;
  /** 重命名时传入；新建时 undefined */
  editing?: Category;
  onCancel: () => void;
  onSubmit: (values: CategoryFormValues, editingId?: string) => void;
}

/** 预设色板选择器（值为字符串，便于表单处理） */
const ColorSwatchPicker: React.FC<{
  value?: string;
  onChange?: (v: string) => void;
}> = ({ value, onChange }) => (
  <div className={styles.swatchRow}>
    {CATEGORY_COLORS.map((c) => (
      <span
        key={c}
        className={`${styles.swatch} ${value === c ? styles.swatchActive : ""}`}
        style={{ background: c }}
        onClick={() => onChange?.(c)}
      />
    ))}
  </div>
);

const CategoryModal: React.FC<Props> = ({
  open,
  editing,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<CategoryFormValues>();
  const isEdit = !!editing;

  const initialValues: CategoryFormValues = isEdit
    ? { name: editing!.name, color: editing!.color }
    : { name: "", color: CATEGORY_COLORS[0] };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const name = (values.name || "").trim();
      if (!name) {
        message.warning("请输入分类名称");
        return;
      }
      onSubmit({ name, color: values.color }, editing?.id);
    } catch {
      /* 校验失败 antd 已提示 */
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "编辑分类" : "新建分类"}
      okText={isEdit ? "保存" : "创建"}
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      maskClosable={false}
      afterOpenChange={(visible) => {
        if (!visible) return;
        form.setFieldsValue({
          name: editing?.name ?? "",
          color: editing?.color ?? CATEGORY_COLORS[0],
        });
      }}
    >
      <Form
        form={form}
        key={editing?.id ?? "create"}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item
          label="分类名称"
          name="name"
          rules={[{ required: true, message: "请输入分类名称" }]}
        >
          <Input
            placeholder="例如：生活、工作、学习"
            maxLength={12}
            showCount
          />
        </Form.Item>
        <Form.Item label="主题色" name="color">
          <ColorSwatchPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
