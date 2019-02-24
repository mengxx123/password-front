import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Tool = resolve => require(['@/views/Tool'], resolve)
const Tool2 = resolve => require(['@/views/Tool2'], resolve)
const UserDetail = resolve => require(['@/views/UserDetail'], resolve)
const AccountDetail = resolve => require(['@/views/AccountDetail'], resolve)
const AccountEdit = resolve => require(['@/views/AccountEdit'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/tool',
        component: Tool
    },
    {
        path: '/password/generator',
        component: Tool2
    },
    {
        path: '/users/:id',
        component: UserDetail
    },
    {
        path: '/add',
        component: AccountEdit
    },
    {
        path: '/accounts/:id',
        component: AccountDetail
    },
    {
        path: '/accounts/:id/edit',
        component: AccountEdit
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
