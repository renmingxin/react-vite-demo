export enum SystemSettingValue {
  /**
   * 暂存待办后竞争
   */
  AFTER_TEMPORARY_OR_SUBMIT = 0,

  /**
   * 提交后竞争
   */
  AFTER_SUBMIT = 1,

  //点击已阅按钮变已阅
  CLICK_TO_READ = 0,
  //查看变已阅
  VIEW_TO_READ = 1,

  /**
   * 他人待办消失
   */
  DISAPPEAR = 0,
  /**
   * 他人待办不消失，可继续处理，不影响流程流转
   */
  NOT_DISAPPEAR = 1,

  /**
   * 加签人员合并处理
   */
  ADD_NODE = "ADD_NODE",
  /**
   * 手动选择的人员合并处理
   */
  HAND = "HAND",

  /**
   * 按工作日计算
   */
  BY_WORKING_DAY = 0,
  /**
   * 按自然日计算
   */
  BY_CALENDAR_DAY = 1,

  /**
   * 收到待办时开始计算
   */
  RECEIVED = 0,
  /**
   * 查看待办时开始计算
   */
  VIEW = 1,
  /**
   * 暂存待办时开始计算
   */
  TEMPORARY = 2,

  /**
   * 处理人上次处理意见
   */
  LAST_OPINION = 0,
  /**
   * 处理人重复，自动处理
   */
  OPERATOR_REPEAT = 1,
  /**
   * 不留痕
   */
  NOT_OPINION = 2,

  /**
   * 上节点
   */
  UPPER_NODE = 0,
  /**
   * 发起者
   */
  INITIATOR = 1,
  /**
   * 指定节点
   */
  SPECIFIED_NODE = 2,

  //回退指定节点默认方式
  /**
   * 由前端用户选择-提交给我（原逻辑）
   */
  BACK_DEAL_BY_USER = 0,
  /**
   * 由前端用户选择-流程重走（原逻辑）
   */
  BACK_DEAL_BY_REPEAT = 1,
  /**
   * 提交给回退者（默认封装）
   */
  BACK_DEAL_BY_USER_DEFAULT = 2,
  /**
   * 流程重走（默认封装）
   */
  BACK_DEAL_BY_REPEAT_DEFAULT = 3,
  /**
   * 提交给我-提交给回退节点全部处理人
   */
  BACK_DEAL_BY_USER_TO_ALL = 4,
  /**
   * 提交给我（前端用户不能变更）-提交给回退节点全部处理人
   */
  BACK_DEAL_BY_USER_FIXED_TO_ALL = 5,
  /**
   * 加签
   */
  ADD_TAG = 0,

  /**
   * 加签并提交
   */
  ADD_TAG_SUBMIT = 1,
  /**
   * 加签、知会并提交
   */
  ADD_NOTIFY_SUBMIT = 2,
  /**
   * 是（提交时，弹出下节点）
   */
  TRUE = 1,
  /**
   * 否 (提交时，弹出下节点)
   */
  FALSE = 0,

  /**
   * 流程处理意见
   */
  //显示撤销前意见
  SHOW_CANCEL_OPINION = 1,
  //不显示撤销前意见
  UN_SHOW_CANCEL_OPINION = 0,
  /**
   * 督办操作意见
   */
  //显示督办意见
  SUPERVISE_OPINION_SHOW = 1,
  //不显示督办意见
  SUPERVISE_OPINION_NOT_SHOW = 0,
  // 加签默认设置
  ADD_BY_USER = 0,
  ADD_BY_DEFAULT = 1,

  //会签办理模式
  COUNTERSIGN_DEAL = 0,
  //会签咨询模式
  COUNTERSIGN_INNER_ADD = 1,
  // 会签默认设置
  JOINTLY_BY_USER = 0,
  JOINTLY_BY_DEFAULT = 1,

  /**
   * 发起者撤销
   */
  CAN_REPEAL = 1,
  CAN_NOT_REPEAL = 0,

  /**
   * 发起者终止
   */
  CAN_STOP = 1,
  CAN_NOT_STOP = 0,

  /**
   * 意见输入框
   */
  UPLOAD_ATTACHMENTS = 1,
  PERSONNEL = 2,
  RICH_TEXT = 3,
  //运行态流程图节点权限是否展示
  NAME_SHOW = 1,
  NAME_HIDDEN = 0,
  //运行态流程图多人策略图标是否展示
  ICON_SHOW = 1,
  ICON_HIDDEN = 0,
  //运行态流程图是否展示节点催办按钮
  URGE_SHOW = 1,
  URGE_HIDDEN = 0,
  //相同节点不关闭页面连续处理
  SAME_NODE_SOLVE_SHOW = 1,
  SAME_NODE_SOLVE_HIDDEN = 0,
  // 流程关注方式
  ATTENTION_NOT_RECIVE_MESSAGE = 0,
  ATTENTION_RECIVE_MESSAGE = 1,
  ATTENTION_DEFAULT = 2,
  /**知会并单独附言 */
  INFORM_AND_POSTSCRIPT = 0,
  /** 知会无附言 */
  INFORM_NO_POSTSCRIPT = 1,
  /**  知会并带入意见 */
  INFORM_AND_OPINION = 2,
  /**
   * 咨询意见所有人可见
   */
  ALL_PEOPLE_VISIBLE = 0,
  /**
   * 仅咨询人和被咨询人可见
   */
  PART_PEOPLE_VISIBLE = 1,
  /**
   * 激活节点时生成且动态更新
   */
  ACTIVATE_UPDATE = 1,
  /**
   * 激活节点时生成且不更新
   */
  ACTIVATE_WITHOUT_UPDATING = 2,
  /**
   * 发起流程时生成且不更新
   */
  INITIATE_WITHOUT_UPDATING = 3,
  /**
   * 回退待办正常处理
   */
  BACK_PENDING_NORMAL = 0,
  /**
   *  待办被取消，回退对象提交后再处理
   */
  BACK_PENDING_CANCEL = 1,
  /**
   * 回退流程重走，重置流程图
   */
  ROLLBACK_AND_RESET_PROCESS = 1,
  /**
   * 回退流程重走，不重置流程图
   */
  NOT_ROLLBACK_AND_RESET_PROCESS = 0,

  /**
   *  查看权限的选项值
   */
  ALL_PERMISSION = "ALL_PERMISSION",
  FLOW_CHART = "FLOW_CHART",
  /**
   * 取回单据默认方式:仅取回单据
   */
  WORKFLOW = 0,
  /**
   * 同时取回提交前所有加签/减签/会签信息
   */
  WORKFLOW_AND_ADD_DELETE_NODE = 1,
  /**
   *  由前端用户选择是否取回提交前加签/减签/会签信息
   */
  FRONT_SELECT_AND_ADD_DELETE_NODE = 2,
  /**
   * 撤回到上一处理人，不重新竞争
   */
  NOT_COMPETING_AGAIN = 0,
  /**
   * 撤回到竞争节点，重新竞争
   */
  COMPETING_AGAIN = 1,
  /**
   * 由前端用户选择
   */
  SELECTED_BY_USER = 2,
  /**
   * 集团化管控/显示机构简称/设计态/节点权限
   */
  DESIGN_NODE_PERMISSION = "designNodePermission",
  /**
   * 集团化管控/显示机构简称/设计态/自定义操作
   */
  DESIGN_ASSEMBLE_OPERATION = "designAssembleOperation",
  /**
   * 集团化管控/显示机构简称/运行态/流程模板
   */
  RUN_TEMPLATE = "runTemplate",
  /**
   * 已读能取回
   */
  READ_CAN_RETRIEVE = 1,
  /**
   * 已读不能取回
   */
  READ_NOT_RETRIEVE = 0,
}
export enum SystemSettingKey {
  /**
   * 咨询操作意见
   */
  AFFAIR_CONSULT_OPINION = "AFFAIR_CONSULT_OPINION",
  /**
   * 竞争处理方式
   */
  ACTIVITY_COMPETITION = "ACTIVITY_COMPETITION",
  //知会处理方式
  ACTIVITY_ADD_INFORM = "ACTIVITY_ADD_INFORM",
  /**
   * 竞争处理后他人处理方式
   */
  ACTIVITY_COMPETITION_OTHER = "ACTIVITY_COMPETITION_OTHER",
  /**
   * 并发处理后
   */
  ACTIVITY_PARALLEL_OTHER = "ACTIVITY_PARALLEL_OTHER",
  /**
   * 超期计算方式
   */
  OVERTIME_COMPUTE = "OVERTIME_COMPUTE",
  /**
   * 节点超期计算方式
   */
  OVERTIME_ACTIVITY_COMPUTE = "OVERTIME_ACTIVITY_COMPUTE",
  /**
   * 定时计算方式
   */
  TIMER_COMPUTE = "TIMER_COMPUTE",

  /**
   * 合并处理意见
   */
  ACTIVITY_MERGE = "ACTIVITY_MERGE",
  /**
   * 流程处理意见
   */
  BPM_OPINION = "BPM_OPINION",
  /**
   * 督办操作意见
   */
  SUPERVISE_OPINION = "SUPERVISE_OPINION",
  /**
   * 加签操作方式
   */
  ACTIVITY_ADD_OPERATE = "ACTIVITY_ADD_OPERATE",
  /**
   * 加签后，是否确认加签效果
   */
  NODE_SIGNATURE_EFFECT = "NODE_SIGNATURE_EFFECT",

  /**
   * 是否允许发起者撤销
   */
  STARTER_REPEAL = "STARTER_REPEAL",

  /**
   * 回退发起者待办
   */
  START_PENDING_REPEAL = "START_PENDING_REPEAL",

  /**
   * 是否允许发起者终止
   */
  STARTER_STOP = "STARTER_STOP",

  /**
   * 提交时，是否弹出下一节点信息
   */
  SUBMIT_SHOW_NEXT_NODE = "SUBMIT_SHOW_NEXT_NODE",
  /**
   * 模板编号是否必填
   */
  TEMPLATE_CODE = "TEMPLATE_CODE",

  /**
   * 加签操作方式
   */
  ACTIVITY_FALLBACK = "ACTIVITY_FALLBACK",

  // 加签由用户设置
  ACTIVITY_ADD_NODE = "ACTIVITY_ADD_NODE",

  /**
   * 加签、会签的更多设置是否默认展开
   */
  ACTIVITY_ADD_NODE_SETTING_MODE = "ACTIVITY_ADD_NODE_SETTING_MODE",

  // 回退流程重走，是否重置流程图
  ROLLBACK_AND_RESET_PROCESS = "ROLLBACK_AND_RESET_PROCESS",

  //会签模式
  ACTIVITY_COUNTERSIGN_MODE = "ACTIVITY_COUNTERSIGN_MODE",

  // 会签由用户设置
  ACTIVITY_JOINTLY = "ACTIVITY_JOINTLY",

  //回退指定节点默认方式
  BACK_SPECIFIED_NODE = "BACK_SPECIFIED_NODE",

  //意见输入框
  COMMENTS_INPUT_BOX_SETTING = "COMMENTS_INPUT_BOX_SETTING",

  //流程参数
  PROCESS_EVALUATE = "PROCESS_EVALUATE",

  //催办时间间隔
  HASTEN_TIME_SETTING = "HASTEN_TIME_SETTING",
  //运行态流程图是否展示节点权限
  NODE_PERMISSION_NAME_SHOW = "NODE_PERMISSION_NAME_SHOW",
  //运行态路程图是否展示多人策略图标
  NODE_MULTI_ICON_TYPE = "NODE_MULTI_ICON_TYPE",
  //运行态流程图是否展示节点催办按钮
  NODE_URGE_BUTTON = "NODE_URGE_BUTTON",
  // 相同节点不关闭页面连续处理
  SAME_NODE_CONTINUE_SOLVE = "SAME_NODE_CONTINUE_SOLVE",
  /**流程外人员操作权限 */
  NON_PROCESS_MEMBER_PERMISSION = "NON_PROCESS_MEMBER_PERMISSION",
  /**
   * 流程关注方式
   */
  PROCESS_ATTENTION_MODE = "PROCESS_ATTENTION_MODE",
  /**
   * 发起者默认关注
   */
  SENDER_DEFAULT_ATTENTION = "SENDER_DEFAULT_ATTENTION",
  /**
   * 流程结束后不再关注
   */
  AUTO_UNFOLLOW_COMPLETED_CASE = "AUTO_UNFOLLOW_COMPLETED_CASE",
  /**
   * 提交时，选人选分支弹窗显示分支内容
   */
  SUBMIT_SHOW_LINK_NAME = "SUBMIT_SHOW_LINK_NAME",
  /*
   * 知会操作方式
   */
  ACTIVITY_INFORM_OPERATE = "ACTIVITY_INFORM_OPERATE",
  /**
   * 取回单据默认方式
   */
  TAKE_BACK_OPERATION = "TAKE_BACK_OPERATION",
  /**
   * 动态标题生效实际
   */
  DYNAMIC_TITLE_GENERATION_METHOD = "DYNAMIC_TITLE_GENERATION_METHOD",
  /**
   * 回退后是否消除待办的模式
   */
  BACK_TO_ME_MODE = "BACK_TO_ME_MODE",
  /**
   * 发起时间查询范围
   */
  PROCESS_MONITOR_SEND_TIME_SCOPE = "PROCESS_MONITOR_SEND_TIME_SCOPE",
  /**
   * PC端意见输入交互方式
   */
  PC_OPINION_SHOW_TYPE = "PC_OPINION_SHOW_TYPE",
  /**
   * 移动端意见输入交互方式
   */
  MOBILE_OPINION_SHOW_TYPE = "MOBILE_OPINION_SHOW_TYPE",
  /**
   * 查看权限
   */
  PROCESS_MONITOR_AND_VIEW_PERMISSION = "PROCESS_MONITOR_AND_VIEW_PERMISSION",
  /**
   * 操作权限
   */
  PROCESS_MONITOR_AND_OPERATION_PERMISSION = "PROCESS_MONITOR_AND_OPERATION_PERMISSION",
  /*
   * 流程节点属性设置
   */
  HUMANACTIVITY_DEFAULT_VALUE = "HUMANACTIVITY_DEFAULT_VALUE",

  /**
   * 流程督办是否必填
   */
  SUPERVISORY_REMARKS_MUST_INPUT = "SUPERVISORY_REMARKS_MUST_INPUT",
  /**
   * 流程操作选人上限
   */
  FLOW_USER_LIMIT_SETTING = "FLOW_USER_LIMIT_SETTING",
  /**
   *  加签节点名称
   */
  ACTIVITY_ADD_NODE_NAME = "ACTIVITY_ADD_NODE_NAME",
  /**
   * 提交是否需要二次确认
   */
  SUBMIT_SECOND_CONFIRM_MODE = "SUBMIT_SECOND_CONFIRM_MODE",
  /**
   * 竞争节点取回方式
   */
  COMPETITION_RETRIEVAL_METHOD = "COMPETITION_RETRIEVAL_METHOD",
  /**
   * 回退到竞争节点处理方式
   */
  STEP_BACK_TO_COMPETITION_DEAL_METHOD = "STEP_BACK_TO_COMPETITION_DEAL_METHOD",
  /**
   * 提交时，是否支持添加知会人
   */
  SUBMIT_SUPPORT_ADD_INFORM = "SUBMIT_SUPPORT_ADD_INFORM",
  /**
   * 集团化管控-显示机构简称
   */
  SHOW_CREATE_ACCOUNT = "SHOW_CREATE_ACCOUNT",

  /**
   * 集团化管控-显示机构简称-设计态(前端自用)
   */
  SHOW_CREATE_ACCOUNT_DESIGN = "SHOW_CREATE_ACCOUNT_DESIGN",

  /**
   * 集团化管控-显示机构简称-运行态(前端自用)
   */
  SHOW_CREATE_ACCOUNT_RUNTIME = "SHOW_CREATE_ACCOUNT_RUNTIME",
  /**
   * 后续节点事项已读是否可以取回
   */
  READ_CAN_RETRIEVE = "READ_CAN_RETRIEVE",
}

export interface SystemSettingState {
  settings: SystemSettingType[];
  loading: boolean;
}
export interface SystemSettingType {
  /**
   * 默认值
   */
  defaultValue: string;
  /**
   * 字段名
   */
  key: SystemSettingKey;
  /**
   * 当前值
   */
  value: string;

  /**
   * 可选项
   */
  options?: any;

  /**
   * 说明
   */
  remark?: string;

  /**
   * 是否单选
   */
  radio: boolean;
}
export type SystemCode = keyof typeof SystemSettingKey;
export interface SystemSettingExtendType {
  code: SystemCode;
  content: string;
  validate: boolean;
}

export interface DataType {
  /**
   * Form.Item name
   */
  key: keyof typeof SystemSettingKey;
  /**
   * 一级分类名
   */
  category1: ReactNode;
  /**
   * 二级分类名
   */
  category2: ReactNode;
  /**
   * 组件类型
   */
  type: "custom" | "select" | "checkbox" | "radio";
  /**
   * 如果组件类型为custom 则需要指定所渲染的组件名称
   */
  componentName?: string;
  /**
   * 组件所需的props
   */
  componentProps?: Record<string, any>;
  /**
   * 用于 select | checkbox | radio 等组件的options属性
   */
  options?: any[];
  /**
   * 一级分类合并行数
   */
  category1RowSpan?: number;
  /**
   * 二级分类合并行数
   */
  category2RowSpan?: number;
}
