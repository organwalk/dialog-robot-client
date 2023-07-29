const intentionOptions = [
  {
    value: "MsgAbout",
    label: "消息推送",
    children: [
      {
        label: "文本消息",
        value: "TxtMsg"
      },
      {
        label: "应用消息",
        value: "AppMsg"
      },
      {
        label: "图片消息",
        value: "PicMsg"
      },
      {
        label: "链接消息",
        value: "LinkMsg"
      },
      {
        label: "语音消息",
        value: "VocMsg"
      },
      {
        label: "图文消息",
        value: "MulMsg"
      },
      {
        label: "应用消息",
        value: "AppMsg"
      },
      {
        label: "名片消息",
        value: "IDMsg"
      },
      {
        label: "系统消息",
        value: "SysMsg"
      },
      {
        label: "OA消息",
        value: "OAMsg"
      },
      {
        label: "选择消息类型",
        value: "SendMsg"
      }
    ]
  },
  {
    value: "ManAbout",
    label: "职员管理",
    children: [
      {
        label: "新增职员",
        value: "AddMan"
      },
      {
        label: "删除职员",
        value: "DelMan"
      },
      {
        label: "修改职员",
        value: "ModMan"
      },
      {
        label: "获取职员所属部门",
        value: "GetManDept"
      },
      {
        label: "获取职员详细信息",
        value: "GetMan"
      }
    ]
  },
  {
    value: "DeptAbout",
    label: "部门管理",
    children: [
      {
        label: "新增部门",
        value: "AddDept"
      },
      {
        label: "删除部门",
        value: "DelDept"
      }
    ]
  },
  {
    value: "PlanAbout",
    label: "日程相关",
    children: [
      {
        label: "获取日程列表",
        value: "GetPlan"
      },
      {
        label: "获取用户发布日程",
        value: "GetPlanByMan"
      },
      {
        label: "创建日程",
        value: "AddPlan"
      },
      {
        label: "管理日程",
        value: "ModPlan"
      },
      {
        label: "根据时间查询日程",
        value: "TimeQueryPlan"
      },
      {
        label: "根据人名查询日程",
        value: "NameQueryPlan"
      },
      {
        label: "根据内容查询日程",
        value: "ContentQueryPlan"
      }
    ]
  },
  {
    value: "NoteAbout",
    label: "事项相关",
    children: [
      {
        label: "获取事项列表",
        value: "GetNotes"
      },
      {
        label: "创建事项",
        value: "AddNote"
      },
      {
        label: "管理事项",
        value: "ModNote"
      },
      {
        label: "快捷事项告知",
        value: "FastAddNotes"
      },
      {
        label: "根据时间及状态查询事项",
        value: "FastQueryNotes"
      },
      {
        label: "根据内容查询完成状态",
        value: "FastContentQueryNotes"
      }
    ]
  }
]

export default intentionOptions