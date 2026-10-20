import { registerAction } from "../core/registry";
import type { ApprovalAction } from "../types";

import addSign from "./addSign";
import agree from "./agree";
import archive from "./archive";
import batchAgree from "./batchAgree";
import carbonCopy from "./carbonCopy";
import comment from "./comment";
import countersign from "./countersign";
import delegate from "./delegate";
import disagree from "./disagree";
import fetchBack from "./fetchBack";
import jump from "./jump";
import notify from "./notify";
import print from "./print";
import reject from "./reject";
import reopen from "./reopen";
import revoke from "./revoke";
import rollback from "./rollback";
import saveDraft from "./saveDraft";
import submit from "./submit";
import suspend from "./suspend";
import terminate from "./terminate";
import transfer from "./transfer";
import urge from "./urge";

/**
 * 动作注册表（显式注册）。
 *
 * 新增一个审批按钮只需要两步：
 * 1. 在 actions/ 下新增一个文件，声明 { permission, handler, view }；
 * 2. 在下面的数组里追加一项。
 *
 * 工具栏、弹窗宿主、命令分发器都不用改 —— 这就是「新增按钮 = 新增目录 + 一个 case 分支」
 * 那套约定的落地形态。刻意不用 import.meta.glob 自动收集，是为了让注册关系可读、可枚举、
 * 也方便后续按角色做按需加载（改成 dynamic import 时调用点只有这里）。
 */
const ACTIONS: ApprovalAction[] = [
  submit,
  agree,
  disagree,
  rollback,
  reject,
  countersign,
  addSign,
  notify,
  transfer,
  delegate,
  fetchBack,
  revoke,
  terminate,
  carbonCopy,
  urge,
  archive,
  saveDraft,
  comment,
  batchAgree,
  print,
  jump,
  suspend,
  reopen,
];

ACTIONS.forEach(registerAction);

export default ACTIONS;
