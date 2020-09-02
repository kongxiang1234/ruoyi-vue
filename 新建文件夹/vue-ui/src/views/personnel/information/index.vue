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
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="姓名" prop="fullName">
            <el-input
              v-model="queryParams.fullName"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户性别" prop="sex">
            <el-select v-model="queryParams.sex" placeholder="请选择用户性别" clearable size="small">
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="现任职务" prop="currentPosition">
            <el-input
              v-model="queryParams.currentPosition"
              placeholder="请输入现任职务"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工作单位" prop="workUnit">
            <el-input
              v-model="queryParams.workUnit"
              placeholder="请输入工作单位"
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

        <el-row :gutter="20" class="mb8">
          <el-col :span="2.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['personnel:information:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['personnel:information:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['personnel:information:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['personnel:information:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="2.5">
            <el-button
              type="primary"
              icon="el-icon-user"
              size="mini"
              :disabled="multiple"
              @click="handleState"
            >状态设置</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="" v-if="showTable" align="center" prop="id" />
          <el-table-column label="姓名" align="center" prop="fullName" />
          <el-table-column label="部门单位" align="center" prop="dept" />
          <el-table-column label="用户性别" align="center" prop="sex" :formatter="sexFormat" />
          <el-table-column label="现任职务" align="center" prop="currentPosition" />
          <el-table-column label="工作单位" align="center" prop="workUnit" />
          <el-table-column label="操作" align="center" width="250%" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['personnel:information:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['personnel:information:remove']"
              >删除</el-button>

              <el-button
                size="mini"
                type="text"
              > <router-link :to="{path:'/user/personnel',query:{id:scope.row.id}}">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link></el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> </el-col>
    </el-row>




    <!-- 添加或修改personnel对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item>
          <h3>基本信息：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">姓名</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-form-item prop="fullName">
                  <el-input v-model="form.fullName" placeholder="请输入姓名" />
                </el-form-item>

              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">性别</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-select size="medium" v-model="form.sex" style="width:100%" placeholder="请选择用户性别">
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
                                v-model="form.birthTime"
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
                <el-input v-model="form.nation" placeholder="请输入名族" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">籍贯</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">出生地</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.birthplace" placeholder="请输入出生地" />
              </el-col>

            </el-row>


            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">入党时间</span>
              </el-col>
              <el-col :span="4" style="text-align: center;">
                <el-date-picker clearable size="small" style="width: 270px"
                                v-model="form.joinTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择入党时间">
                </el-date-picker>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">参加工作时间</span>
              </el-col>
              <el-col :span="4" style="text-align: center;">
                <el-date-picker clearable size="small" style="width: 266px;margin-left: -89px"
                                v-model="form.workTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择参加工作时间">
                </el-date-picker>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">政治面貌</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.politicalOutlook" placeholder="请输入政治面貌" />
              </el-col>

            </el-row>


            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">身份证号</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="form.idNumber" placeholder="请输入身份证号码" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">现任职务</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="form.currentPosition" placeholder="请输入现任职务" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">职级</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-select size="medium" v-model="form.ranks" style="width:100%" placeholder="请选择职级">
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
                <el-select size="medium" v-model="form.personnelType" style="width:100%" placeholder="请选择人员类型">
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
                <el-select size="medium" v-model="form.personnelStatus" style="width:100%" placeholder="请选择人员类型">
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
                <treeselect v-model="form.deptName" :options="deptOptions"  :show-count="true" placeholder="请选择归属部门" />
              </el-col>
            </el-row>

            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">工作单位</span>
              </el-col>
              <el-col :span="22" style="text-align: center;">
                <el-input v-model="form.workUnit" placeholder="请输入工作单位" />
              </el-col>

            </el-row>
            <el-row  style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">全日制学历</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="form.fullTime" placeholder="请输入全日制教育" style="margin-left: -3px"/>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">全日制学位</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="form.fullEducation" placeholder="请输入全日制学位" style="margin-left: -3px"/>
              </el-col>
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">毕业院校及专业</span>
              </el-col>
              <el-col :span="5" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.fullGraduated" placeholder="请输入全日制毕业院校及专业" />
              </el-col>

            </el-row>
            <el-row  style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">在职教育学历</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="form.theJob" placeholder="请输入在职教育" style="margin-left: -3px"/>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">在职教育学位</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="form.theEducation" placeholder="请输入在职教育学位" style="margin-left: -3px"/>
              </el-col>
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">毕业院校及专业</span>
              </el-col>
              <el-col :span="5" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="form.theJobGraduated" placeholder="请输入在职教育毕业院校及专业" />
              </el-col>

            </el-row>
          </template>

          <h3>专长：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="24" style="text-align: center;">
                <el-select size="medium" multiple v-model="form.expertises" style="width:100%" placeholder="请选择人员类型">
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
          <h3>工作简历：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">工作简历</span>
              </el-col>
              <el-col :span="22" style="text-align: center;">
                <el-input type="textarea"
                          :rows="4" v-model="form.resume" placeholder="请输入工作简历" />
              </el-col>
            </el-row>

          </template>


          <h3>证书情况：</h3>
          <template style="margin: 2px 0">
            <el-row >
              <el-col :span="2.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleCertificateAdd"

                >新增</el-button>
              </el-col>
              <el-table v-loading="loading" :data="certificateData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="" v-if="showTable" align="center" prop="id" />
                <el-table-column label="证书名称" align="center" prop="certificateName" />
                <el-table-column label="获得时间" align="center" prop="getTime" >
                  <template slot-scope="scope">
                    <span>{{ rTime(scope.row.getTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="证书类型" align="center" prop="certificateType" :formatter="certificateTypeFormat" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="certificateHandleUpdate(scope.$index,scope.row)"
                    >修改</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="certificateHandleDelete(scope.$index,scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

          </template>

          <h3>家庭关系：</h3>
          <template style="margin: 2px 0">
            <el-row >
              <el-col :span="2.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleFamilyAdd"
                >新增</el-button>
              </el-col>
              <el-table v-loading="loading" :data="familyData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="" v-if="showTable" align="center" prop="id" />
                <el-table-column label="称谓" align="center" prop="familyAppellation" />
                <el-table-column label="姓名" align="center" prop="familyName" />
                <el-table-column label="年龄" align="center" prop="familyAge" />
                <el-table-column label="政治面貌" align="center" prop="familyZzmm" />
                <el-table-column label="工作单位及职务" align="center" prop="familyGzdw" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="familyUpdate(scope.$index,scope.row)"
                    >修改</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="familyDelete(scope.$index,scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改证书信息对话框 -->
    <el-dialog :title="zstitle" :visible.sync="certificateOpen" width="1200px" append-to-body>
      <el-form ref="certificate" :model="certificate" :rules="rules" label-width="80px">
        <el-form-item>
          <h3>证书信息：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">证书名称</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="certificate.certificateName" placeholder="请输入证书名称" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">证书类型</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-select size="medium" v-model="certificate.certificateType" style="width:100%" placeholder="请选择证书类型">
                  <el-option
                    v-for="dict in certificateType"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">获得时间</span>
              </el-col>
              <el-col :span="4" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-date-picker  clearable size="small" style="width: 270px"
                                 v-model="certificate.getTime"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 placeholder="选择获得时间">
                </el-date-picker>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="certificateSubmit">确 定</el-button>
        <el-button @click="certificateCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改家庭关系对话框 -->
    <el-dialog :title="jttitle" :visible.sync="familyOpen" width="1200px" append-to-body>
      <el-form ref="family" :model="family" :rules="rules" label-width="80px">
        <el-form-item>
          <h3>家庭关系：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">称谓</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="family.familyAppellation" placeholder="请输入称谓" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">姓名</span>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-input v-model="family.familyName" placeholder="请输入姓名" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">年龄</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-input v-model="family.familyAge" placeholder="请输入年龄" />
              </el-col>
            </el-row>
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">政治面貌</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="family.familyZzmm" placeholder="请输入政治面貌" />
              </el-col>
              <el-col :span="2" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">工作单位职务</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-input v-model="family.familyGzdw" placeholder="请输入工作单位及职务" />
              </el-col>
            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="familySubmit">确 定</el-button>
        <el-button @click="familyCancel">取 消</el-button>
      </div>
    </el-dialog>



    <el-dialog :title="statetitle" :visible.sync="stateOpen" width="1200px" append-to-body>
      <el-form ref="stateForm" :model="stateForm" :rules="rules" label-width="80px">
        <el-form-item>
          <h3>状态设置：</h3>
          <template style="margin: 2px 0">
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">请选择当前人员状态</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
                <el-radio v-model="stateForm.state" label="2">退休</el-radio>
                <el-radio v-model="stateForm.state" label="3">离职</el-radio>
              </el-col>
            </el-row>
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">变动时间</span>
              </el-col>
              <el-col :span="6" style="text-align: center;border-right:1px solid #cdcdcd ">
                <el-date-picker  clearable size="small" style="width: 270px"
                                 v-model="stateForm.timeChange"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 placeholder="选择变动时间">
                </el-date-picker>
              </el-col>
            </el-row>
            <el-row style="line-height: 40px;border:1px solid #cdcdcd">
              <el-col :span="3" style="text-align: center;border-right:0px solid #cdcdcd ">
                <span class="font1">相关文件</span>
              </el-col>
              <el-col :span="6" style="text-align: center;">
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
        <el-button type="primary" @click="stateFormSubmit">确 定</el-button>
        <el-button @click="stateFormCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInformation, getInformation, delInformation, addInformation, updateInformation, exportInformation,removeFaily,removeCertificate} from "@/api/personnel/information";
import { getToken } from "@/utils/auth";
import { download} from "@/utils/ruoyi";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Information",
  components: { Treeselect },
  data() {
    return {
      radio: '',
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
      statetitle:'',
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
      stateOpen:false,
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
        currentPosition: null,
        workUnit: null,
        deptId: undefined,
      },
      // 表单参数
      form: {},
      family:{},
      deptOptions:[],
      certificate:{},
      stateForm:{},
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
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
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
// 筛选节点
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
      listInformation(this.queryParams).then(response => {
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
    stateFormCancel(){
      this.stateOpen=false;
      this.stateReset();
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
      this.certificateData=[];
        this.familyData=[];
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
        if(response.data.expertise!=""){
          let jobType=response.data.expertise;
          let arr=new Array()
          let job=jobType.split(",");
          for (let i = 0; i < job.length; i++) {
            arr.push(job[i])
          }
          response.data.expertises=arr;
        }
        this.certificateContent=true;
        this.familyContent=true;
        this.certificateData=response.data.certificate;
        this.familyData=response.data.familyRelations;
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
          debugger
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
    stateFormSubmit(){
      this.$refs["stateForm"].validate(valid => {
        if (valid) {
            this.form.file=this.upload.name;
            addInformation(this.form).then(response => {
              if (response.code === 200) {

                this.msgSuccess("新增成功");
                this.stateOpen = false;
                this.getList();
              }
            });

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
    },
    handleState(row){
      const ids = row.id || this.ids;
      this.stateReset();
      this.stateOpen = true;
      this.statetitle = "状态设置";
    },
    stateReset(){
      this.stateForm = {
        state: null,
        timeChange: null,
        files: null
      };
    },
    /** 导入按钮操作 */
    handleUpload() {
      this.upload.title = "个人表现上传";
      this.upload.open = true;
    },
  }
};
</script>
