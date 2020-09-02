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
          v-hasPermi="['investigating:investigating:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['investigating:investigating:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['investigating:investigating:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['investigating:investigating:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="investigatingList" @selection-change="handleSelectionChange">
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

      <el-table-column label="角色" align="center" prop="roleName" :formatter="roleNameFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['investigating:investigating:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['investigating:investigating:remove']"
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

    <!-- 添加或修改查办案件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
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
                <el-date-picker clearable size="small" style="width: 220px"
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
                <el-date-picker clearable size="small" style="width: 220px"
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
                <span class="font1">参与类型</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <treeselect v-model="form.typesParticipations"     multiple :options="typeOptions"  :show-count="true" placeholder="请选择参与类型" />

              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">角色</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-select size="medium" v-model="form.roleName" style="width:100%" placeholder="请选择角色">
                  <el-option
                    v-for="dict in roleNameOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>

            </el-row>


            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">是否主办人</span>
              </el-col>
              <el-col :span="2.5" style="text-align: center;">
                <el-radio-group v-model="form.sponsor" size="small">
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
          </template>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <user-table ref="import" @selected="handleImport" />
  </div>
</template>

<script>
import { listInvestigating, getInvestigating, delInvestigating, addInvestigating, updateInvestigating, exportInvestigating } from "@/api/investigating/investigating";
import { treeselect} from "@/api/system/work";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import userTable from "../../business/training/userTable";
export default {
  name: "Investigating",
  components: { Treeselect,userTable },
  data() {
    return {
      showTable:false,
      userflag:false,
      name:"",
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
      // 总条数
      total: 0,
      typeOptions:[],
      // 查办案件表格数据
      investigatingList: [],
      // 弹出层标题
      title: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 是否显示弹出层
      open: false,
      // 角色字典
      roleNameOptions: [],
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
    this.getDicts("role").then(response => {
      this.roleNameOptions = response.data;
    });
    this.getTypeTreeselect();
  },
  methods: {
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
    /** 查询查办案件列表 */
    getList() {
      this.loading = true;
      listInvestigating(this.queryParams).then(response => {
        this.investigatingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门树结构 */
    getTypeTreeselect() {
      treeselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    // 角色字典翻译
    roleNameFormat(row, column) {
      return this.selectDictLabel(this.roleNameOptions, row.roleName);
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
        typesParticipation: null,
        roleName: null,
        sponsor: null,
        caseContent: null,
        isdel: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.userflag=true;
      this.title = "添加查办案件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInvestigating(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.userflag=false;
        this.title = "修改查办案件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInvestigating(this.form).then(response => {
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
            this.form.departName=this.departName;
            addInvestigating(this.form).then(response => {
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
      this.$confirm('是否确认删除查办案件编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInvestigating(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有查办案件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInvestigating(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
