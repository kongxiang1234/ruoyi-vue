<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-row >

            <el-form-item label="姓名" >
              <el-input style="width: 202px"
                        v-model="queryParams.fullName"
                        placeholder="请输入姓名"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item label="性别" >
              <el-select v-model="queryParams.sex" placeholder="请选择用户性别" clearable size="small">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="毕业院校" >
              <el-input
                v-model="queryParams.fullEducation"
                placeholder="请输入毕业院校"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item label="专长" >
              <el-select style="width: 202px" v-model="queryParams.expertise" placeholder="请选择专长" clearable size="small">
                <el-option
                  v-for="dict in expertiseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯" >
              <el-input
                v-model="queryParams.nativePlace"
                placeholder="请输入籍贯"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="人员类型" >
              <el-select v-model="queryParams.personnelType" placeholder="请选择人员类型" clearable size="small">
                <el-option
                  v-for="dict in personnelTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>


          </el-row>
          <el-row>
            <el-form-item label="职级" >
              <el-select style="width: 202px" v-model="queryParams.ranks" placeholder="请选择职级" clearable size="small">
                <el-option
                  v-for="dict in rankOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="现任职务" >
              <el-input
                v-model="queryParams.currentPosition"
                placeholder="请输入现任职务"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="身份证号" >
              <el-input
                v-model="queryParams.idNumber"
                placeholder="请输入身份证号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

          </el-row>
          <el-row>
            <el-form-item label="年龄" >
              <el-input
                v-model="queryParams.bage"
                placeholder="请输入开始年龄"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-
            <el-form-item >
              <el-input
                v-model="queryParams.eage"
                placeholder="请输入结束年龄"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="借调次数" >
              <el-input
                v-model="queryParams.btoLoan"
                placeholder="请输入开始借调次数"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-
            <el-form-item >
              <el-input
                v-model="queryParams.etoLoan"
                placeholder="请输入结束借调次数"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主办案件数" >
              <el-input
                v-model="queryParams.bhostCase"
                placeholder="请输入开始主办案件数"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-
            <el-form-item >
              <el-input
                v-model="queryParams.ehostCase"
                placeholder="请输入结束主办案件数"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

          </el-row>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="" v-if="showTable" align="center" prop="id" />
          <el-table-column label="姓名" align="center" prop="fullName" />
          <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
          <el-table-column label="现任职务" align="center" prop="currentPosition" />
          <el-table-column label="籍贯" align="center" prop="workUnit" />
          <el-table-column label="工作单位" align="center" prop="workUnit" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"

              >借调</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"

              >调度</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

      </el-col>

    </el-row>






  </div>
</template>

<script>
import { statisticalList, getInformation} from "@/api/personnel/information";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Information",
  components: { Treeselect },
  data() {
    return {
      deptName:"",
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      showTable:false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // personnel表格数据
      informationList: [],
      // 弹出层标题
      title: "",
      zstitle:"",
      jttitle:"",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      certificateOpen: false,
      familyOpen: false,
      // '用户性别字典
      sexOptions: [],
      certificateType: [],
      // 职级字典
      rankOptions: [],
      // 人员类型字典
      personnelTypeOptions: [],
      // 人员状态 0：在职 1：离职字典
      personnelStatusOptions: [],
      expertiseOptions:[],

      // 工作简历字典
      isdelOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fullName: null,
        sex: null,
        ehostCase: null,
        bhostCase: null,
        idNumber: null,
        currentPosition: null,
        ranks: null,
        personnelStatus: null,
        etoLoan: null,
        deptName: null,
        btoLoan: null,
        personnelType: null,
        nativePlace: null,
        expertise: null,
        bage: null,
        eage: null,
        fullEducation: null,
        deptId: undefined,
      },
      // 表单参数
      form: {},
      family:{},
      deptOptions:[],
      certificate:{},
      // 表单校验
      rules: {
        fullName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
      },
      familyData:[],
      familyCurrentIndex:'',
      certificateData:[],
      certificateDataCurrentIndex:'',
      certificateContent:false,
      familyContent:false
    };
  },
  created() {
    this.getList();
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
    this.getDicts("expertise").then(response => {

      this.expertiseOptions = response.data;
    });

    this.getDicts("isdel").then(response => {
      this.isdelOptions = response.data;
    });
    this.getDicts("certificate_type").then(response => {
      this.certificateType = response.data;
    });
    this.getTreeselect()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    rTime(date) {
      var json_date = new Date(date).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询personnel列表 */
    getList() {
      this.loading = true;
      statisticalList(this.queryParams).then(response => {
        this.informationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    // 人员状态 0：在职 1：离职字典翻译
    isdelFormat(row, column) {
      return this.selectDictLabel(this.isdelOptions, row.isdel);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消证书按钮
    certificateCancel() {
      this.certificateOpen = false;
      this.resetCertificate();
    },

    /** 家庭关系按钮操作 */
    familyCancel() {
      this.familyOpen = false;
      this.resetFamily();
    },
    /** 家庭关系按钮操作 */
    resetFamily() {
      this.family = {
        familyAppellation: null,
        familyName: null,
        familyAge: null,
        familyZzmm: null,
        familyGzdw: null,
      };
      this.resetForm("family");
    },
    // 表单重置
    reset() {
      this.certificateData="";
        this.familyData="";
      this.form = {
        id: null,
        fullName: null,
        sex: null,
        birthTime: null,
        nation: null,
        nativePlace: null,
        birthplace: null,
        joinTime: null,
        expertises:null,
        workTime: null,
        politicalOutlook: null,
        currentPosition: null,
        rank: null,
        workUnit: null,
        fullTime: null,
        fullEducation:null,
        theEducation:null,
        fullGraduated: null,
        theJob: null,
        theJobGraduated: null,
        idNumber: null,
        personnelType: null,
        personnelStatus: "0",
        resume: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        isdel: null
      };

      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员信息";
    },
    resetCertificate() {
      this.certificate = {
        certificateName: null,
        getTime: null,
        certificateType: null,
      };
      this.resetForm("certificate");
    },
    /** 证书按钮操作 */
    handleCertificateAdd() {
      this.resetCertificate();
      this.certificateOpen = true;
      this.certificateDataCurrentIndex = "";
      this.zstitle = "添加证书信息";
    },
    /** 家庭关系按钮操作 */
    handleFamilyAdd() {
      this.resetFamily();
      this.familyOpen = true;
      this.familyCurrentIndex="";
      this.jttitle = "添加家庭关系信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInformation(id).then(response => {
        let jobType=response.data.expertise;
        let arr=new Array()
        let job=jobType.split(",");
        for (let i = 0; i < job.length; i++) {

          arr.push(job[i])
        }
        this.certificateContent=true;
        this.familyContent=true;
        this.certificateData=response.data.certificate;
        this.familyData=response.data.familyRelations;
        response.data.expertises=arr;
        this.form = response.data;
        this.open = true;
        this.title = "修改人员信息";
      });
    },
    certificateHandleUpdate(i,row){
      let certificateName=row.certificateName;
      let getTime=row.getTime;
      let certificateType=row.certificateType;
      this.certificate = {
        certificateName: certificateName,
        getTime: getTime,
        certificateType: certificateType,
      };
      this.certificateDataCurrentIndex = i
      this.certificateOpen = true;
      this.zstitle = "修改证书信息";
      this.resetForm("certificate");
    },
    familyUpdate(i,row){
      this.family = {
        familyAppellation:row.familyAppellation,
        familyName:row.familyName,
        familyZzmm:row.familyZzmm,
        familyGzdw:row.familyGzdw,
        familyAge:row.familyAge
      };
      this.familyCurrentIndex = i
      this.familyOpen = true;
      this.jttitle = "修改家庭关旭信息";
      this.resetForm("family");
    },
    familyDelete(i,row){
      if(this.familyContent){
        const ids = row.id || this.ids;
        if(ids==""){
          this.familyData.splice(i,1)
          return
        }
        this.$confirm('是否确认删除家庭关系编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return removeFaily(ids);
        }).then(() => {
          this.familyData.splice(i,1)
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }else {
        this.familyData.splice(i,1)
      }
    },
    certificateHandleDelete(i,row){
      if(this.certificateContent){
        const ids = row.id || this.ids;
        if(ids==""){
          this.certificateData.splice(i,1)
          return
        }
        this.$confirm('是否确认删除证书编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return removeCertificate(ids);
        }).then(() => {
          this.certificateData.splice(i,1)
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }else {
        this.certificateData.splice(i,1)
      }

    },
    familySubmit(){
      if(this.family.familyAppellation=="" || this.family.familyAppellation==undefined){
        this.msgError("请输入称谓")
        return
      }
      if(this.family.familyName=="" || this.family.familyName==undefined){
        this.msgError("请输入姓名")
        return
      }
      if(this.family.familyAge=="" || this.family.familyAge==undefined){
        this.msgError("请输入年龄")
        return
      }
      if(this.family.familyZzmm=="" || this.family.familyZzmm==undefined){
        this.msgError("请输入政治面貌")
        return
      }
      if(this.family.familyGzdw=="" || this.family.familyGzdw==undefined){
        this.msgError("请输入工作单位及职务")
        return
      }
      let adddata={
        num:this.familyData.length + 1,
        familyAppellation:this.family.familyAppellation,
        familyName:this.family.familyName,
        familyZzmm:this.family.familyZzmm,
        familyGzdw:this.family.familyGzdw,
        familyAge:this.family.familyAge
      }

      if (this.familyCurrentIndex === ''){
        this.familyData.push(adddata)
      } else {
        this.familyData.splice(this.familyCurrentIndex,1,adddata)
      }
      this.familyCancel();
    },
    certificateSubmit(){
          if(this.certificate.certificateName=="" || this.certificate.certificateName==undefined){
            this.msgError("请输入证书名称")
            return
          }
          if(this.certificate.certificateType=="" || this.certificate.certificateType==undefined){
            this.msgError("请选择证书类型")
            return
          }
          if(this.certificate.getTime=="" || this.certificate.getTime==undefined){
            this.msgError("请选择获得时间")
            return
          }
          let adddata={
            num:this.certificateData.length + 1,
            certificateName:this.certificate.certificateName,
            certificateType:this.certificate.certificateType,
            getTime:this.certificate.getTime
          }

          if (this.certificateDataCurrentIndex === ''){
            this.certificateData.push(adddata)
          } else {
            this.certificateData.splice(this.certificateDataCurrentIndex,1,adddata)
          }
          this.certificateCancel();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInformation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {

            this.form.familyRelations=this.familyData;
              this.form.certificate=this.certificateData
            debugger
            addInformation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    handleChange(row){
      const ids = row.id || this.ids;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除人员信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInformation(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有人员信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInformation(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
