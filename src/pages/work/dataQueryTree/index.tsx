import React from "react";
import { TreeSelect } from "antd";
function DataQuery() {
  const treeData = [
    {
        "key": "ECMiuywITGm7nTgu2povM",
        "title": "实体1子实体1",
        "children": [
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"create_time\"}",
                "title": "创建时间",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "create_time",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.createTime",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "DATETIME",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"update_time\"}",
                "title": "更新时间",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "update_time",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.updateTime",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "DATETIME",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"parent_id\"}",
                "title": "实体1",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "parent_id",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.parentId",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "ENTITY",
                "multiSelect": false,
                "businessProps": {
                    "applicationName": "",
                    "fullName": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1",
                    "appName": "renmxkzfa2590901710624345589",
                    "useComp": false,
                    "multiSelect": false
                }
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"order_no\"}",
                "title": "排序号",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "order_no",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.orderNo",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "INTEGER",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"st1zst1wb1\"}",
                "title": "实体1子实体1文本1",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "st1zst1wb1",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.st1zst1wb1",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "STRING",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"st1zst1wb2\"}",
                "title": "实体1子实体1文本2",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "st1zst1wb2",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.st1zst1wb2",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "STRING",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"st1zst1xxj\"}",
                "title": "实体1子实体1选项集",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "st1zst1xxj",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.st1zst1xxj",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "ENUM",
                "multiSelect": true,
                "businessProps": {
                    "treeData": [
                        {
                            "label": "男",
                            "value": "MALE",
                            "code": "0"
                        },
                        {
                            "label": "女",
                            "value": "FEMALE",
                            "code": "1"
                        },
                        {
                            "label": "未知",
                            "value": "UN_KNOW",
                            "code": "2"
                        }
                    ],
                    "multiSelect": true
                }
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"shiti1zishiti1meiju\"}",
                "title": "实体1子实体1枚举",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "shiti1zishiti1meiju",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.shiti1zishiti1meiju",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "CTPENUM",
                "multiSelect": true,
                "businessProps": {
                    "appName": "organization",
                    "enumCode": "certificateType",
                    "currentAppId": "",
                    "env": "",
                    "multiSelect": true
                }
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"id\"}",
                "title": "ID",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "id",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.id",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "BIGINTEGER",
                "multiSelect": false
            },
            {
                "key": "{\"dtoName\":\"Shiti1zishiti1Dto\",\"fieldName\":\"draft\"}",
                "title": "是否草稿",
                "dtoName": "Shiti1zishiti1Dto",
                "fieldName": "draft",
                "extraParam": {
                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1.draft",
                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1zishiti1"
                },
                "dataType": "BOOLEAN",
                "multiSelect": false
            },
            {
                "key": "88Oisute4cqvDukY4cCym",
                "title": "实体1子实体1扩展实体1子实体1",
                "children": [
                    {
                        "key": "{\"dtoName\":\"\",\"fieldName\":\"shiti1zishiti1kzzd05\"}",
                        "title": "shiti1zishiti1kzzd05",
                        "dtoName": "",
                        "fieldName": "shiti1zishiti1kzzd05",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.FCAiYIXAKaOExt.shiti1zishiti1kzzd05",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.FCAiYIXAKaOExt"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    }
                ]
            },
            {
                "key": "3bDMiESFPQaHpNkRR8bKL",
                "title": "实体1",
                "children": [
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"create_time\"}",
                        "title": "创建时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "create_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.createTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"update_time\"}",
                        "title": "更新时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "update_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.updateTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"send_state\"}",
                        "title": "实体1发送状态",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "send_state",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.sendState",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": false,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "发送成功",
                                    "value": "SEND_SUCCESS",
                                    "code": "0"
                                },
                                {
                                    "label": "发送中",
                                    "value": "SENDING",
                                    "code": "1"
                                }
                            ],
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"creator\"}",
                        "title": "创建人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "creator",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.creator",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"creator_institution\"}",
                        "title": "创建机构",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "creator_institution",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.creatorInstitution",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgUnit",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgUnit.fullDataAllUnitRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"creator_department\"}",
                        "title": "创建部门",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "creator_department",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.creatorDepartment",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgUnit",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgUnit.fullDataAllUnitRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"creator_post\"}",
                        "title": "创建岗位",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "creator_post",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.creatorPost",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgPost",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgPost.fullDataPostRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"updater\"}",
                        "title": "更新人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "updater",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.updater",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"deduction_info\"}",
                        "title": "扣减规则信息",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "deduction_info",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.deductionInfo",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "MULTILINESTRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"id\"}",
                        "title": "ID",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.id",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "BIGINTEGER",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"status_type\"}",
                        "title": "实体1状态",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "status_type",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.statusType",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": false,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "草稿",
                                    "value": "DRAFT",
                                    "code": "0"
                                },
                                {
                                    "label": "待提交",
                                    "value": "TO_BE_SUBMITTED",
                                    "code": "1"
                                },
                                {
                                    "label": "提交中",
                                    "value": "PENDING_REVIEW",
                                    "code": "2"
                                },
                                {
                                    "label": "已生效",
                                    "value": "COME_INTO_FORCE",
                                    "code": "3"
                                },
                                {
                                    "label": "已终止",
                                    "value": "TERMINATED",
                                    "code": "4"
                                },
                                {
                                    "label": "已作废",
                                    "value": "NULLIFIED",
                                    "code": "5"
                                },
                                {
                                    "label": "已挂起",
                                    "value": "SUSPENDED",
                                    "code": "6"
                                },
                                {
                                    "label": "不通过",
                                    "value": "FAILED",
                                    "code": "7"
                                }
                            ],
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_send_time\"}",
                        "title": "发起时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_send_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseSendTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_sender\"}",
                        "title": "发起人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_sender",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseSender",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_sender_institution\"}",
                        "title": "发起机构",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_sender_institution",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseSenderInstitution",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgUnit",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgUnit.fullDataAllUnitRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"draft\"}",
                        "title": "是否草稿",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "draft",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.draft",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "BOOLEAN",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_sender_department\"}",
                        "title": "发起部门",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_sender_department",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseSenderDepartment",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgUnit",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgUnit.fullDataAllUnitRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_sender_post\"}",
                        "title": "发起岗位",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_sender_post",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseSenderPost",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgPost",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgPost.fullDataPostRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"template_id\"}",
                        "title": "流程模板",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "template_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.templateId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.bpm.domain.entity.BpmTemplate",
                            "appName": "bpm",
                            "useComp": false,
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_id\"}",
                        "title": "流程实例",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.bpm.domain.entity.BpmCase",
                            "appName": "bpm",
                            "useComp": false,
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_title\"}",
                        "title": "流程标题",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_title",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseTitle",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"case_finish_time\"}",
                        "title": "流程结束时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "case_finish_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.caseFinishTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"terminator_id\"}",
                        "title": "终止人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "terminator_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.terminatorId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"terminate_time\"}",
                        "title": "终止时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "terminate_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.terminateTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"terminate_reason\"}",
                        "title": "终止原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "terminate_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.terminateReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"terminate_status_type\"}",
                        "title": "终止时单据状态",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "terminate_status_type",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.terminateStatusType",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": false,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "草稿",
                                    "value": "DRAFT",
                                    "code": "0"
                                },
                                {
                                    "label": "待提交",
                                    "value": "TO_BE_SUBMITTED",
                                    "code": "1"
                                },
                                {
                                    "label": "提交中",
                                    "value": "PENDING_REVIEW",
                                    "code": "2"
                                },
                                {
                                    "label": "已生效",
                                    "value": "COME_INTO_FORCE",
                                    "code": "3"
                                },
                                {
                                    "label": "已终止",
                                    "value": "TERMINATED",
                                    "code": "4"
                                },
                                {
                                    "label": "已作废",
                                    "value": "NULLIFIED",
                                    "code": "5"
                                },
                                {
                                    "label": "已挂起",
                                    "value": "SUSPENDED",
                                    "code": "6"
                                },
                                {
                                    "label": "不通过",
                                    "value": "FAILED",
                                    "code": "7"
                                }
                            ],
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_terminator_id\"}",
                        "title": "取消终止人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_terminator_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelTerminatorId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_terminate_time\"}",
                        "title": "取消终止时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_terminate_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelTerminateTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_terminate_reason\"}",
                        "title": "取消终止原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_terminate_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelTerminateReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"nullify_id\"}",
                        "title": "作废人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "nullify_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.nullifyId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"nullify_time\"}",
                        "title": "作废时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "nullify_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.nullifyTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"nullify_reason\"}",
                        "title": "作废原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "nullify_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.nullifyReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"nullify_status_type\"}",
                        "title": "作废时单据状态",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "nullify_status_type",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.nullifyStatusType",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": false,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "草稿",
                                    "value": "DRAFT",
                                    "code": "0"
                                },
                                {
                                    "label": "待提交",
                                    "value": "TO_BE_SUBMITTED",
                                    "code": "1"
                                },
                                {
                                    "label": "提交中",
                                    "value": "PENDING_REVIEW",
                                    "code": "2"
                                },
                                {
                                    "label": "已生效",
                                    "value": "COME_INTO_FORCE",
                                    "code": "3"
                                },
                                {
                                    "label": "已终止",
                                    "value": "TERMINATED",
                                    "code": "4"
                                },
                                {
                                    "label": "已作废",
                                    "value": "NULLIFIED",
                                    "code": "5"
                                },
                                {
                                    "label": "已挂起",
                                    "value": "SUSPENDED",
                                    "code": "6"
                                },
                                {
                                    "label": "不通过",
                                    "value": "FAILED",
                                    "code": "7"
                                }
                            ],
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_nullify_id\"}",
                        "title": "取消作废人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_nullify_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelNullifyId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_nullify_time\"}",
                        "title": "取消作废时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_nullify_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelNullifyTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_nullify_reason\"}",
                        "title": "取消作废原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_nullify_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelNullifyReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"suspender_id\"}",
                        "title": "挂起人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "suspender_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.suspenderId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"suspend_time\"}",
                        "title": "挂起时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "suspend_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.suspendTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"suspend_reason\"}",
                        "title": "挂起原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "suspend_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.suspendReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"suspend_status_type\"}",
                        "title": "挂起时单据状态",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "suspend_status_type",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.suspendStatusType",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": false,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "草稿",
                                    "value": "DRAFT",
                                    "code": "0"
                                },
                                {
                                    "label": "待提交",
                                    "value": "TO_BE_SUBMITTED",
                                    "code": "1"
                                },
                                {
                                    "label": "提交中",
                                    "value": "PENDING_REVIEW",
                                    "code": "2"
                                },
                                {
                                    "label": "已生效",
                                    "value": "COME_INTO_FORCE",
                                    "code": "3"
                                },
                                {
                                    "label": "已终止",
                                    "value": "TERMINATED",
                                    "code": "4"
                                },
                                {
                                    "label": "已作废",
                                    "value": "NULLIFIED",
                                    "code": "5"
                                },
                                {
                                    "label": "已挂起",
                                    "value": "SUSPENDED",
                                    "code": "6"
                                },
                                {
                                    "label": "不通过",
                                    "value": "FAILED",
                                    "code": "7"
                                }
                            ],
                            "multiSelect": false
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_suspender_id\"}",
                        "title": "取消挂起人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_suspender_id",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelSuspenderId",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_suspend_time\"}",
                        "title": "取消挂起时间",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_suspend_time",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelSuspendTime",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"cancel_suspend_reason\"}",
                        "title": "取消挂起原因",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "cancel_suspend_reason",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.cancelSuspendReason",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"bill_code\"}",
                        "title": "单据编号",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "bill_code",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.billCode",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"applicant\"}",
                        "title": "申请人",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "applicant",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.applicant",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENTITY",
                        "multiSelect": false,
                        "businessProps": {
                            "applicationName": "",
                            "fullName": "com.seeyon.organization.domain.core.entity.OrgMember",
                            "appName": "organization",
                            "useComp": true,
                            "multiSelect": false,
                            "referFullName": "com.seeyon.organization.domain.core.entity.OrgMember.fullDataAllMemberRefer"
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"bill_date\"}",
                        "title": "单据日期",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "bill_date",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.billDate",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "DATETIME",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"shiti1wenben1\"}",
                        "title": "实体1文本1",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "shiti1wenben1",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.shiti1wenben1",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"shiti1wenben2\"}",
                        "title": "实体1文本2",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "shiti1wenben2",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.shiti1wenben2",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "STRING",
                        "multiSelect": false
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"shiti1xuanxiangji\"}",
                        "title": "实体1选项集",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "shiti1xuanxiangji",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.shiti1xuanxiangji",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "ENUM",
                        "multiSelect": true,
                        "businessProps": {
                            "treeData": [
                                {
                                    "label": "机构",
                                    "value": "INSTITUTION",
                                    "code": "1"
                                },
                                {
                                    "label": "部门",
                                    "value": "DEPARTMENT",
                                    "code": "2"
                                },
                                {
                                    "label": "外部单位",
                                    "value": "OUTSIDE_INSTITUTION",
                                    "code": "18"
                                },
                                {
                                    "label": "外部部门",
                                    "value": "OUTSIDE_DEPARTMENT",
                                    "code": "19"
                                },
                                {
                                    "label": "线下组织",
                                    "value": "LOCAL",
                                    "code": "20"
                                }
                            ],
                            "multiSelect": true
                        }
                    },
                    {
                        "key": "{\"dtoName\":\"Shiti1Dto\",\"fieldName\":\"shiti1meiju\"}",
                        "title": "实体1枚举",
                        "dtoName": "Shiti1Dto",
                        "fieldName": "shiti1meiju",
                        "extraParam": {
                            "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1.shiti1meiju",
                            "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.Shiti1"
                        },
                        "dataType": "CTPENUM",
                        "multiSelect": true,
                        "businessProps": {
                            "appName": "organization",
                            "enumCode": "outsideUnitType",
                            "currentAppId": "",
                            "env": "",
                            "multiSelect": true
                        }
                    },
                    {
                        "key": "dAfuTlD1S10XhwhKanfiD",
                        "title": "实体1扩展实体1",
                        "children": [
                            {
                                "key": "{\"dtoName\":\"PunOpIHVCCkExtDto\",\"fieldName\":\"shiti1kzzd101\"}",
                                "title": "shiti1kzzd101",
                                "dtoName": "PunOpIHVCCkExtDto",
                                "fieldName": "shiti1kzzd101",
                                "extraParam": {
                                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt.shiti1kzzd101",
                                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt"
                                },
                                "dataType": "STRING",
                                "multiSelect": false
                            },
                            {
                                "key": "{\"dtoName\":\"PunOpIHVCCkExtDto\",\"fieldName\":\"shiti1kzzd102\"}",
                                "title": "shiti1kzzd102",
                                "dtoName": "PunOpIHVCCkExtDto",
                                "fieldName": "shiti1kzzd102",
                                "extraParam": {
                                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt.shiti1kzzd102",
                                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt"
                                },
                                "dataType": "STRING",
                                "multiSelect": false
                            },
                            {
                                "key": "{\"dtoName\":\"PunOpIHVCCkExtDto\",\"fieldName\":\"shiti1kzzd103\"}",
                                "title": "shiti1kzzd103",
                                "dtoName": "PunOpIHVCCkExtDto",
                                "fieldName": "shiti1kzzd103",
                                "extraParam": {
                                    "id": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt.shiti1kzzd103",
                                    "entityId": "com.seeyon.renmxkzfa2590901710624345589.domain.entity.PunOpIHVCCkExt"
                                },
                                "dataType": "STRING",
                                "multiSelect": false
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll
      // onChange={onChange}
      treeData={treeData}
      fieldNames={{ label: "title", value: "key", children: "children" }}
    />
  );
}

export default DataQuery;
