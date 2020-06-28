import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../pages/Home'
import DrugInfo from "@/pages/DrugInfo";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/tcm',
    routes: [
        {
            path: '/',
            redirect: '/home',
            hidden: true
        },
        {
            path: '/home',
            component: Home,
            name: '首页',
            hidden: true
        },
        {
            path: '/drug',
            component: Home,
            name: '药品管理',
            children: [
                {
                    path: '/drug/info',
                    component: DrugInfo,
                    name: '查看药品信息'
                },
                {
                    path: '/drug/inventory_history',
                    name: '查询库存变化记录'
                }
            ]
        },
        {
            path: '/biz',
            component: Home,
            name: '医疗业务管理',
            children: [
                {
                    path: '/biz/patient',
                    name: '管理患者个人信息'
                },
                {
                    path: '/biz/case_history',
                    name: '管理病历档案'
                }
            ]
        }
    ]
});

export default router;