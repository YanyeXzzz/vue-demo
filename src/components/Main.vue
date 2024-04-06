<template>
  <a-layout :style="{ height: '100vh' }">
    <a-layout-header class="header">
      <div>
        <h2 :style="{ color: 'white' }">学生信息管理系统</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal"
        :style="{ lineHeight: '64px', width: '20%' }">
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-sub-menu key="3">
          <template #title>
            <span>我的</span>
          </template>
          <a-menu-item key="3-1" @click="getUserInfo">我的信息</a-menu-item>
          <a-menu-item key="3-2" @click="logOut">退出登录</a-menu-item>
          <a-menu-item key="3-3" @click="updataPwd">修改密码</a-menu-item>
        </a-sub-menu>
        <a-menu-item>
          <a-avatar class="avatar" :src="avatarUrl">user</a-avatar>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <!-- 侧边菜单栏 -->
        <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline"
          :style="{ height: '100%', borderRight: 0 }" theme="dark">
          <a-sub-menu key="sub1">
            <template #title>
              <span>学生管理</span>
            </template>
            <a-menu-item key="sub1-1" @click="showModal_add">添加学生</a-menu-item>
            <a-menu-item key="sub1-2">学生信息</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>学生成绩管理</span>
            </template>
            <a-menu-item key="sub2-1">成绩查询</a-menu-item>
            <a-menu-item key="sub2-2">option6</a-menu-item>
            <a-menu-item key="sub2-3">option7</a-menu-item>
            <a-menu-item key="sub2-4">option8</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #title>
              <span>用户管理</span>
            </template>
            <a-menu-item key="sub3-1">添加用户</a-menu-item>
            <a-menu-item key="sub3-2">用户信息</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>学生管理</a-breadcrumb-item>
          <a-breadcrumb-item>学生信息</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px', }">
          <router-view @dataSource="getDataSource" :key="componentKey"></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>

  <a-modal v-model:open="open_addModal" title="添加学生" @ok="addStudent">
    <a-form :model="addStuFormData" :rules="rules_add" ref="formRef">
      <a-form-item label="学号" name="id" has-feedback><a-input v-model:value="addStuFormData.id" /></a-form-item>
      <a-form-item label="姓名" name="username" has-feedback><a-input
          v-model:value="addStuFormData.username" /></a-form-item>
      <a-form-item label="年龄" name="age" has-feedback><a-input v-model:value="addStuFormData.age" /></a-form-item>
      <a-form-item label="性别" name="sex" has-feedback>
        <a-radio-group v-model:value="addStuFormData.sex">
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="班级" name="className" has-feedback>
        <a-select v-model:value="addStuFormData.className">
          <a-select-option value="22软件0031">22软件0031</a-select-option>
          <a-select-option value="22软件0032">22软件0032</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>

</template>

<script>
import axios from 'axios';
import { h } from 'vue'
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined , } from '@ant-design/icons-vue';




export default {
  data() {
    return {
      userInfo: {},

      userInfoFormRef: {},

      userInfoMoal: false,
      avatarUrl: 'https://hmleadnews-yanye.oss-cn-beijing.aliyuncs.com/1b9c3988-e6ab-4c4d-8275-94f3900833cd.jpg',

      selectedKeys1: ['2'],
      selectedKeys2: ['sub1-2'],
      openKeys: ['sub1'],

      dataSource: [],

      open_addModal: false,
      addStuFormData: {},

      componentKey: 0,

      formRef: {},

      rules_add: {
        id: [
          {
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          },
          {
            pattern: /^\d{10}$/, // 确保输入为6到10位的数字
            message: '学号需为10位数字',
            trigger: 'blur',
          }
        ],
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '请输入性别',
            trigger: 'change'
          },
          {
            type: 'enum',
            enum: [
              '男',
              '女'
            ],
            message: '性别输入有误,请输入男或女',
            trigger: 'blur',
          }
        ],
        age: [
          {
            required: true,
            message: '请输入年龄',
            trigger: 'blur'
          },
          {
            pattern: /^(?:[1-9][0-9]?|100)$/,
            message: '年龄输入有误',
            trigger: 'blur',
          }
        ],
        className: [
          {
            required: true,
            message: '请输入班级',
            trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    //使用派生事件获取子组件传递的数据
    getDataSource(data) {
      this.dataSource = data
    },

    showModal_add() {
      this.open_addModal = true;
    },
    addStudent() {
      this.$refs.formRef.validate().then(() => {
        // 表单验证成功后发送axios请求
        axios.post('http://47.109.25.111:9090/add', this.addStuFormData)
          .then(response => {
            if (response.data.code === 0) {
              this.componentKey++
              message.success(response.data.data)
            }
            else {
              message.error(response.data.message)
            }
          })
          .catch(error => {
            console.log(error)
            message.error('服务异常')
          })
        this.resetForm()
        this.open_addModal = false;
      }).catch(error => {
        console.log(error)
      })
    },

    resetForm() {
      this.addStuFormData = {}; // 重置表单数据
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields(); // 调用表单的resetFields方法来重置验证状态
      }
    },

    logOut() {
      Modal.confirm({
        title: '退出登录',
        icon: h(ExclamationCircleOutlined),
        content: '您确定要退出登录吗?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        centered: true,
        onOk: () => {
          this.$router.push('/')
        },
        onCancel: () => {

        },
      })
    },

    updataPwd() {
      // const params = new URLSearchParams()
      // params.append('username',)
      // params.append('oldPassword',)
      // params.append('newPassword',)
    },

    getUserInfo() {
      this.userInfoMoal = true
    }

  }
};
</script>

<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
}

.avatar {
  background-color: white;
  color: gray;
}
</style>
