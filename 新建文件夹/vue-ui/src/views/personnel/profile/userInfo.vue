<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item>
      <h3 class="li_title"><span class="el-icon el-icon-document"></span>基本信息</h3>
      <template style="margin: 2px 0">
        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">姓名</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-form-item prop="fullName">
              <el-input v-model="user.fullName" placeholder="请输入姓名" />
            </el-form-item>

          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">性别</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-select size="medium" v-model="user.sex" style="width:100%" placeholder="请选择用户性别">
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">出生年月</span>
          </el-col>
          <el-col :span="4" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-date-picker  clearable size="small" style="width: 270px"
                             v-model="user.birthTime"
                             type="date"
                             value-format="yyyy-MM-dd"
                             placeholder="选择出生年月">
            </el-date-picker>
          </el-col>

        </el-row>


        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">民族</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-input v-model="user.nation" placeholder="请输入名族" />
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">籍贯</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-input v-model="user.nativePlace" placeholder="请输入籍贯" />
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">出生地</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-input v-model="user.birthplace" placeholder="请输入出生地" />
          </el-col>

        </el-row>


        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">入党时间</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-date-picker clearable style="width: 100%"
                            v-model="user.joinTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择入党时间">
            </el-date-picker>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">工作时间</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-date-picker clearable size="small" style="width: 100%"
                            v-model="user.workTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择参加工作时间">
            </el-date-picker>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">政治面貌</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-input v-model="user.politicalOutlook" placeholder="请输入政治面貌" />
          </el-col>

        </el-row>


        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">身份证号</span>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-input v-model="user.idNumber" placeholder="请输入身份证号码" />
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">现任职务</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-input v-model="user.currentPosition" placeholder="请输入现任职务" />
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">职级</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-select size="medium" v-model="user.ranks" style="width:100%" placeholder="请选择职级">
              <el-option
                v-for="dict in rankOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-col>

        </el-row>
        <el-row style="line-height: 40px;border:1px solid #cdcdcd">

          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">人员类型</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-select size="medium" v-model="user.personnelType" style="width:100%" placeholder="请选择人员类型">
              <el-option
                v-for="dict in personnelTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">人员状态</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-select size="medium" v-model="user.personnelStatus" style="width:100%" placeholder="请选择人员类型">
              <el-option
                v-for="dict in personnelStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>

          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">归属部门</span>
          </el-col>
          <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
            <treeselect v-model="user.deptName" :options="deptOptions"  :show-count="true" placeholder="请选择归属部门" />
          </el-col>
        </el-row>

        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">工作单位</span>
          </el-col>
          <el-col :span="22" style="text-align: center;">
            <el-input v-model="user.workUnit" placeholder="请输入工作单位" />
          </el-col>

        </el-row>
        <el-row  style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">全日制学历</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-input v-model="user.fullTime" placeholder="请输入全日制教育" style="margin-left: -3px"/>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">全日制学位</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-input v-model="user.fullEducation" placeholder="请输入全日制学位" style="margin-left: -3px"/>
          </el-col>
          <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">毕业院校及专业</span>
          </el-col>
          <el-col :span="5" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-input v-model="user.fullGraduated" placeholder="请输入全日制毕业院校及专业" />
          </el-col>

        </el-row>
        <el-row  style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">在职教育学历</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-input v-model="user.theJob" placeholder="请输入在职教育" style="margin-left: -3px"/>
          </el-col>
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">在职教育学位</span>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-input v-model="user.theEducation" placeholder="请输入在职教育学位" style="margin-left: -3px"/>
          </el-col>
          <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">毕业院校及专业</span>
          </el-col>
          <el-col :span="5" style="text-align: center;border-right:1px solid #cdcdcd ">
            <el-input v-model="user.theJobGraduated" placeholder="请输入在职教育毕业院校及专业" />
          </el-col>

        </el-row>
      </template>
      <h3>专长</h3>
      <template style="margin: 2px 0">
        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="24" style="text-align: center;">
            <el-select size="medium" multiple v-model="user.expertises" style="width:100%" placeholder="请选择人员类型">
              <el-option
                v-for="dict in expertiseOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>

          </el-col>
        </el-row>

      </template>

      <h3 >工作简历</h3>
      <template style="margin: 2px 0">
        <el-row style="line-height: 40px;border:1px solid #cdcdcd">
          <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
            <span class="font1">工作简历</span>
          </el-col>
          <el-col :span="22" style="text-align: center;">
            <el-input type="textarea"
                      :rows="4" v-model="user.resume" placeholder="请输入工作简历" />
          </el-col>
        </el-row>

      </template>


      <h3>证书情况</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.certificate" row-key="id" >
            <el-table-column label="" v-if="showTable" align="center" prop="id" />
            <el-table-column label="证书名称" align="center" prop="certificateName" />
            <el-table-column label="获得时间" align="center" prop="getTime" >
              <template slot-scope="scope">
                <span>{{ rTime(scope.row.getTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="证书类型" align="center" prop="certificateType" :formatter="certificateTypeFormat" />
          </el-table>
        </el-row>

      </template>

      <h3>家庭关系：</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.familyRelations" row-key="id" >
            <el-table-column label="" v-if="showTable" align="center" prop="id" />
            <el-table-column label="称谓" align="center" prop="familyAppellation" />
            <el-table-column label="姓名" align="center" prop="familyName" />
            <el-table-column label="年龄" align="center" prop="familyAge" />
            <el-table-column label="政治面貌" align="center" prop="familyZzmm" />
            <el-table-column label="工作单位及职务" align="center" prop="familyGzdw" />
          </el-table>
        </el-row>

      </template>
      <h3 class="li_title"><span class="el-icon el-icon-news"></span>审查调查工作情况</h3>
      <h3>巡视巡察工作：</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.inspectionWorks" row-key="id" >
            <el-table-column v-if="showTable" label="id" align="center" prop="id" />
            <el-table-column label="开始时间" align="center" prop="btime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.btime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="etime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="巡视地区或单位" align="center" prop="inspectionArea" />
            <el-table-column label="工作类型" align="center" prop="jobTypeValue" />
            <el-table-column label="评级" align="center" prop="grade" :formatter="gradeFormat" />
          </el-table>
        </el-row>

      </template>

      <h3>查办案件：</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.investigatings" row-key="id" >
            <el-table-column label="" v-if="showTable" align="center" prop="id" />
            <el-table-column label="开始时间" align="center" prop="btime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.btime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="etime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="案件名称" align="center" prop="nameCase" />
            <el-table-column label="案件领域" align="center" prop="caseArea" />

            <el-table-column label="角色" align="center" prop="roleName" :formatter="roleNameFormat" />
          </el-table>
        </el-row>

      </template>
      <h3>实战练兵</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.actualCombats" row-key="id" >
            <el-table-column label="开始时间" align="center" prop="btime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.btime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="etime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="案件名称" align="center" prop="nameCase" />
            <el-table-column label="案件领域" align="center" prop="caseArea" />
            <el-table-column label="是否借调" align="center" prop="toLoan" > <template slot-scope="scope">
              {{ scope.row.toLoan == 0 ? '是' : scope.row.toLoan == 1 ?'否': '' }}
            </template>
            </el-table-column>
            <el-table-column label="案件内容" align="center" prop="caseContent" />
            <el-table-column label="承办部门" align="center" prop="department" />
          </el-table>
        </el-row>

      </template>
      <h3 class="li_title"><span class="el-icon el-icon-s-shop"></span>教育培训</h3>
      <h3>知识测试：</h3>
      <template style="margin: 2px 0">
        <!--<el-row >
          <el-table :data="user.inspectionWorks" row-key="id" >
            <el-table-column v-if="showTable" label="id" align="center" prop="id" />
            <el-table-column label="开始时间" align="center" prop="btime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.btime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="etime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="巡视地区或单位" align="center" prop="inspectionArea" />
            <el-table-column label="工作类型" align="center" prop="jobTypeValue" />
            <el-table-column label="评级" align="center" prop="grade" :formatter="gradeFormat" />
          </el-table>
        </el-row>-->

      </template>
      <h3>专题授课：</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.specialLectures" row-key="id" >
            <el-table-column label="" v-if="showTable" align="center" prop="id" />
            <el-table-column label="开始时间" align="center" prop="btime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.btime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="etime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="举办部门" align="center" prop="organizingDepartment" />
            <el-table-column label="班次名称" align="center" prop="shiftName" />
            <el-table-column label="参与对象" align="center" prop="participants" :formatter="participantsFormat" />
            <el-table-column label="授课名称" align="center" prop="courseName" />
          </el-table>
        </el-row>

      </template>
      <h3>业务培训：</h3>
      <template style="margin: 2px 0">
        <el-row >
          <el-table :data="user.businessTrainings" row-key="id" >
            <el-table-column label="" v-if="showTable" align="center" prop="id" />
            <el-table-column label="班次名称" align="center" prop="shiftName" />
            <el-table-column label="举办部门" align="center" prop="organizingDepartment" :formatter="organizingDepartmentFormat"/>
            <el-table-column label="培训开始时间" align="center" prop="trainBtime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.trainBtime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="培训结束时间" align="center" prop="trainEtime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.trainEtime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="个人评价" align="center" prop="personalEvaluation" />
          </el-table>
        </el-row>

      </template>
    </el-form-item>

  </el-form>
</template>

<script>
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      expertiseOptions:[],
      certificateData:[],
      familyData:[],
      //巡视巡查工作

      //实战练兵对象
      actualCombat:[],
      //查办案件对象
      investigating:[],
      //专题授课
      specialLecture:[],
      //业务培训
      businessTraining:[],
      showTable:false,
      // 遮罩层
      loading: true,
      deptOptions:[],
      sexOptions:[],
      rankOptions:[],
      gradeOptions:[],
      roleNameOptions:[],
      personnelTypeOptions:[],
      personnelStatusOptions:[],
      certificateType:[],
      participantsOptions:[],
      organizingDepartmentOptions:[],
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getDicts("expertise").then(response => {
      this.expertiseOptions = response.data;
    });
    this.getDicts("organizing_department").then(response => {
      this.organizingDepartmentOptions = response.data;
    });
    this.getDicts("participants").then(response => {
      this.participantsOptions = response.data;
    });
    this.getDicts("role").then(response => {
      this.roleNameOptions = response.data;
    });
    this.getDicts("grade").then(response => {
      this.gradeOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("rank").then(response => {
      this.rankOptions = response.data;
    });
    this.getDicts("personnel_type").then(response => {
      this.personnelTypeOptions = response.data;
    });
    this.getDicts("personnel_status").then(response => {
      this.personnelStatusOptions = response.data;
    });

    this.getDicts("certificate_type").then(response => {
      this.certificateType = response.data;
    });
    this.getTreeselect()
  },
  methods: {
    // 参与对象字典翻译
    participantsFormat(row, column) {
      return this.selectDictLabel(this.participantsOptions, row.participants);
    },
    roleNameFormat(row, column) {
      return this.selectDictLabel(this.roleNameOptions, row.roleName);
    },
    organizingDepartmentFormat(row, column) {
      return this.selectDictLabel(this.organizingDepartmentOptions, row.organizingDepartment);
    },

    gradeFormat(row, column) {
      return this.selectDictLabel(this.gradeOptions, row.grade);
    },
    rTime(date) {
      var json_date = new Date(date).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    // '用户性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // '证书类型字典翻译
    certificateTypeFormat(row, column) {
      return this.selectDictLabel(this.certificateType, row.certificateType);
    },
    // 职级字典翻译
    rankFormat(row, column) {
      return this.selectDictLabel(this.rankOptions, row.ranks);
    },
    // 人员类型字典翻译
    personnelTypeFormat(row, column) {
      return this.selectDictLabel(this.personnelTypeOptions, row.personnelType);
    },
    // 人员状态 0：在职 1：离职字典翻译
    personnelStatusFormat(row, column) {
      return this.selectDictLabel(this.personnelStatusOptions, row.personnelStatus);
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
  h3.li_title{
    text-indent:-2em;
  }
  .el-icon{
    color:darkred;
    background-image: url("../../../assets/image/login-background.jpg");
  }
</style>
