<template>
    <a-row>
        <a-col :span="12" class="login login-left"></a-col>
        <a-col :span="12" class="login login-right">

            <!-- 登录 -->
            <div class="loginBox" v-if="status === 'login'">
                <h2 class="h2">登录</h2>
                <a-form :model="loginData" class="login-form" layout="vertical" ref="formRef">
                    <a-form-item label="用户名" name="username"
                        :rules="[{ required: true, message: '用户名不能为空', trigger: 'blur' }]">
                        <a-input autocomplete="current-username" placeholder="请输入用户名" v-model:value="loginData.username">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item label="密码" name="password"
                        :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]">
                        <a-input-password autocomplete="current-password" placeholder="请输入密码"
                            v-model:value="loginData.password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" class="login-form-button" :style="{ width: '200px' }"
                            @click="login" :loading="loading">
                            登录
                        </a-button>

                    </a-form-item>
                    <a-form-item>
                        <a href="" @click="goRegister($event)">没有账号？立即注册</a>
                    </a-form-item>
                </a-form>
            </div>

            <!-- 注册 -->
            <div class="loginBox" v-if="status === 'register'">
                <h2 class="h2">注册</h2>
                <a-form :model="loginData" class="login-form" layout="vertical" ref="formRef" :rules="formRules">
                    <a-form-item label="用户名" name="username"
                        :rules="[{ required: true, message: '用户名不能为空', trigger: 'blur'}]">
                        <a-input autocomplete="current-username" placeholder="请输入用户名" v-model:value="loginData.username">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item label="密码" name="password"
                        :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]">
                        <a-input-password autocomplete="current-password" placeholder="请输入密码"
                            v-model:value="loginData.password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item label="确认密码" name="rePassword">
                        <a-input-password autocomplete="current-password" placeholder="请确认密码"
                            v-model:value="loginData.rePassword">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>


                    <a-form-item>
                        <a-button type="primary" html-type="submit" class="login-form-button" :style="{ width: '150px' }"
                            @click="register" :loading="loading">
                            注册
                        </a-button>

                    </a-form-item>
                    <a-form-item>
                        <a href="" @click="goLogin($event)">已有账号？立即登录</a>
                    </a-form-item>
                </a-form>
            </div>
        </a-col>
    </a-row>
</template>
<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import axios from 'axios';

export default {
    components: {
        UserOutlined,
        LockOutlined
    },

    data() {
        return {
            formRef: {},

            loginData: {
                username: '',
                password: '',
                rePassword: ''
            },

            loading: false,

            status: 'login',

            formRules: {
                username:  [
                    {
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 10,
                        message: '用户名长度不符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '密码长度应为6-16位',
                        trigger: 'blur'
                    }
                ],
                rePassword: [
                    {
                        required: true,
                        message: '确认密码不能为空!',
                        trigger: 'blur'
                    },
                    {
                        validator: (_,value) => {
                            if(value !== this.loginData.password){
                                return Promise.reject('两次输入密码不一致!')
                            }
                            else{
                                return Promise.resolve()
                            }
                        },
                    }
                ]
            }
        }
    },

    methods: {
        login() {
            const params = new URLSearchParams()
            params.append('username', this.loginData.username)
            params.append('password', this.loginData.password)

            this.$refs.formRef.validate().then(() => {
                axios.post('http://localhost:9090/login', params)
                    .then(response => {
                        if (response.data.code === 0) {
                            message.success(response.data.data)
                            setTimeout(() => {
                                this.$router.push('/main/stuinfo')
                            }, 1500)
                        }
                        else {
                            message.error(response.data.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        message.error('服务异常!')
                    })
            })
                .catch(error => {
                    console.log(error)
                })
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 1500)
        },

        register() {
            const params = new URLSearchParams()
            params.append('username', this.loginData.username)
            params.append('password', this.loginData.password)

            this.$refs.formRef.validate().then(() => {
                axios.post('http://localhost:9090/register', params)
                    .then(response => {
                        if (response.data.code === 0) {
                            message.success(response.data.data)
                            setTimeout(() => {
                                this.status = 'login'
                                this.loginData = {}
                            }, 1500)
                        }
                        else {
                            message.error(response.data.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        message.error('服务异常!')
                    })
            })
                .catch(error => {
                    console.log(error)
                })
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 1500)
        },

        goLogin(event) {
            event.preventDefault()
            this.loginData = {}
            this.status = 'login'
            
        },

        goRegister(event) {
            event.preventDefault()
            this.loginData = {}
            this.status = 'register'
            
        }
    },

}
</script>
<style>
.login {
    height: 100vh;
}

.login-left {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    background: url(../assets/imgs/login_bg.jpg) no-repeat;
    background-size: cover;
}

.login-right {
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;

    .loginBox {
        padding: 20px;
        width: 35%;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .login-form {
            margin: 0 auto;
            width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}

.h2 {
    font-weight: 600;
}</style>