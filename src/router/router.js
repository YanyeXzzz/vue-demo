import { createRouter, createWebHistory } from 'vue-router';

import AntDemoVue from '@/components/AntDemo.vue'
import MainVue from '@/components/Main.vue'
import StudentInfoVue from '@/components/StudentInfo.vue'
import LoginVue from '@/components/Login.vue'


const routes = [
    { 
        path: '/demo',component: AntDemoVue,
    },
    {
        path: '/main',component: MainVue,
        children: [
            { path: 'stuinfo', component: StudentInfoVue }
        ]
    },
    {
        path: '/',component: LoginVue
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router