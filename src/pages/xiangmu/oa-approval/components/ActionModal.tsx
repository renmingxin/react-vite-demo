import { useEffect, useRef } from "react";
import { Alert, DatePicker, Form, Input, InputNumber, Modal, Radio, Select, Space } from "antd";
import dayjs from "dayjs";
import { APPROVAL_EVENTS, approvalBus, getAction, useApprovalAction } from "../core";
import { detectSensitiveWords } from "../constants";
import { selectActiveAction, useDispatch, useStoreData } from "../store";
import type { ActionKey, ActionPayload, ViewFieldConfig } from "../types";
import styles from "../index.module.less";

/**
 * 唯一的「动作视图宿主」。
 *
 * 视图完全由动作的 view 配置驱动：
 * - view.type === "none" → 不弹窗，直接进 pipeline；
 * - view.type === "modal"  → 按 fields 渲染表单，字段校验/敏感词/loading 全部来自公共能力。
 *
 * 20+ 个按钮共用这一个组件，UI 代码不再散落在 BPM 层。
 */
export default function ActionModal() {
  const activeKey = useStoreData(selectActiveAction);
  const action = activeKey ? getAction(activeKey) : null;
  const { run, pending } = useApprovalAction(action);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const view = action?.view.type === "modal" ? action.view : null;
  const opinion = Form.useWatch("opinion", form) as string | undefined;
  const sensitiveWords = detectSensitiveWords(opinion);

  const close = () => {
    dispatch.ui.setActiveAction(null);
    approvalBus.emit(APPROVAL_EVENTS.actionClose, { action: activeKey });
  };

  // 无弹窗动作：激活即执行（用 ref 防止 StrictMode 下重复触发）
  const startedRef = useRef<ActionKey | null>(null);
  useEffect(() => {
    if (!activeKey || !action || action.view.type !== "none") return;
    if (startedRef.current === activeKey) return;
    startedRef.current = activeKey;
    void run({});
  }, [activeKey, action, run]);

  useEffect(() => {
    if (!activeKey) {
      startedRef.current = null;
      form.resetFields();
    }
  }, [activeKey, form]);

  const normalize = (values: Record<string, unknown>): ActionPayload => {
    const payload = { ...values } as ActionPayload;
    if (dayjs.isDayjs(values.dueDate)) {
      payload.dueDate = values.dueDate.format("YYYY-MM-DD");
    }
    return payload;
  };

  const handleOk = async () => {
    // payload 取原始值，校验交给 pipeline 的 withFormValidation 统一拦截
    const payload = normalize(form.getFieldsValue());
    await run(payload, {
      validate: async () => {
        await form.validateFields();
      },
    });
  };

  const renderField = (field: ViewFieldConfig) => {
    switch (field.type) {
      case "textarea":
        return (
          <Input.TextArea
            rows={field.rows ?? 3}
            maxLength={field.maxLength}
            showCount={Boolean(field.maxLength)}
            placeholder={field.placeholder}
          />
        );
      case "select":
        return (
          <Select
            mode={field.multiple ? "multiple" : undefined}
            options={field.options}
            placeholder={field.placeholder}
            allowClear
          />
        );
      case "radio":
        return (
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={field.options}
          />
        );
      case "number":
        return <InputNumber style={{ width: "100%" }} placeholder={field.placeholder} />;
      case "date":
        return <DatePicker style={{ width: "100%" }} />;
      default:
        return <Input placeholder={field.placeholder} />;
    }
  };

  return (
    <Modal
      open={Boolean(view)}
      title={view?.title}
      okText={view?.confirmText ?? "确定"}
      okButtonProps={{ danger: view?.danger, loading: pending }}
      cancelText="取消"
      width={view?.width ?? 520}
      onOk={handleOk}
      onCancel={close}
      forceRender
      maskClosable={!pending}
    >
      <div className={styles.modalMeta}>
        动作标识：<code>{action?.key}</code> · 权限标识：
        <code>{action?.permission ?? action?.key}</code> · 视图由注册表配置驱动
      </div>

      <Form form={form} layout="vertical" preserve={false}>
        {(view?.fields ?? []).map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[{ required: field.required, message: `请填写${field.label}` }]}
            extra={field.tip}
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>

      {sensitiveWords.length > 0 && (
        <Alert
          type="error"
          showIcon
          message={`检测到敏感词：${sensitiveWords.join("、")}，提交时会被公共中间件拦截`}
        />
      )}

      {action && (
        <Space className={styles.modalFooterHint} size={4} wrap>
          <span>链路：权限 → 表单校验 → 必填 → 敏感词 → 提交前钩子 → 业务 → 成功/失败回调</span>
        </Space>
      )}
    </Modal>
  );
}
