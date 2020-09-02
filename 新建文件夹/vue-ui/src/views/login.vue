<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="form_box"></div>
      <h3 class="title">账号登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入用户名">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;" class="login_confirm">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">确定</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <div>
        <span>苏ICP备1000000号</span>
        <span>苏公网安备32012345678900号</span>
        <span>网站标识码:320124567</span>
      </div>
      <div>
        <span>技术支持:苏州凌旭信息技术公司</span>
        <span>热线服务:0512-62717553</span>
      </div>
    </div>

  </div>


</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {


    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });

          } else {
            Cookies.remove("username");
            Cookies.remove("password");

          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  /*html,body{*/
  /*  height:100%;*/
  /*  overflow:hidden;*/
  /*}*/
  body{
    font-size:14px;
  }
  @media only screen and (min-width:768px) {
    body{
      font-size:140%;
    }
  }
.login {
  display: flex;
  justify-content:flex-end;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: 100% 100%;
  position:relative;
}
.login .el-login-footer{
  position:absolute;
  bottom:-1px;
  left:0;
  width:100%;
  color:#000;
  height:auto;
  background-color: #efefef;
  border-top:1px solid #eee;
  padding:4.1vh 0;
}
.login .el-login-footer div{
  display: flex;
  justify-content: center;
  width:100%;
}
.login .el-login-footer span{
  margin:0 10px;
  font-size:140%;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 0px;
  background: #ffffff;
  width: 501px;
  padding: 25px 25px 5px 25px;
  position: relative;
  margin-right:13%;
  .el-input {
    height: 100px;
    input {
      height: 100px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}



.login-code-img {
  height: 38px;
}
  .el-input__prefix{
    color:red;
    display:flex;
    align-items: center;
  }
.login-form{
  border-radius: 6px;
  z-index:10;

}
  .form_box{
    display:block;
    background-color: rgba(255,255,255,.7);
    margin-left:10px;
    margin-top:4px;
    position:absolute;
    border-radius:6px;
    width:100%;
    height:100%;
    z-index:-1;
  }

.login-form .el-input{
  height:70px;
}
.login-form .el-input input{
  height:70px;
  font-size: 140%;
  background-color:#efefef;
}
.login-form .input-icon{
  width:26px;
  height:80px;
  margin-right:2px;
}
.el-input--prefix .el-input__inner{
  padding-left:42px;
}
.login_confirm button{
  background-color: darkred;
  border:0;
  font-size: 140%;
  padding:25px 20px;
  border-radius: 0;
}

</style>
