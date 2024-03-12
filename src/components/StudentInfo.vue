<template>
    <!-- <a-empty :image="simpleImage" v-if="dataSource == null" /> -->

    <a-form layout="inline">
        <a-form-item>
            <a-input  placeholder="请输入学号" v-model:value="stuId"></a-input>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit" @click="select">查询</a-button>
        </a-form-item>
    </a-form>

    <a-table class="ant-table-striped" :dataSource="dataSource" :columns="columns" :loading="tableLoading"
        :pagination="false">
        <template #bodyCell="{ column, index }">
            <template v-if="column.key === 'action'">
                <a-button type="primary" shape="circle" :style="{ marginRight: '10px' }" @click="showEditPanel(index)">
                    <EditOutlined />
                </a-button>
                <a-button type="primary" danger shape="circle" @click="deleteStudent(index)">
                    <DeleteOutlined />
                </a-button>
            </template>
        </template>
    </a-table>

    <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :page-size-options="pageSizeOptions"
        :total="total" show-size-changer @Change="selectAsPage" class="page" :show-total="total => `共 ${total} 条`">
        <template #buildOptionText="props">
            <span>{{ props.value }}条/页</span>
        </template>
    </a-pagination>

    <a-modal v-model:open="openEditModal" title="修改学生信息" @ok="editStudent()" @cancel="onCancelEdit()">
        <a-form :model="editFormData" :rules="rules_edit" ref="formRef">
            <a-form-item label="学号" name="id" has-feedback><a-input v-model:value="editFormData.id" /></a-form-item>
            <a-form-item label="姓名" name="username" has-feedback><a-input
                    v-model:value="editFormData.username" /></a-form-item>
            <a-form-item label="年龄" name="age" has-feedback><a-input v-model:value="editFormData.age" /></a-form-item>
            <a-form-item label="性别" name="sex" has-feedback>
                <a-radio-group v-model:value="editFormData.sex">
                    <a-radio value="男">男</a-radio>
                    <a-radio value="女">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="班级" name="className" has-feedback>
                <a-select v-model:value="editFormData.className">
                    <a-select-option value="22软件0031">22软件0031</a-select-option>
                    <a-select-option value="22软件0032">22软件0032</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>

import { h } from 'vue'
import { Empty, message, Modal } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import axios from 'axios'


export default {
    components: {
        Empty,
        DeleteOutlined,
        EditOutlined
    },
    // 声明emits
    emits: ['dataSource'],
    data() {
        return {
            formRef: {},
            tableLoading: false,
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            openEditModal: false,
            tempEditFormData: [],
            editFormData: [],
            dataSource: [],
            columns: [
                {
                    title: '学号',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '姓名',
                    dataIndex: 'username',
                    key: 'name',
                },
                {
                    title: '年龄',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    key: 'sex',
                },
                {
                    title: '班级',
                    dataIndex: 'className',
                    key: 'className',
                },
                {
                    title: '',
                    key: 'action'
                },
            ],

            rules_edit: {
                id: [
                    {
                        required: true,
                        message: '请输入学号',
                        trigger: 'change'
                    },
                    {
                        pattern: /^\d{10}$/, // 确保输入为6到10位的数字
                        message: '学号需为10位数字',
                        trigger: 'change',
                    }
                ],
                username: [
                    {
                        required: true,
                        message: '请输入姓名',
                        trigger: 'change'
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
                        trigger: 'change',
                    }
                ],
                age: [
                    {
                        required: true,
                        message: '请输入年龄',
                        trigger: 'change'
                    },
                    {
                        pattern: /^(?:[1-9][0-9]?|100)$/,
                        message: '年龄输入有误',
                        trigger: 'change',
                    }
                ],
                className: [
                    {
                        required: true,
                        message: '请输入班级',
                        trigger: 'change'
                    }
                ]
            },

            currentPage: 1,
            pageSize: 5,
            pageSizeOptions: ['5', '10', '15', '20'],
            total: 0,
            stuId: ''
        };
    },
    methods: {

        showEditPanel(index) {
            this.openEditModal = true
            // 这里直接将dataSource的引用赋值给了editFormData 所以在修改editFormData时dataSource也会发生该改变
            // this.editFormData = this.dataSource[index]

            // 使用JSON序列化和反序列化创建一个深拷贝即可解决该问题
            this.editFormData = JSON.parse(JSON.stringify(this.dataSource[index]))
            // this.tempEditFormData = this.dataSource[index]
        },

        onCancelEdit() {

        },

        editStudent() {
            const oldId = this.editFormData.id
            // 校验表单
            this.$refs.formRef.validate().then(() => {
                axios.put('http://localhost:9090?oldId=' + oldId, this.editFormData)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.openEditModal = false
                            this.selectAsPage()
                            message.success(response.data.data)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        message.error('服务异常')
                    })
            })
                .catch(error => {
                    message.error('修改失败!')
                    console.log(error)
                })
        },

        deleteStudent(index) {
            const id = this.dataSource[index].id
            Modal.confirm({
                title: '删除学生',
                icon: h(ExclamationCircleOutlined),
                content: '您确定要删除该学生吗?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                centered: true,
                onOk: () => {
                    axios.delete('http://localhost:9090/delete?id=' + id)
                        .then(response => {
                            if (response.data.code === 0) {
                                message.success(response.data.data)
                                this.selectAsPage()
                            }
                            else {
                                message.success(response.data.data)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            message.error('服务异常')
                        })
                },
                onCancel: () => {

                },
            })
        },

        // getStudentInfo() {
        //     axios.get('http://localhost:9090/get')
        //         .then(response => {
        //             if (response.data.code === 0) {
        //                 this.dataSource = response.data.data
        //             }

        //         })
        //         .catch(error => {
        //             console.log(error)
        //             message.error('服务异常')
        //         })
        // },

        // 分页查询
        selectAsPage() {
            this.getTotal()
            axios.get('http://localhost:9090/select_with_page?pageNo=' + this.currentPage + '&pageSize=' + this.pageSize)
                .then(response => {
                    this.dataSource = response.data.data
                })
                .catch(error => {
                    console.log(error)
                })
        },

        //获取总记录数
        getTotal() {
            axios.get('http://localhost:9090/getTotal')
                .then(response => {
                    this.total = response.data.data
                })
                .catch(error => {
                    console.log(error)
                })
        },

        // 条件查询
        select(){
            axios.get('http://localhost:9090/select?id=' + this.stuId)
                .then(response => {
                    if(response.data.code === 0){
                        this.dataSource = response.data.data
                    }
                    else{
                        message.error(response.data.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

    },

    mounted() {
        // 使用派生事件向父组件传递数据
        this.$emit('dataSource', this.dataSource)
        // this.getStudentInfo()
        this.selectAsPage()
    },

    created() {
        this.tableLoading = true
        setTimeout(() => {
            this.tableLoading = false
        }, 500)
    }
}
</script>
<style>
.page {
    padding-top: 20px;
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>