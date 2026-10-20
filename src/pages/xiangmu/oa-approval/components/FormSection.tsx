import { Input, InputNumber, Radio, Select } from "antd";
import { selectForm, shallowEqual, useDispatch, useStoreData } from "../store";
import Card from "./Card";
import { useRenderCount } from "./useRenderCount";
import styles from "../index.module.less";

const DEPARTMENTS = [
  { label: "财务部", value: "财务部" },
  { label: "市场部", value: "市场部" },
  { label: "研发部", value: "研发部" },
  { label: "法务部", value: "法务部" },
];

/**
 * 表单区：只订阅 form 切片。
 * 摘要详情 / 流程轨迹变化时，这里的 render 计数不会动。
 */
export default function FormSection() {
  const form = useStoreData(selectForm, shallowEqual);
  const dispatch = useDispatch();
  const count = useRenderCount();

  return (
    <Card title="单据表单（可编辑）" counter={count}>
      <div className={styles.formGrid}>
        <label className={styles.formLabel}>
          报销金额
          <InputNumber
            style={{ width: "100%" }}
            value={form.amount}
            min={0}
            step={1000}
            onChange={(value) => dispatch.form.patch({ amount: Number(value ?? 0) })}
          />
        </label>

        <label className={styles.formLabel}>
          归属部门
          <Select
            value={form.department}
            options={DEPARTMENTS}
            onChange={(value) => dispatch.form.patch({ department: value })}
          />
        </label>

        <label className={styles.formLabel}>
          紧急程度
          <Radio.Group
            optionType="button"
            value={form.urgency}
            options={[
              { label: "普通", value: "normal" },
              { label: "加急", value: "urgent" },
            ]}
            onChange={(event) => dispatch.form.patch({ urgency: event.target.value })}
          />
        </label>
      </div>

      <label className={styles.formLabel}>
        报销事由
        <Input
          value={form.reason}
          onChange={(event) => dispatch.form.patch({ reason: event.target.value })}
        />
      </label>

      <label className={styles.formLabel}>
        备注
        <Input.TextArea
          rows={2}
          value={form.remark}
          placeholder="修改表单只会让本卡片重渲染，其他卡片计数不变"
          onChange={(event) => dispatch.form.patch({ remark: event.target.value })}
        />
      </label>
    </Card>
  );
}
