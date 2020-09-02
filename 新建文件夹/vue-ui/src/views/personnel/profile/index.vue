<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>头像</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
              <userInfo :user="user" />
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import { getUserProfile } from "@/api/personnel/information";


export default {
  name: "Profile",
  components: { userAvatar, userInfo },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    let  library_id = this.$route.query.id;
    this.getUser(library_id);
  },
  methods: {
    getUser(library_id) {
      getUserProfile(library_id).then(response => {
        let jobType=response.data.expertise;
        let arr=new Array()
        let job=jobType.split(",");
        for (let i = 0; i < job.length; i++) {
          arr.push(job[i])
        }
        response.data.expertises=arr;
        this.user = response.data;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>
