<template>
  <a-tabs
    tabPosition="left"
    defaultActiveKey="1"
    :animated="false"
    v-model="tabKey"
  >
    <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="heat-map" />
        概览
      </span>
      <div class="config-content">
        <div class="content-item">
          <div class="infos">
            <p class="item-title">项目名称</p>
            <a-input size="large" v-model="project.name"></a-input>
          </div>
        </div>

        <div class="content-item">
          <div class="infos">
            <p class="item-title">项目简介</p>
            <a-input
              type="textarea"
              :rows="3"
              size="large"
              placeholder="介绍一下这个项目"
              v-model="project.description"
            ></a-input>
          </div>
        </div>

        <div class="content-item">
          <div class="infos">
            <p class="item-title">当前阶段</p>
            <a-select size="large" v-model="project.current_task_stage_id">
              <a-select-option
                v-for="taskstage in taskStages"
                :value="taskstage.id"
                :key="taskstage.id"
              >
                {{ taskstage.name }}

                <!-- 只有滞后时才会显示 text -->
                <a-tag
                  v-if="taskstage.status == 2"
                  :color="statusColor(taskstage.status)"
                >
                  {{ taskstage.status_text }}
                </a-tag>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="content-item">
          <div class="infos">
            <p class="item-title">项目负责部门</p>
            <a-select size="large" v-model="project.belong_department_id">
              <a-select-option
                v-for="department in departments"
                :value="department.id"
                :key="department.id"
              >
                {{ department.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div v-if="project.belong_member" class="content-item">
          <div class="infos">
            <p class="item-title">项目负责人</p>
            <div class="m-t">
              <a-avatar :src="project.belong_member.avatar"></a-avatar>
              <span class="m-l">{{ project.belong_member.name }}</span>
            </div>
          </div>
        </div>

        <div class="content-item">
          <div class="infos">
            <p class="item-title">项目创建人</p>
            <div class="m-t">
              <a-avatar :src="project.owner_avatar"></a-avatar>
              <span class="m-l">{{ project.owner_name }}</span>
            </div>
          </div>
        </div>
        <a-divider />
        <div class="content-item">
          <div class="infos">
            <a-button
              type="primary"
              class="middle-btn pull-right"
              size="large"
              @click="saveProject"
            >
              保存
            </a-button>
          </div>
        </div>
      </div>
    </a-tab-pane>

    <a-tab-pane key="5">
      <span slot="tab">
        <a-icon type="ellipsis" />
        更多
      </span>
      <div class="config-content more-config">
        <div class="content-item">
          <div class="infos">
            <p class="item-title">项目操作</p>
            <div class="item-tips muted">您可以执行以下操作</div>
            <a-button size="large" class="middle-btn" @click="archiveProject">
              <span v-if="project.archive">取消归档</span>
              <span v-if="!project.archive">归档项目</span>
            </a-button>
            <a-button size="large" class="middle-btn" @click="quitProject"
              >退出</a-button
            >
            <a-button
              size="large"
              class="middle-btn"
              type="danger"
              @click="delProject"
            >
              <span v-if="project.deleted">恢复项目</span>
              <span v-if="!project.deleted">移至回收站</span>
            </a-button>
          </div>
        </div>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import {
  read as getProject,
  doData,
  archive,
  recycle,
  recoveryArchive,
  recovery,
  quit,
} from "../../api/project";
import {
  _getTaskWorkflowRules,
  list as getTaskWorkflowList,
  save as saveTaskWorkflow,
  edit as EditTaskWorkflow,
  del as delTaskWorkflow,
} from "../../api/taskWorkflow";
import {
  _getAll as getTaskStages,
  list as getTaskStageList,
} from "../../api/taskStages";
import { list as getDepartments } from "../../api/department";
import { list as getProjectMembers } from "../../api/projectMember";

import { notice } from "../../assets/js/notice";
import {
  checkResponse,
  getApiUrl,
  getAuthorization,
  getBase64,
} from "../../assets/js/utils";

export default {
  name: "projectConfig",
  props: {
    code: {
      type: [String],
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      /*项目设置*/
      loading: false,
      tabKey: "1",
      project: {},
      taskWorkflowList: [],
      doTaskWorkflowView: false,
      loadingWorkflowRule: false,
      taskWorkflow: null,
      taskWorkflowRuleList: [],
      currentTaskWorkflowRule: {
        taskWorkflowName: "",
        firstObj: "", //哪个列表任务
        firstAction: {
          //做什么
          action: -1,
          value: "",
        },
        firstResult: {
          //就
          action: -1,
          value: "",
        },
        lastResult: {
          //最后
          action: -1,
          value: "",
        },
        state: {
          //任务状态
          action: -1,
          value: -1,
        },
      },
      taskWorkflowRuleActions: [
        { id: -1, name: "请选择" },
        { id: 0, name: "增加任务、被移动" },
        { id: 1, name: "被完成" },
        { id: 2, name: "被重做" },
        { id: 3, name: "设置执行人" },
        // {id: 4, name: "截止时间"},
        // {id: 5, name: "优先级"},
      ],
      taskWorkflowRuleTypes: [
        { id: -1, name: "请选择" },
        { id: 0, name: "自动流转到" },
        { id: 3, name: "默认指派给" },
      ],
      taskStates: [
        { id: -1, name: "不做修改" },
        { id: 1, name: "已完成" },
        { id: 2, name: "未完成" },
      ],
      projectMembers: [],
      taskStages: [],
      departments: [],
      uploadLoading: false,
      uploadAction: getApiUrl("project/project/uploadCover"),
    };
  },
  computed: {
    headers() {
      return getAuthorization();
    },
    canSaveTaskWorkflow() {
      return (
        this.currentTaskWorkflowRule.taskWorkflowName.trim() &&
        this.currentTaskWorkflowRule.firstObj &&
        this.currentTaskWorkflowRule.firstAction.action != -1 &&
        this.currentTaskWorkflowRule.firstResult.action != -1 &&
        this.currentTaskWorkflowRule.firstResult.value
      );
    },
  },
  watch: {
    code() {
      this.getProject();
    },
  },
  created() {
    this.getProject();
    this.getTaskWorkflowList();
    this.getDepartments();
    this.getTaskStageList();
  },
  methods: {
    getProject() {
      this.loading = true;
      getProject(this.code).then((res) => {
        this.loading = false;
        this.project = res.data;
        this.project.open_prefix = !!res.data.open_prefix;
        this.project.open_begin_time = !!res.data.open_begin_time;
        this.project.open_task_private = !!res.data.open_task_private;
        this.project.auto_update_schedule = !!res.data.auto_update_schedule;
      });
    },
    getTaskWorkflowList() {
      getTaskWorkflowList({ projectCode: this.code }).then((res) => {
        this.taskWorkflowList = res.data;
      });
    },
    saveProject() {
      const project = this.project;
      doData({
        projectCode: project.code,
        name: project.name,
        description: project.description,
        cover: project.cover,
        private: project.private,
        prefix: project.prefix,
        task_board_theme: project.task_board_theme,
        open_prefix: Number(project.open_prefix),
        open_begin_time: Number(project.open_begin_time),
        open_task_private: Number(project.open_task_private),
        schedule: Number(project.schedule),
        auto_update_schedule: Number(project.auto_update_schedule),
        belong_department_id: project.belong_department_id,
        current_task_stage_id: project.current_task_stage_id,
      }).then((res) => {
        if (!checkResponse(res)) {
          return;
        }
        this.$emit("update", this.project);
        notice(
          {
            title: "保存成功",
          },
          "notice",
          "success"
        );

        window.location.reload();

        // 更新详情页UI data
        // this.getProject();
      });
    },
    archiveProject() {
      let app = this;
      if (!app.project.archive) {
        this.$confirm({
          title: "归档项目",
          content: `一旦将项目「${this.project.name}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。`,
          okText: "归档",
          okType: "danger",
          cancelText: `再想想`,
          onOk() {
            archive(app.code).then((res) => {
              if (!checkResponse(res)) {
                return;
              }

              notice(
                {
                  title: "归档成功",
                },
                "notice",
                "success"
              );

              window.location.reload();

              // app.$router.replace("/project/archive");
            });
            return Promise.resolve();
          },
        });
      } else {
        this.$confirm({
          title: "取消归档项目？",
          content: `取消归档「${this.project.name}」后就可以正常使用了`,
          okText: "取消归档",
          okType: "primary",
          cancelText: "再想想",
          onOk() {
            recoveryArchive(app.code).then((res) => {
              if (!checkResponse(res)) {
                return;
              }
              app.$router.replace("/project/list/my");
            });
            return Promise.resolve();
          },
        });
      }
    },
    delProject() {
      let app = this;
      if (!app.project.deleted) {
        this.$confirm({
          title: "确定放入回收站？",
          content: `一旦将项目「${this.project.name}」放入回收站，所有与项目有关的信息将会被放入回收站`,
          okText: "放入回收站",
          okType: "danger",
          cancelText: "再想想",
          onOk() {
            recycle(app.code).then((res) => {
              if (!checkResponse(res)) {
                return;
              }
              app.$router.replace("/project/recycle");
              // window.loaction.reload();
            });
            return Promise.resolve();
          },
        });
      } else {
        this.$confirm({
          title: "确定恢复项目？",
          content: `恢复「${this.project.name}」后就可以正常使用了`,
          okText: "恢复项目",
          okType: "primary",
          cancelText: "再想想",
          onOk() {
            recovery(app.code).then((res) => {
              if (!checkResponse(res)) {
                return;
              }
              app.$router.replace("/project/list/my");
            });
            return Promise.resolve();
          },
        });
      }
    },
    quitProject() {
      let app = this;
      this.$confirm({
        title: "退出项目",
        content: `一旦你退出了该项目，你将不能查看任何关于该项目的信息。退出项目后，如果想重新加入，请联系项目管理员。`,
        okText: "确定退出",
        okType: "primary",
        cancelText: "再想想",
        onOk() {
          quit(app.code).then((res) => {
            if (!checkResponse(res)) {
              return;
            }
            app.$router.replace("/project/list/my");
          });
          return Promise.resolve();
        },
      });
    },
    doTaskWorkflow(taskWorkflow = null) {
      this.getTaskStages();
      this.getProjectMembers();
      this.taskWorkflow = taskWorkflow;
      if (taskWorkflow) {
        this.loadingWorkflowRule = true;
        this.currentTaskWorkflowRule.taskWorkflowName = taskWorkflow.name;
        this.getTaskWorkflowRules(taskWorkflow.code);
      } else {
        this.currentTaskWorkflowRule = {
          taskWorkflowName: "",
          firstObj: "", //哪个列表任务
          firstAction: {
            //做什么
            action: -1,
            value: "",
          },
          firstResult: {
            //就
            action: -1,
            value: "",
          },
          lastResult: {
            //最后
            action: -1,
            value: "",
          },
          state: {
            //任务状态
            action: -1,
            value: -1,
          },
          taskStates: [
            { id: -1, name: "不做修改" },
            { id: 1, name: "已完成" },
            { id: 2, name: "未完成" },
          ],
        };
      }
      this.doTaskWorkflowView = true;
    },
    saveTaskWorkflow(save = false) {
      if (this.currentTaskWorkflowRule.firstResult.action) {
        this.currentTaskWorkflowRule.lastResult.action = 0;
      } else {
        this.currentTaskWorkflowRule.lastResult.action = 3;
      }
      let submitData = {
        taskWorkflowName: this.currentTaskWorkflowRule.taskWorkflowName,
        taskWorkflowRules: JSON.stringify(this.currentTaskWorkflowRule),
      };
      if (save) {
        // save
        if (this.taskWorkflow) {
          submitData.taskWorkflowCode = this.taskWorkflow.code;
          EditTaskWorkflow(submitData).then((res) => {
            this.getTaskWorkflowList();
          });
        } else {
          submitData.projectCode = this.code;
          saveTaskWorkflow(submitData).then((res) => {
            this.getTaskWorkflowList();
          });
        }
      }
      this.doTaskWorkflowView = false;
    },
    getTaskStages() {
      getTaskStages({ projectCode: this.code }).then((res) => {
        let list = [
          {
            code: "",
            name: "不选择",
          },
        ];
        res.data.forEach((v) => {
          list.push(v);
        });
        this.taskStages = list;
      });
    },
    getTaskStageList() {
      getTaskStageList({ projectCode: this.code }).then((res) => {
        console.log("getTaskStageList", res);
        this.taskStages = res.data.list;
      });
    },

    getDepartments() {
      getDepartments().then((res) => {
        this.departments = res.data.list;
      });
    },

    getTaskWorkflowRules(taskWorkflowCode) {
      _getTaskWorkflowRules({ taskWorkflowCode: taskWorkflowCode }).then(
        (res) => {
          this.loadingWorkflowRule = false;
          const rules = res.data;
          this.taskWorkflowRuleList = rules;
          if (rules) {
            this.currentTaskWorkflowRule.firstObj = rules[0].object_code;
            this.currentTaskWorkflowRule.firstAction.action = rules[1].action;
            this.currentTaskWorkflowRule.firstAction.value =
              rules[1].object_code;

            this.currentTaskWorkflowRule.firstResult.action = rules[2].action;
            this.currentTaskWorkflowRule.firstResult.value =
              rules[2].object_code;

            if (rules.length >= 4) {
              if (!rules[3].object_code) {
                this.currentTaskWorkflowRule.state.action = rules[3].action;
                this.currentTaskWorkflowRule.state.value = rules[3].action;
              } else {
                this.currentTaskWorkflowRule.lastResult.action =
                  rules[3].action;
                this.currentTaskWorkflowRule.lastResult.value =
                  rules[3].object_code;
              }
              if (rules.length >= 5) {
                if (!rules[4].object_code) {
                  this.currentTaskWorkflowRule.state.action = rules[4].action;
                  this.currentTaskWorkflowRule.state.value = rules[4].action;
                } else {
                  this.currentTaskWorkflowRule.lastResult.action =
                    rules[4].action;
                  this.currentTaskWorkflowRule.lastResult.value =
                    rules[4].object_code;
                }
              }
            }
          }
        }
      );
    },
    delTaskWorkflow(code) {
      let app = this;
      this.$confirm({
        title: "删除规则?",
        content: "您确定要删除该规则吗？",
        okText: "删除",
        okType: "danger",
        cancelText: "再想想",
        onOk() {
          delTaskWorkflow({ taskWorkflowCode: code }).then((res) => {
            if (checkResponse(res)) {
              app.getTaskWorkflowList();
            }
          });
          return Promise.resolve();
        },
      });
    },
    getProjectMembers() {
      getProjectMembers({ projectCode: this.code, pageSize: 100 }).then(
        (res) => {
          let list = [
            {
              code: "",
              name: "不选择",
            },
          ];
          res.data.list.forEach((v) => {
            list.push(v);
          });
          this.projectMembers = list;
        }
      );
    },
    workflowRuleChange(value, name) {
      if (name == "firstAction.action") {
        this.currentTaskWorkflowRule.firstAction.value = "";
      }
      if (name == "firstResult.value") {
        this.currentTaskWorkflowRule.lastResult.value = "";
      }
      if (name == "firstResult.action") {
        this.currentTaskWorkflowRule.firstResult.value = "";
        this.currentTaskWorkflowRule.lastResult.value = "";
      }
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.uploadLoading = true;
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, () => {
          this.project.cover = info.file.response.data.url;
          this.uploadLoading = false;
          notice(
            {
              title: "封面上传成功",
            },
            "notice",
            "success"
          );
        });
      }
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片不能超过2MB!");
      }
      return isLt2M;
    },
    priColor(pri) {
      switch (pri) {
        case 1:
          return "green";
        case 2:
          return "#ed3f14";
        default:
          return "green";
      }
    },

    statusColor(status) {
      status = Number(status);
      switch (status) {
        case 1:
          return "green";
        case 2:
          return "#ed3f14";
        default:
          return "green";
      }
    },
  },
};
</script>

<style lang="less">
.project-config-modal {
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-body,
  .ant-tabs,
  .ant-tabs-bar {
    min-height: 730px;
    min-width: 180px;

    .ant-tabs-tab {
      padding: 12px 24px;
    }
  }

  .ant-tabs-nav-wrap {
    padding-top: 10px;
  }

  .ant-tabs-left-content {
    padding-top: 18px;
    padding-right: 24px;
  }

  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
    text-align: left;
  }

  .config-content {
    .content-item {
      display: flex;
      justify-content: space-between;
      flex: 1 1;
      margin-bottom: 24px;

      .infos {
        width: 100%;
        padding-right: 12px;

        p {
          margin-bottom: 6px;
        }

        .item-title {
          font-size: 16px;
        }

        .item-tips {
          margin-bottom: 12px;
        }

        .ant-select {
          width: 100%;
        }

        .ant-input-number-lg {
          width: 100%;
        }

        .cover-item {
          display: flex;

          img {
            width: 300px;
            height: 150px;
          }

          .cover-uploader {
            display: block;
            margin-left: 24px;

            .upload-tips {
              margin-top: 12px;
            }
          }
        }
      }
    }

    &.task-config {
      .content-item {
        padding-bottom: 24px;
        padding-right: 16px;
        border-bottom: 1px solid #e5e5e5;
      }

      .prefix-input {
        width: 50%;
        margin-right: 24px;
      }
    }

    .task-workflow {
      .workflow-content {
        margin-top: 12px;

        .workflow-rule-item {
          margin-bottom: 16px;

          p {
            color: rgba(0, 0, 0, 0.45);
          }
        }
      }
    }

    &.more-config {
      .ant-btn {
        margin-right: 12px;
      }
    }
  }
}
</style>
