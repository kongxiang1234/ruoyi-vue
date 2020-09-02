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
      <el-form-item label="巡视地区或单位" prop="inspectionArea">
        <el-input
          v-model="queryParams.inspectionArea"
          placeholder="请输入巡视地区或单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作类型" prop="jobType">
        <el-select v-model="queryParams.jobType" placeholder="请选择工作类型" clearable size="small">
          <el-option
            v-for="dict in jobTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="评级" prop="grade">
        <el-select v-model="queryParams.grade" placeholder="请选择评级" clearable size="small">
          <el-option
            v-for="dict in gradeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['inspection:work:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['inspection:work:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['inspection:work:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['inspection:work:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="show" label="id" hide="true" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="单位" align="center" prop="departName" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inspection:work:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inspection:work:remove']"
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

    <!-- 添加或修改巡视巡查工作对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item>
          <template style="margin: 2px 0">
            <el-row v-if="userflag" style="line-height: 40px;border:0px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
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
              <el-col :span="3" style="text-align: center;border-right:1px solid #cdcdcd ">
                <span class="font1">巡视地区或单位</span>
              </el-col>
              <el-col :span="5" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.inspectionArea" placeholder="请输入巡视地区或单位" />
              </el-col>

            </el-row>


            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">工作类型</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-select multiple @change="changeSelect" v-model="form.jobTypes" style="width: 220px" placeholder="请选择工作类型">
                  <el-option
                    v-for="dict in jobTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">评级</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-select v-model="form.grade" style="width: 220px" placeholder="请选择评级">
                  <el-option
                    v-for="dict in gradeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>

            <el-row v-if="remarks" style="line-height: 40px;border:1px solid #cdcdcd">

              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">备注</span>
              </el-col>
              <el-col :span="22" style="text-align: center;">
                <el-input type="textarea"
                          :rows="4" v-model="form.remarks" placeholder="请输入备注" />
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
import { listWork, getWork, delWork, addWork, updateWork, exportWork } from "@/api/inspection/work";
import userTable from "../../business/training/userTable";
export default {
  name: "Work",
  components: { userTable },
  data() {
    return {
      show:false,
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
      // 巡视巡查工作表格数据
      workList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 工作类型字典
      jobTypeOptions: [],
      // 评级字典
      userflag:false,
      gradeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        btime: null,
        etime: null,
        inspectionArea: null,
        jobTypes: null,
        grade: null,
      },
      remarks:false,
      name:"",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("job_type").then(response => {
      this.jobTypeOptions = response.data;
    });
    this.getDicts("grade").then(response => {
      this.gradeOptions = response.data;
    });
  },
  methods: {
    handleImport(val){
      var tempArr = val[0].split(".");
      this.name=tempArr[0];
      this.userId = tempArr[1];
      this.departName = tempArr[2];
      this.$refs.import.visible=false;

    },
    /** 查询巡视巡查工作列表 */
    changeSelect(val){
      for (let i = 0; i < val.length; i++) {
        if(val[i]=="5"){
          this.remarks=true;
        }
      }

    },
    getList() {
      this.loading = true;
      listWork(this.queryParams).then(response => {
        this.workList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 工作类型字典翻译
    jobTypeFormat(row, column) {
      return this.selectDictLabel(this.jobTypeOptions, row.jobType);
    },
    // 评级字典翻译
    gradeFormat(row, column) {
      return this.selectDictLabel(this.gradeOptions, row.grade);
    },
    handleChange() {
      this.$refs.import.show();
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
        inspectionArea: null,
        jobTypes: null,
        grade: null,
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
      this.title = "添加巡视巡查工作";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWork(id).then(response => {
        let jobType=response.data.jobType;
        jobType=jobType.substring(0,jobType.length-1)
        let arr=new Array()
        let job=jobType.split(",");
        for (let i = 0; i < job.length; i++) {
          if(job[i]=="5"){
            this.remarks=true;
          }
          arr.push(job[i])
        }
        this.userflag=false;
        response.data.jobTypes=arr;
        this.form = response.data;
        this.open = true;
        this.title = "修改巡视巡查工作";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWork(this.form).then(response => {
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
            addWork(this.form).then(response => {
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
      this.$confirm('是否确认删除巡视巡查工作编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWork(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有巡视巡查工作数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWork(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
