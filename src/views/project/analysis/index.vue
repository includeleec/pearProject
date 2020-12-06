<template>
  <div class="analysis-index">
    <div class="page-wrapper">
      <a-row  :gutter="[24,24]">
        <a-col :sm="24" :md="12" :xl="6">
          <number-card title="项目总数" :total="projectTotal"> </number-card>
        </a-col>

        <a-col :sm="24" :md="12" :xl="6">
          <number-card title="逾期项目总数" :total="projectDelayTotal">
          </number-card>
        </a-col>
      </a-row>

      <a-row  :gutter="[24,24]"  :style="{ marginBottom: '24px' }">
        <a-col  :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            :loading="loading"
            :bordered="false"
            title="各部门项目统计"
            :style="{ marginTop: '24px' }"
          >
            <div class="chart-wrappers-single">
              <ve-histogram
                :data="departmentChart.chartData"
                :settings="departmentChart.chartSettings"
                :extend="departmentChart.chartExtend"
                height="300px"
              ></ve-histogram>
            </div>
          </a-card>
        </a-col>
        <a-col  :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            :loading="loading"
            :bordered="false"
            title="各阶段项目统计"
            :style="{ marginTop: '24px' }"
          >
            <div class="chart-wrappers-single">
              <ve-pie
                :data="allStageChart.chartData"
                :settings="allStageChart.chartSettings"
                :extend="allStageChart.chartExtend"
                height="300px"
              ></ve-pie>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- <a-card
        :loading="loading"
        :bordered="false"
        :body-style="{ padding: '0' }"
      >
        <div class="salesCard">
          <a-tabs
            default-active-key="1"
            size="large"
            :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
          >
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <div class="extra-item">
                <a>今日</a>
                <a>本周</a>
                <a>本月</a>
                <a>本年</a>
              </div>
              <a-range-picker :style="{ width: '256px' }" />
            </div>
            <a-tab-pane forceRender tab="项目数" key="1">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="chart-wrappers-single">
                    <ve-histogram
                      :data="projectTotalData.chartData"
                      :settings="projectTotalData.chartSettings"
                      :extend="projectTotalData.chartExtend"
                      :legend-visible="false"
                      height="300px"
                    ></ve-histogram>
                  </div>
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list title="项目数排行榜" :list="rankList" />
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane forceRender tab="任务数" key="2">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="chart-wrappers-single">
                    <ve-histogram
                      :data="projectTotalData.chartData"
                      :settings="projectTotalData.chartSettings"
                      :extend="projectTotalData.chartExtend"
                      :legend-visible="false"
                      height="300px"
                    ></ve-histogram>
                  </div>
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list title="任务数排行榜" :list="rankList" />
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card> -->
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import VeLine from "v-charts/lib/line.common";
import VeHistogram from "v-charts/lib/histogram.common";
import VePie from "v-charts/lib/pie.common";
import VeBar from "v-charts/lib/bar.common";

import NumberCard from "@/components/chart/NumberCard";
import Trend from "@/components/Trend";
import MiniProgress from "@/components/chart/MiniProgress";
import RankList from "@/components/chart/RankList";
import pagination from "@/mixins/pagination";
import { statistic } from "@/api/project";

// const rankList = [];
// for (let i = 0; i < 7; i++) {
//   rankList.push({
//     name: "XX公司 " + (i + 1) + " 号员工",
//     total: 1234.56 - i * 100,
//   });
// }
// const taskList = [];
// for (let i = 1; i < 20; i++) {
//   taskList.push({
//     日期: `1月${i}日`,
//     任务: (Math.random() * 10 + 1).toFixed(0),
//   });
// }
// const projectList = [];

// for (let i = 1; i < 13; i++) {
//   projectList.push({
//     日期: `${i}月`,
//     数量: (Math.random() * 10 + 1).toFixed(0),
//   });
// }
export default {
  components: {
    VeLine,
    VeHistogram,
    VePie,
    VeBar,
    NumberCard,
    MiniProgress,
    Trend,
    RankList,
  },
  mixins: [pagination],
  data() {
    return {
      loading: false,
      //   rankList,
      //   chartExtend: {
      //     grid: {
      //       left: "-25",
      //       right: "0",
      //       top: "10",
      //       bottom: "-15",
      //     },
      //     series: {
      //       barWidth: 15,
      //     },
      //     xAxis: {
      //       show: false,
      //     },
      //     yAxis: {
      //       show: false,
      //     },
      //     tooltip: {
      //       backgroundColor: "#fff",
      //       textStyle: {
      //         color: "#333",
      //       },
      //       borderWidth: 1,
      //       borderColor: "#e8e8e8",
      //     },
      //     axisPointer: {
      //       lineStyle: {
      //         width: 0,
      //       },
      //     },
      //   },
      //   projectData: {
      //     count: 0,
      //     projectSchedule: 0,
      //     chartData: {
      //       columns: ["日期", "数量"],
      //       rows: projectList,
      //     },
      //     chartSettings: {
      //       itemStyle: {
      //         color: "#1890ff",
      //       },
      //     },
      //   },
      //   taskData: {
      //     count: 0,
      //     taskOverdueCount: 0,
      //     taskOverduePercent: 0,
      //     chartData: {
      //       columns: ["日期", "任务"],
      //       rows: taskList,
      //     },
      //     chartSettings: {
      //       area: true,
      //       itemStyle: {
      //         color: "#b68eec",
      //       },
      //       areaStyle: {
      //         color: "#b68eec",
      //       },
      //     },
      //   },
      //   projectTotalData: {
      //     chartData: {
      //       columns: ["日期", "数量"],
      //       rows: projectList,
      //     },
      //     chartSettings: {
      //       itemStyle: {
      //         color: "#1890ff",
      //       },
      //     },
      //     chartExtend: {
      //       grid: {
      //         left: "30",
      //         right: "0",
      //         top: "15",
      //         bottom: "0",
      //       },
      //       series: {
      //         barWidth: 45,
      //       },
      //     },
      //   },
      projectTotal: 0,
      projectDelayTotal: 0,
      //   projectLoading: false,

      departmentChart: {
        chartSettings: {
          metrics: ["项目数量", "逾期项目数量"],
          dimension: ["部门"],
        },
        chartData: {
          columns: ["部门", "项目数量", "逾期项目数量"],
          rows: [],
        },
        chartExtend: {
          grid: {
            left: "30",
            right: "0",
            top: "25",
            bottom: "0",
          },
          series: {
            label: { show: true, position: "top" },
            barWidth: 40,
          },
        },
      },

      allStageChart: {
        chartSettings: {
          metrics: ["项目数量"],
          dimension: ["项目阶段"],
        },
        chartData: {
          columns: ["项目阶段", "项目数量"],
          rows: [],
        },
        chartExtend: {
          grid: {
            left: "30",
            right: "0",
            top: "25",
            bottom: "0",
          },
          series: {
            label: { show: true, position: "right" },
            barWidth: 20,
          },
        },
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // analysis({type: 1}).then(res => {
      //     this.projectData.count = res.data.projectCount;
      //     this.projectData.projectSchedule = res.data.projectSchedule;
      //     this.projectData.chartData.rows = res.data.projectList;
      //     this.projectTotalData.chartData.rows = res.data.projectList;

      //     this.taskData.count = res.data.taskCount;
      //     this.taskData.taskOverdueCount = res.data.taskOverdueCount;
      //     this.taskData.taskOverduePercent = res.data.taskOverduePercent;
      //     this.taskData.chartData.rows = res.data.taskList;
      // });
      let app = this;

      app.loading = true;
      statistic().then((res) => {
        app.loading = false;

        app.projectTotal = res.data.total;
        app.projectDelayTotal = res.data.delay_total;
        // 按照部门的统计数据
        res.data.dept.map((d) => {
          app.departmentChart.chartData.rows.push({
            部门: d.name,
            项目数量: d.total,
            逾期项目数量: d.delay_total,
          });
        });

        // 按照项目阶段的统计数据
        res.data.stages.map((d) => {
          app.allStageChart.chartData.rows.push({
            项目阶段: d.name,
            项目数量: d.count,
            // 逾期项目数量: d.delay_count,
          });
        });
      });

      //   if (reset) {
      //     this.pagination.page = 1;
      //     this.pagination.pageSize = 10;
      //   }
      //   this.getProjectList(true);
    },
    // getProjectList(loading) {
    //     if (loading) {
    //         this.projectLoading = true;
    //     }
    //     getProjectList(this.requestData).then(res => {
    //         this.projectList = res.data.list;
    //         this.projectTotal = res.data.total;
    //         this.projectLoading = false;
    //     });
    // },
    // pageChange(page, pageSize) {
    //     this.pagination.page = page;
    //     this.getProjectList(true);
    // }
  },
};
</script>
<style lang="less">
.analysis-index {
  .page-wrapper {
    margin: 24px;

    .extra-wrapper {
      line-height: 55px;
      padding-right: 24px;

      .extra-item {
        display: inline-block;
        margin-right: 24px;

        a {
          margin-left: 24px;
        }
      }
    }

    .chart-wrapper {
      position: absolute;
      bottom: -10px;
      width: 100%;
    }

    .chart-wrappers-single {
      /*width: 500px;*/

      div {
        width: auto !important;
      }
    }
  }
}
</style>
