<template>
    <my-page title="用户密码" :page="page">
        <div class="mask" v-if="maskVisible">
            <div class="mark-content">
                <ui-text-field v-model="key" type="password" hintText="请输入密钥" />
                <button @click="save">进入</button>
            </div>
        </div>
        
        <!-- <button @click="clearKey">清除秘钥</button>
        <br> -->
        <input v-model="keyword" placeholder="搜索过滤" />
        <button @click="clearKeyword">清除</button>
        
        <ul class="account-list">
            <li class="item" v-for="account, index in filterAccounts">
                <div class="title">
                    <router-link :to="`/accounts/${account.id}`">{{ account.title }}</router-link>
                </div>
                <div>账号：{{ account.account }}</div>
                <div>加密类型：{{ account.type || '-'}} </div>
                <div class="password-box">
                    密码：
                    <div class="password2" v-if="account.type === ''">{{ account.password }}</div>
                    <div class="password2" v-if="account.type !== ''">{{ key ? decrypt(account.password) : '请输入密钥'}}</div>
                </div>
                <div>
                    备注：
                    {{ account.note }}</div>
                <div>
                    网址：
                    <a :href="account.url" target="_blank">{{ account.url }}</a>
                </div>
                <div>
                    <!-- <router-link :to="`/accounts/${account.id}/edit`">编辑</router-link> -->
                    <button @click="remove(account, index)">删除</button>
                </div>
            </li>
        </ul>
    </my-page>
</template>

<script>
    const CryptoJS = window.CryptoJS

    export default {
        data () {
            return {
                key: '',
                keyword: '',
                accounts: [],
                maskVisible: true,
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'search',
                        //     click: this.search,
                        //     title: '搜索'
                        // },
                        {
                            type: 'icon',
                            icon: 'lock',
                            click: this.lock,
                            title: '锁定'
                        },
                        {
                            type: 'icon',
                            icon: 'refresh',
                            click: this.refresh,
                            title: '刷新'
                        },
                        {
                            type: 'icon',
                            icon: 'add',
                            click: this.add,
                            title: '应用'
                        }
                    ]
                }
            }
        },
        computed: {
            filterAccounts() {
                if (this.keyword) {
                    return this.accounts.filter(item => {
                        return item.title.includes(this.keyword) || item.account.includes(this.keyword) ||
                            item.note.includes(this.keyword) || item.tags.includes(this.keyword)
                    })
                }
                return this.accounts
            }
        },
        mounted() {
            this.init()
        },
        filters: {
        },
        methods: {
            init() {
                this.key = this.$storage.get('key', '')
                console.log('this.key', this.key)
                this.maskVisible = !this.key
                // if (this.key) {
                //     this
                // }
                this.loadData()
            },
            loadData() {
                // this.userId = this.$route.params.id
                this.$http.get(`/password/users/${this.$store.state.user.id}/accounts`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.accounts = data
                    },
                    response => {
                        console.log(response)
                    })
            },
            add() {
                this.$router.push('/add')
            },
            refresh() {
                this.loadData()
            },
            decrypt(text) {
                return CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8)
            },
            save() {
                if (!this.key) {
                    this.$message({
                        type: 'danger',
                        text: '功能暂未实现'
                    })
                    return
                }
                this.$storage.set('key', this.key)
                this.maskVisible = false
            },
            lock() {
                this.clearKey()
                this.maskVisible = true
            },
            clearKey() {
                this.key = ''
                this.$storage.set('key', '')
            },
            clearKeyword() {
                this.keyword = ''
            },
            search() {
                this.$message({
                    type: 'danger',
                    text: '功能暂未实现'
                })
            },
            remove(item, index) {
                let ret = confirm(`删除${item.title}?`)
                if (!ret) {
                    return
                }
                this.$http.delete(`/password/accounts/${item.id}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.loadData()
                    },
                    response => {
                        console.log(response)
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
.mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000000;
    background-color: #fff;
    .mark-content {
        width: 100px;
        height: 100px;
    }
}
.account-list {
    .item {
        margin-bottom: 16px;
        padding: 16px;
        // border: 1px solid #000;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    }
    .title {
        margin-bottom: 8px;
        font-size: 24px;
    }
}
.column-title {
    width: 240px;
}
.column-account {
    width: 240px;
}
.column-password {
    width: 240px;
}
.password-box {
    &:hover {
        .password {
            display: block;
        }
    }
    .password {
        display: none;
    }
}
</style>
