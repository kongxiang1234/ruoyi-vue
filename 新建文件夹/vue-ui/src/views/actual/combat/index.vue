<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="开始时间" prop="btime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.btime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="etime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.etime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="案件名称" prop="nameCase">
        <el-input
          v-model="queryParams.nameCase"
          placeholder="请输入案件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="案件领域" prop="caseArea">
        <el-input
          v-model="queryParams.caseArea"
          placeholder="请输入案件领域"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['actual:combat:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['actual:combat:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['actual:combat:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['actual:combat:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="combatList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" v-if="showTable" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="部门" align="center" prop="departName" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['actual:combat:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['actual:combat:remove']"
          >删除</el-button>
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

    <!-- 添加或修改实战练兵对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item>
          <template style="margin: 2px 0">
            <el-row  v-if="userflag" style="line-height: 40px;border:0px solid #cdcdcd;margin-left: -70px">
              <el-col :span="5" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">选择用户</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="this.name" placeholder="请选择用户" />
              </el-col>
              <el-col :span="4" style="text-align: center;border-right:0px solid #cdcdcd ">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleChange"
                >选择</el-button>
              </el-col>

            </el-row>
          </template>
        </el-form-item>
        <el-form-item>
          <h3>基本信息：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">开始时间</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-date-picker clearable size="small" style="width: 265px"
                                v-model="form.btime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择开始时间">
                </el-date-picker>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">结束时间</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-date-picker clearable size="small" style="width: 265px"
                                v-model="form.etime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择结束时间">
                </el-date-picker>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:1px solid #cdcdcd ">
                <span class="font1">案件名称</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.nameCase" placeholder="请输入案件名称" />
              </el-col>

            </el-row>

            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">案件领域</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="form.caseArea" placeholder="请输入案件领域" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">擅长工作领域</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <treeselect v-model="form.areasWorks"  :checkedKeys="defaultCheckedKeys"   multiple :options="typeOptions" :show-count="true" placeholder="请选择参与类型" />

              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">承办部门</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.department" placeholder="请输入承办部门" />
              </el-col>

            </el-row>


            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">是否借调</span>
              </el-col>
              <el-col :span="2.5" style="text-align: center;">
                <el-radio-group v-model="form.toLoan" size="small">
                  <el-radio-button label="0">是</el-radio-button>
                  <el-radio-button label="1">否</el-radio-button>
                </el-radio-group>
              </el-col>

            </el-row>
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">

              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">案件内容</span>
              </el-col>
              <el-col :span="22" style="text-align: center;">
                <el-input type="textarea"
                          :rows="4" v-model="form.caseContent" placeholder="请输入案件内容" />
              </el-col>
            </el-row>
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">政治素质</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-select size="medium" v-model="form.politicalQuality" style="width:100%" placeholder="请选择政治素质">
                  <el-option
                    v-for="dict in gradeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">业务能力</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-select size="medium" v-model="form.businessCapability" style="width:100%" placeholder="请选择业务能力">
                  <el-option
                    v-for="dict in gradeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">工作作风</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-select size="medium" v-model="form.styleWork" style="width:100%" placeholder="请选择工作作风">
                  <el-option
                    v-for="dict in gradeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>

            </el-row>

            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">个人表现</span>
              </el-col>
              <el-col :span="3" style="text-align: center;">
                <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleUpload" >上传</el-button>
              </el-col>
              <el-col :span="5" style="text-align: center;">
                <el-input disabled v-model="this.upload.name" />
              </el-col>

              <el-button type="info" icon="el-icon-download" size="mini" @click="downloadTemplate" >下载</el-button>

            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".pdf, .doc, .docx, .xls, .xlsx" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：上传文件带有文字性质的 如 哈哈.doc 正确 , 哈哈(1).doc 错误！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <user-table ref="import" @selected="handleImport" />
  </div>
</template>

<script>
import { listCombat, getCombat, delCombat, addCombat, updateCombat, exportCombat,getCombatDownload } from "@/api/actual/combat";
import { download} from "@/utils/ruoyi";
import { treeselect} from "@/api/system/work";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import userTable from "../../business/training/userTable";
export default {
  name: "Combat",
  components: { Treeselect,userTable },
  data() {
    return {
      showTable:false,
      userflag:false,
      name:"",
      defaultCheckedKeys: [],
      // 用户导入参数
      upload: {
        fileurl:"",
        name:"",
        // 是否显示弹出层（用户导入）
        open: false,
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/actual/combat/importData",
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      gradeOptions: [],
      // 总条数
      total: 0,
      // 实战练兵表格数据
      combatList: [],
      typeOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        btime: null,
        etime: null,
        nameCase: null,
        caseArea: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        btime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        etime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("grade").then(response => {
      this.gradeOptions = response.data;
    });
    this.getTypeTreeselect();
  },
  methods: {
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 导入按钮操作 */
    handleUpload() {
      this.upload.title = "个人表现上传";
      this.upload.open = true;
    },
    downloadTemplate() {
      let filename=this.upload.name;
      if(filename==""){
        this.msgSuccess("请先上传在下载")
        return
      }
      download(filename).then((response) => {
        this.download(response.msg);
      });
    },
    handleFileSuccess(response, file, fileList) {
      this.msgSuccess("上传成功")
      this.upload.open = false;
      this.$refs.upload.clearFiles();
      this.upload.fileurl=response.fileUrl;
      this.upload.name=file.name;
    },
    handleImport(val){
      var tempArr = val[0].split(".");
      this.name=tempArr[0];
      this.userId = tempArr[1];
      this.departName = tempArr[2];
      this.$refs.import.visible=false;

    },
    handleChange() {
      this.$refs.import.show();
    },
    /** 查询实战练兵列表 */
    getList() {
      this.loading = true;
      listCombat(this.queryParams).then(response => {
        this.combatList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        btime: null,
        etime: null,
        nameCase: null,
        caseArea: null,
        toLoan: null,
        caseContent: null,
        isdel: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        department: null,
        areasWork: null,
        personalPerformance: null,
        politicalQuality: null,
        businessCapability: null,
        styleWork: null
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
    /** 查询部门树结构 */
    getTypeTreeselect() {
      treeselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.userflag=true;
      this.title = "添加实战练兵";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCombat(id).then(response => {
        this.upload.name=response.data.performanceName;
        let jobType=response.data.areasWork;
        jobType=jobType.substring(0,jobType.length-1)
        let arr=new Array()
        let job=jobType.split(",");
        for (let i = 0; i < job.length; i++) {
          arr.push(job[i])
        }
        debugger
        this.defaultCheckedKeys=arr;
        this.form = response.data;
        this.open = true;
        this.userflag=false;
        this.title = "修改实战练兵";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.personalPerformance=this.upload.fileurl;
            this.form.performanceName=this.upload.name;
            updateCombat(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            if(this.name==""){
              this.msgError("请选择用户");
              return
            }
            this.form.userId=this.userId;
            this.form.nickName=this.name;
            this.form.personalPerformance=this.upload.fileurl;
            this.form.departName=this.departName;
            this.form.performanceName=this.upload.name;
            addCombat(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除实战练兵编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCombat(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有实战练兵数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCombat(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
