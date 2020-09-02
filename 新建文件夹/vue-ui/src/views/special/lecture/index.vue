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
      <el-form-item label="班次名称" prop="shiftName">
        <el-input
          v-model="queryParams.shiftName"
          placeholder="请输入班次名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="授课名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入授课名称"
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
          v-hasPermi="['special:lecture:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['special:lecture:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['special:lecture:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['special:lecture:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lectureList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="授课名称" v-if="showTable" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="部门名称" align="center" prop="departName" />
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

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['special:lecture:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['special:lecture:remove']"
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

    <!-- 添加或修改专题授课对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item>
          <template style="margin: 2px 0">
            <el-row  v-if="userflag" style="line-height: 40px;border:0px solid #cdcdcd;margin-left: -70px">
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
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
        <el-form-item label="开始时间" prop="btime">
          <el-date-picker clearable size="small" style="width: 480px"
            v-model="form.btime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="etime">
          <el-date-picker clearable size="small" style="width: 480px"
            v-model="form.etime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="举办部门" prop="organizingDepartment">
          <el-select size="medium" v-model="form.organizingDepartment" style="width:100%" placeholder="请输入举办部门">
            <el-option
              v-for="dict in organizingDepartmentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次名称" prop="shiftName">
          <el-input v-model="form.shiftName" placeholder="请输入班次名称" />
        </el-form-item>
        <el-form-item label="参与对象" prop="participants">
          <el-select v-model="form.participants" style="width: 480px" placeholder="请选择参与对象">
            <el-option
              v-for="dict in participantsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入授课名称" />
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
import { listLecture, getLecture, delLecture, addLecture, updateLecture, exportLecture } from "@/api/special/lecture";
import userTable from "../../business/training/userTable";
export default {
  name: "Lecture",
  components: { userTable },
  data() {
    return {
      showTable:false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      userflag:false,
      name:"",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 专题授课表格数据
      lectureList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      organizingDepartmentOptions:[],
      // 参与对象字典
      participantsOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        btime: null,
        etime: null,
        shiftName: null,
        courseName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("participants").then(response => {
      this.participantsOptions = response.data;
    });
    this.getDicts("organizing_department").then(response => {
      this.organizingDepartmentOptions = response.data;
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
    handleChange() {
      this.$refs.import.show();
    },
    /** 查询专题授课列表 */
    getList() {
      this.loading = true;
      listLecture(this.queryParams).then(response => {
        this.lectureList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 参与对象字典翻译
    participantsFormat(row, column) {
      return this.selectDictLabel(this.participantsOptions, row.participants);
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
        organizingDepartment: null,
        shiftName: null,
        participants: null,
        courseName: null,
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
      this.title = "添加专题授课";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLecture(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.userflag=false;
        this.title = "修改专题授课";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLecture(this.form).then(response => {
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
            addLecture(this.form).then(response => {
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
      this.$confirm('是否确认删除专题授课编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLecture(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有专题授课数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLecture(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
