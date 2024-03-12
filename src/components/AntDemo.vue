<script>
    import { message } from 'ant-design-vue'
    export default{
        data(){
            return{

            }
        },
        methods: {
            show(){
                message.success('Hello Ant!!')
            }
        }
    }
</script>
<template>
    <p>Hello Ant</p>
    <a-button type="primary" @click="show">add</a-button>
</template>