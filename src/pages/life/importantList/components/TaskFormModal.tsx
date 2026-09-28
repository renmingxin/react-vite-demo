import React from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Tooltip,
  Button,
} from "antd";
import { BellOutlined, NotificationOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import type { QuadrantKey, TaskFormValues, TaskItem } from "../types";
import { QUADRANTS } from "../constants";
import { ensureNotificationPermission } from "../hooks/useReminder";

interface Props {
  open: boolean;
  /** 编辑时传入；新增时为 undefined */
  editing?: TaskItem;
  /** 新增时的默认象限（来自某列的 +） */
  defaultQuadrant?: QuadrantKey;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues, editingId?: string) => void;
}

interface FormValues {
  title: string;
  description?: string;
  quadrant: QuadrantKey;
  remindAt?: Dayjs;
}

const TaskFormModal: React.FC<Props> = ({
  open,
  editing,
  defaultQuadrant,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<FormValues>();
  const isEdit = !!editing;

  // 用 initialValues 做回填：配合下面的 key，每次打开/切换对象都会重新挂载并初始化
  const initialValues: FormValues = isEdit
    ? {
        title: editing!.title,
        description: editing!.description,
        quadrant: editing!.quadrant,
        remindAt: editing!.remindAt ? dayjs(editing!.remindAt) : undefined,
      }
    : {
        title: "",
        description: "",
        quadrant: defaultQuadrant || "urgentImportant",
        remindAt: undefined,
      };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const title = (values.title || "").trim();
      if (!title) {
        message.warning("请填写事项标题");
        return;
      }
      const payload: TaskFormValues = {
        title,
        description: values.description?.trim() || undefined,
        // 编辑时象限锁定，仍以原象限提交（防止被篡改）
        quadrant: editing ? editing.quadrant : values.quadrant,
        remindAt: values.remindAt ? values.remindAt.toISOString() : undefined,
      };
      onSubmit(payload, editing?.id);
    } catch {
      /* 表单校验失败时 antd 已提示 */
    }
  };

  const handleRequestNotification = async () => {
    const res = await ensureNotificationPermission();
    if (res === "granted") {
      message.success("已开启浏览器通知权限");
    } else if (res === "denied") {
      message.warning(
        "通知权限被拒绝，请在浏览器地址栏的锁图标中手动开启",
      );
    } else if (res === "unsupported") {
      message.warning("当前浏览器不支持系统通知");
    } else {
      message.info("通知权限未授权");
    }
  };

  // 选了时间时，如果权限还是 default，主动请求一次
  const handleRemindChange = (val: Dayjs | null) => {
    if (val && typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        handleRequestNotification();
      }
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "编辑事项" : "新增事项"}
      okText={isEdit ? "保存" : "添加"}
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      maskClosable={false}
      // 兜底：打开动画结束后再同步一次，确保编辑数据一定回填成功
      afterOpenChange={(visible) => {
        if (!visible) return;
        if (editing) {
          form.setFieldsValue({
            title: editing.title,
            description: editing.description,
            quadrant: editing.quadrant,
            remindAt: editing.remindAt ? dayjs(editing.remindAt) : undefined,
          });
        } else {
          form.setFieldsValue({
            quadrant: defaultQuadrant || "urgentImportant",
          });
        }
      }}
    >
      <Form
        form={form}
        // key 变化时强制重新挂载，确保 initialValues 每次都生效（回填的关键）
        key={editing?.id ?? "create"}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item
          label="事项标题"
          name="title"
          rules={[{ required: true, message: "请输入事项标题" }]}
        >
          <Input placeholder="例如：提交季度报告" maxLength={50} showCount />
        </Form.Item>

        <Form.Item label="备注（可选）" name="description">
          <Input.TextArea
            placeholder="可以补充背景、目标或下一步动作"
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="所属象限"
          name="quadrant"
          rules={[{ required: true, message: "请选择象限" }]}
          extra={
            isEdit
              ? "编辑时不可修改象限；如需调整，请把卡片拖到目标象限"
              : undefined
          }
        >
          <Radio.Group buttonStyle="solid" disabled={isEdit}>
            {QUADRANTS.map((q) => (
              <Radio.Button key={q.key} value={q.key}>
                <span style={{ color: isEdit ? undefined : q.color }}>
                  {q.title}
                </span>
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <BellOutlined style={{ marginRight: 6 }} />
              定时提醒（可选）
            </span>
          }
          name="remindAt"
          tooltip="到达时间后会播放提示音、发送浏览器通知并弹窗提醒"
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder="选择提醒时间"
            style={{ width: "100%" }}
            onChange={handleRemindChange}
            showNow={false}
          />
        </Form.Item>

        <Tooltip title="开启浏览器系统通知，定时到达时即使不在当前页面也能收到提醒">
          <Button
            type="link"
            icon={<NotificationOutlined />}
            onClick={handleRequestNotification}
            style={{ padding: 0 }}
          >
            点击开启浏览器通知权限
          </Button>
        </Tooltip>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
