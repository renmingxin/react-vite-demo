import { Table, Form, Radio, Checkbox, Tooltip, Tabs, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import NodePropertiesSetting from "./components/NodePropertiesSetting";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { SystemSettingKey, type DataType } from "./type";

const componentMap = {
  NodePropertiesSetting,
};
// 根据记录类型渲染不同的表单控件
const renderFormControl = (record: DataType) => {
  const { componentName, type, options = [], componentProps = {} } = record;
  if (type === "custom") {
    const Component = componentMap[componentName];
    return Component ? <Component /> : null;
  }
  switch (type) {
    case "radio":
      return <Radio.Group {...componentProps} options={options} />;
    case "checkbox":
      return <Checkbox.Group {...componentProps} options={options} />;
    case "select":
      return <Select {...componentProps} options={options} />;
    default:
      return <span>1111</span>;
  }
};
const dataSource: DataType[] = [
  {
    key: SystemSettingKey.TEMPLATE_CODE,
    category1: "流程模板信息",
    category2: "流程模板编号必填",
    category1RowSpan: 2,
    type: "radio",
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 0 },
    ],
  },
  {
    key: SystemSettingKey.DYNAMIC_TITLE_GENERATION_METHOD,
    category1: "流程模板信息",
    category2: "动态标题生成机制",
    type: "radio",
    category1RowSpan: 0,
    options: [
      { label: "激活节点时生成且动态更新", value: 1 },
      { label: "激活节点时生成且不更新", value: 2 },
      {
        label: (
          <div>
            <span>发起流程时生成且不更新</span>
            <Tooltip title={"该模式下所有节点的标题取发起时的流程动态标题"}>
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        ),
        value: 3,
      },
    ],
  },
  {
    key: SystemSettingKey.HUMANACTIVITY_DEFAULT_VALUE,
    category1: "流程属性默认值",
    category2: "节点属性",
    type: "custom",
    componentName: "NodePropertiesSetting",
  },

  {
    key: SystemSettingKey.ACTIVITY_COMPETITION,
    category1: "节点处理方式",
    category2: "竞争处理方式",
    type: "checkbox",
    options: [
      { label: "提交", value: "0", disabled: true }, // SUBMIT
      { label: "暂存待办", value: "1" }, // TEMPORARY
      { label: "知会", value: "2" }, // NOTICE
      { label: "移交", value: "3" }, // TRANSFER
      { label: "咨询", value: "4" }, // AFFAIR_CONSULT
    ],
    category1RowSpan: 10,
  },
  {
    key: SystemSettingKey.ACTIVITY_ADD_INFORM,
    category1: "节点处理方式",
    category2: "知会处理方式",
    type: "radio",
    options: [
      { label: "点击按钮变已阅", value: 0 },
      { label: "查看变已阅", value: 1 },
    ],
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.ACTIVITY_MERGE,
    category1: "节点处理方式",
    category2: "合并处理意见",
    type: "radio",
    options: [
      { label: "处理人上次处理意见", value: 0 },
      { label: "处理人重复，自动处理", value: 1 },
      { label: "不留痕", value: 2 },
    ],
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.BPM_OPINION,
    category1: "节点处理方式",
    category2: "流程处理意见",
    type: "radio",
    options: [
      { label: "显示撤销前意见", value: 1 },
      { label: "不显示撤销前意见", value: 0 },
    ],
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.AFFAIR_CONSULT_OPINION,
    category1: "节点处理方式",
    category2: (
      <div>
        <span>咨询操作意见</span>
        <Tooltip title={"包括咨询附言、咨询意见，配置意见的可见范围"}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
    ),
    type: "radio",
    options: [
      { label: "所有人可见", value: 0 },
      { label: "仅咨询人和被咨询人可见", value: 1 },
    ],
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.ACTIVITY_FALLBACK,
    category1: "节点处理方式",
    category2: "回退默认方式",
    type: "radio",
    options: [
      { label: "上节点", value: 0 },
      { label: "发起者", value: 1 },
      { label: "指定节点", value: 2 },
    ],
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.BACK_SPECIFIED_NODE,
    category1: "节点处理方式",
    category2: "回退对象默认处理方式",
    type: "radio",
    options: [
      { label: "1", value: 0 },
      { label: "2", value: 1 },
      { label: "3", value: 2 },
    ],
    category1RowSpan: 0,
  },

  {
    key: SystemSettingKey.PROCESS_MONITOR_AND_OPERATION_PERMISSION,
    category1: "流程督办和运维监控",
    category2: "流程监控操作权限",
    type: "checkbox",
    category1RowSpan: 3,
  },
  {
    key: SystemSettingKey.SUPERVISE_OPINION,
    category1: "流程督办和运维监控",
    category2: "流程督办和运维监控操作意见",
    type: "radio1",
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.SUPERVISORY_REMARKS_MUST_INPUT,
    category1: "流程督办和运维监控",
    category2: "流程督办和运维监控操作附言",
    type: "radio2",
    category1RowSpan: 0,
  },
  {
    key: SystemSettingKey.SHOW_CREATE_ACCOUNT_DESIGN,
    category1: "集团化管控",
    category2: "显示创建机构简称",
    type: "checkbox",
    options: [
      { label: "提交", value: "0", disabled: true }, // SUBMIT
      { label: "暂存待办", value: "1" }, // TEMPORARY
      { label: "知会", value: "2" }, // NOTICE
      { label: "移交", value: "3" }, // TRANSFER
      { label: "咨询", value: "4" }, // AFFAIR_CONSULT
    ],
    category1RowSpan: 2,
    category2RowSpan: 2,
  },
  {
    key: SystemSettingKey.SHOW_CREATE_ACCOUNT_RUNTIME,
    category1: "集团化管控",
    category2: "显示创建机构简称",
    type: "checkbox",
    options: [
      { label: "提交", value: "0", disabled: true }, // SUBMIT
      { label: "暂存待办", value: "1" }, // TEMPORARY
      { label: "知会", value: "2" }, // NOTICE
      { label: "移交", value: "3" }, // TRANSFER
      { label: "咨询", value: "4" }, // AFFAIR_CONSULT
    ],
    category1RowSpan: 0,
    category2RowSpan: 0,
  },
];
const dataSource2: any[] = [
  {
    key: SystemSettingKey.PROCESS_MONITOR_SEND_TIME_SCOPE,
    category1: "流程督办和运维监控",
    category2: "发起时间查询范围",
    type: "select",
    componentProps: {
      style: {
        width: "200px",
      },
    },
    options: [
      { label: "一周", value: 0 },
      { label: "一个月", value: 1 },
      { label: "三个月", value: 2 },
      { label: "半年", value: 3 },
      { label: "一年", value: 4 },
    ],
  },
];

const cellProps = {
  style: {
    padding: "0 20px",
  },
};

const columns: ColumnsType<DataType> = [
  {
    title: "一级分类",
    dataIndex: "category1",
    width: "20%",
    render: (data) => {
      return <div>{data}</div>;
    },
    onHeaderCell: () => cellProps,
    onCell: (record) => {
      return {
        ...cellProps,
        rowSpan: record.category1RowSpan,
      };
    },
  },
  {
    title: "二级分类",
    dataIndex: "category2",
    width: "25%",
    render: (data) => {
      return <div>{data}</div>;
    },
    onHeaderCell: () => cellProps,
    onCell: (record) => {
      return {
        ...cellProps,
        rowSpan: record.category2RowSpan,
      };
    },
  },
  {
    title: "设置项",
    dataIndex: "sysCol",
    width: "55%",
    onHeaderCell: () => cellProps,
    onCell: () => cellProps,
    render: (_, record) => {
      return (
        <Form.Item name={record.key} noStyle>
          {renderFormControl(record)}
        </Form.Item>
      );
    },
  },
];

const systemMenuList = [
  {
    label: "业务参数",
    key: "0",
  },
  {
    label: "性能参数",
    key: "1",
  },
];
const App: React.FC = () => {
  const [form] = Form.useForm();
  const [active, setActive] = useState("0");

  (window as any).form = form;

  useEffect(() => {
    const data = {
      TEMPLATE_CODE: 1,
      DYNAMIC_TITLE_GENERATION_METHOD: 3,
      HUMANACTIVITY_DEFAULT_VALUE: {
        matchScope: "0",
        assignMode: "0",
        matchNo: {
          na: "0",
          naUserId: "",
        },
        multiplePeople: {
          multipleExecuteMode: "1",
          finishedType: "3",
          finishedValue: "",
          serialType: "0",
        },
        mergeDealType: [],
        noPeopleUpMatchRange: "2",
        defaultSelectAll: "0",
      },
      ACTIVITY_COMPETITION: "0,1",
      ACTIVITY_ADD_INFORM: 0,
      ACTIVITY_MERGE: 0,
      BPM_OPINION: 1,
      AFFAIR_CONSULT_OPINION: 1,
      ACTIVITY_FALLBACK: 0,
      BACK_SPECIFIED_NODE: 3,
      BACK_TO_ME_MODE: 0,
      ROLLBACK_AND_RESET_PROCESS: 1,
      ACTIVITY_ADD_NODE_SETTING_MODE: 1,
      ACTIVITY_ADD_NODE: 0,
      ACTIVITY_COUNTERSIGN_MODE: 1,
      ACTIVITY_JOINTLY: 1,
      ACTIVITY_ADD_OPERATE: 2,
      NODE_SIGNATURE_EFFECT: 1,
      ACTIVITY_ADD_NODE_NAME: '{"type":0,"value":"{\\"zh_CN\\":\\"123\\"}"}',
      ACTIVITY_INFORM_OPERATE: 0,
      TAKE_BACK_OPERATION: 0,
      READ_CAN_RETRIEVE: 0,
      COMPETITION_RETRIEVAL_METHOD: 0,
      STEP_BACK_TO_COMPETITION_DEAL_METHOD: 0,
      PROCESS_ATTENTION_MODE: 2,
      SENDER_DEFAULT_ATTENTION: true,
      AUTO_UNFOLLOW_COMPLETED_CASE: true,
      SUBMIT_SHOW_NEXT_NODE: 1,
      SUBMIT_SECOND_CONFIRM_MODE: 1,
      SUBMIT_SHOW_LINK_NAME: 1,
      SUBMIT_SUPPORT_ADD_INFORM: 1,
      STARTER_REPEAL: 1,
      START_PENDING_REPEAL: 1,
      STARTER_STOP: 1,
      SAME_NODE_CONTINUE_SOLVE: 0,
      COMMENTS_INPUT_BOX_SETTING: {
        validate: true,
        id: null,
        attachmentShow: "true",
        attachmentPc: "false",
        attachmentMobile: "false",
        commonPhrases: "false",
        richText: "false",
        opinionHide: true,
        atHide: false,
        associatedDoc: false,
        dealIdentity: false,
        attitudeEnumDtoList: [
          {
            validate: true,
            id: "7448397862445562711",
            name: '{"zh_TW":"态度5","en":"态度5","ar":"态度5","zh_CN":"枚举停用"}',
            code: "meijutingyong",
            orderNo: 5,
            enable: false,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "-5581775177741574746",
                name: '{"zh_CN":"态度1","zh_TW":"态度1","en":"态度1","ar":"态度1"}',
                itemValue: "taidu1",
                enable: true,
                enumCode: "meijutingyong",
                orderNo: 1,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "-7155141242340703808",
            name: '{"zh_CN":"是否同意雪娃娃撒旦打发士大夫生东风撒地方","zh_TW":"的撒按时FSADF DSA DS DF1","en":"态度612345678901234567"}',
            code: "sftyxwwsddfsdfsdfsdf",
            orderNo: 6,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "370323971016057544",
                name: '{"zh_CN":"同意防擦撒打发1234567891234","zh_TW":"态度1从v发士大夫VCD删除12","en":"态度1俄国人发vDVD给v的风格v反对1"}',
                itemValue: "shifoutongyi12344ceshishihisfdnnfdssdfdsfsd",
                enable: true,
                enumCode: "sftyxwwsddfsdfsdfsdf",
                orderNo: 1,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "-6138261722612728229",
            name: '{"zh_CN":"态度11","zh_TW":"态度11","en":"态度11","ar":"态度11"}',
            code: "taidu11",
            orderNo: 11,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "-141722624542504846",
                name: '{"zh_CN":"态度2","zh_TW":"态度2","en":"态度2","ar":"态度2"}',
                itemValue: "taidu2",
                enable: true,
                enumCode: "taidu11",
                orderNo: 2,
                delete: false,
              },
              {
                validate: true,
                id: "3194274330353877178",
                name: '{"zh_CN":"态度1","zh_TW":"态度1","en":"态度1","ar":"态度1"}',
                itemValue: "taidu1",
                enable: true,
                enumCode: "taidu11",
                orderNo: 1,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "-4916690943972118151",
            name: '{"zh_TW":"态度10","en":"态度10","ar":"态度10","zh_CN":"演示态度"}',
            code: "yanshitaidu",
            orderNo: 10,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "-568374341533482499",
                name: '{"zh_TW":"态度2","en":"态度2","ar":"态度2","zh_CN":"不同意"}',
                itemValue: "butongyi",
                enable: true,
                enumCode: "yanshitaidu",
                orderNo: 2,
                delete: false,
              },
              {
                validate: true,
                id: "3944188155954599265",
                name: '{"zh_TW":"态度1","en":"态度1","ar":"态度1","zh_CN":"同意"}',
                itemValue: "tongyi",
                enable: true,
                enumCode: "yanshitaidu",
                orderNo: 1,
                delete: false,
              },
              {
                validate: true,
                id: "-2774523869632754720",
                name: '{"zh_TW":"态度3","en":"态度3","ar":"态度3","zh_CN":"已阅"}',
                itemValue: "yiyue",
                enable: true,
                enumCode: "yanshitaidu",
                orderNo: 3,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "6716035409441376882",
            name: '{"zh_TW":"态度2","en":"态度2","ar":"态度2","zh_CN":"是否合规"}',
            code: "shifouhegui",
            orderNo: 2,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "5589715527596986361",
                name: '{"zh_TW":"态度1","en":"态度1","ar":"态度1","zh_CN":"合规"}',
                itemValue: "hegui",
                enable: true,
                enumCode: "shifouhegui",
                orderNo: 1,
                delete: false,
              },
              {
                validate: true,
                id: "8561558625908302764",
                name: '{"zh_TW":"态度2","en":"态度2","ar":"态度2","zh_CN":"不合规"}',
                itemValue: "buhegui",
                enable: true,
                enumCode: "shifouhegui",
                orderNo: 2,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "5862855961636032090",
            name: '{"zh_TW":"态度3","en":"态度3","ar":"态度3","zh_CN":"枚举项均停用"}',
            code: "meijuxiangjuntingyong",
            orderNo: 3,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "-696317059636465772",
                name: '{"zh_CN":"态度1","zh_TW":"态度1","en":"态度1","ar":"态度1"}',
                itemValue: "taidu1",
                enable: false,
                enumCode: "meijuxiangjuntingyong",
                orderNo: 1,
                delete: false,
              },
              {
                validate: true,
                id: "-4346392846638359412",
                name: '{"zh_CN":"态度2","zh_TW":"态度2","en":"态度2","ar":"态度2"}',
                itemValue: "taidu2",
                enable: false,
                enumCode: "meijuxiangjuntingyong",
                orderNo: 2,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "-3554420187485749002",
            name: '{"zh_TW":"态度9","en":"态度9","ar":"态度9","zh_CN":"三合一"}',
            code: "sanheyi",
            orderNo: 9,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "5349109811739933894",
                name: '{"zh_TW":"态度2","en":"态度2","ar":"态度2","zh_CN":"同意"}',
                itemValue: "tongyi",
                enable: true,
                enumCode: "sanheyi",
                orderNo: 2,
                delete: false,
              },
              {
                validate: true,
                id: "6506062723892324935",
                name: '{"zh_CN":"不同意","zh_TW":"态度3","en":"态度3","ar":"态度3"}',
                itemValue: "butongyi",
                enable: true,
                enumCode: "sanheyi",
                orderNo: 3,
                delete: false,
              },
              {
                validate: true,
                id: "2639605435560279026",
                name: '{"zh_CN":"已阅","zh_TW":"态度1","en":"态度1","ar":"态度1"}',
                itemValue: "yiyue",
                enable: true,
                enumCode: "sanheyi",
                orderNo: 1,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "7252946522241561887",
            name: '{"zh_CN":"是否同意","zh_TW":"态度1","en":"态度1","ar":"态度1"}',
            code: "shifoutongyi",
            orderNo: 1,
            enable: true,
            delete: false,
            enumItemList: [
              {
                validate: true,
                id: "6585045004319059426",
                name: '{"zh_TW":"态度1","en":"态度1","ar":"态度1","zh_CN":"同意"}',
                itemValue: "tongyi",
                enable: true,
                enumCode: "shifoutongyi",
                orderNo: 1,
                delete: false,
              },
              {
                validate: true,
                id: "4442137900226358041",
                name: '{"zh_TW":"态度3","en":"态度3","ar":"态度3","zh_CN":"同意个6"}',
                itemValue: "tongyige6",
                enable: true,
                enumCode: "shifoutongyi",
                orderNo: 3,
                delete: false,
              },
              {
                validate: true,
                id: "3091422629226540497",
                name: '{"zh_TW":"态度4","en":"态度4","ar":"态度4","zh_CN":"不同意个6"}',
                itemValue: "butongyige6",
                enable: true,
                enumCode: "shifoutongyi",
                orderNo: 4,
                delete: false,
              },
              {
                validate: true,
                id: "-345896711917409863",
                name: '{"zh_CN":"态度5","zh_TW":"态度5","en":"态度5","ar":"态度5"}',
                itemValue: "taidu5",
                enable: true,
                enumCode: "shifoutongyi",
                orderNo: 5,
                delete: false,
              },
              {
                validate: true,
                id: "5658146394486443292",
                name: '{"zh_TW":"态度2","en":"态度2","ar":"态度2","zh_CN":"不同意"}',
                itemValue: "butongyi",
                enable: true,
                enumCode: "shifoutongyi",
                orderNo: 2,
                delete: false,
              },
            ],
          },
          {
            validate: true,
            id: "-7801813373211999074",
            name: '{"zh_CN":"态度8","zh_TW":"态度8","en":"态度8","ar":"态度8"}',
            code: "meijutingyong256",
            orderNo: 8,
            enable: true,
            delete: false,
            enumItemList: [],
          },
          {
            validate: true,
            id: "8353264677605283247",
            name: '{"zh_TW":"态度4","en":"态度4","ar":"态度4","zh_CN":"无枚举项"}',
            code: "wumeijuxiang",
            orderNo: 4,
            enable: true,
            delete: false,
            enumItemList: [],
          },
          {
            validate: true,
            id: "3100479226184448160",
            name: '{"zh_CN":"态度7","zh_TW":"态度7","en":"态度7","ar":"态度7"}',
            code: "meijutingyong234",
            orderNo: 7,
            enable: true,
            delete: false,
            enumItemList: [],
          },
        ],
        mPhraseStyle: "open",
      },
      PC_OPINION_SHOW_TYPE: 1,
      MOBILE_OPINION_SHOW_TYPE: 0,
      FLOW_USER_LIMIT_SETTING: {
        type: "1",
        count: 20,
      },
      OVERTIME_COMPUTE: 0,
      HASTEN_TIME_SETTING: {
        time: 0,
        unit: "min",
      },
      NODE_PERMISSION_NAME_SHOW: 1,
      NODE_MULTI_ICON_TYPE: 1,
      NODE_URGE_BUTTON: 1,
      NON_PROCESS_MEMBER_PERMISSION: "0,1,2",
      PROCESS_MONITOR_AND_OPERATION_PERMISSION:
        "VIEW_FORM,HASTEN,REPLACE,SKIP,STEP_BACK,ADJUST_HANDLER,STOP,REPEAL,PROCESS_PAUSE,EDIT_PROCESS,PROCESS_RELIVE",
      SUPERVISE_OPINION: 1,
      SUPERVISORY_REMARKS_MUST_INPUT: 0,
      SHOW_CREATE_ACCOUNT_DESIGN: [
        "designNodePermission",
        "designAssembleOperation",
      ],
      SHOW_CREATE_ACCOUNT_RUNTIME: ["runTemplate"],
      PROCESS_MONITOR_SEND_TIME_SCOPE: 2,
    };
    form.setFieldsValue(data);
  }, []);
  return (
    <div className={styles.systemSetting}>
      <Tabs
        style={{ flex: "0 0 62px" }}
        className={styles.systemMenu}
        activeKey={active}
        items={systemMenuList}
        onChange={setActive}
      />
      <Form form={form}>
        <Table
          columns={columns}
          dataSource={active === "0" ? dataSource : dataSource2}
          bordered
          pagination={false}
          onRow={(record) => ({ style: { height: 60 } })}
          onHeaderRow={(record) => ({
            style: { height: 60 },
          })}
        />
      </Form>
    </div>
  );
};

export default App;
