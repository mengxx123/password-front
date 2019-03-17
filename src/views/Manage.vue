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
        <input v-model="keyword" placeholder="标题/网址/备注搜索" />
        <button @click="search">搜索</button>
        <button @click="clearKeyword">清除</button>
        
        <ul class="account-list">
            <li class="item" v-for="account, index in filterAccounts">
                <div class="title">
                    <router-link :to="`/accounts/${account.id}`">{{ account.title || '无标题' }}</router-link>
                </div>
                <div>
                    账号：{{ account.account }}
                    <a class="item-btn btn-copy" href="javascript:;" :data-clipboard-text="account.account">复制</a>
                </div>
                <!-- <div>加密类型：{{ account.type || '-'}} </div> -->
                <div class="password-box">
                    密码：******
                    <!-- <div class="password2" v-if="account.type === ''">{{ account.password }}</div> -->
                    <!-- <div class="password2" v-if="account.type !== ''">{{ key ? decrypt(account.password) : '请输入密钥'}}</div> -->
                    <a class="item-btn btn-copy" href="javascript:;" :data-clipboard-text="decrypt(account.password)">复制</a>
                </div>
            </li>
        </ul>
        <div>最多展示20条</div>
    </my-page>
</template>

<script>
    const CryptoJS = window.CryptoJS
    const Clipboard = window.Clipboard

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
                return this.accounts
                // if (this.keyword) {
                //     return this.accounts.filter(item => {
                //         return item.title.includes(this.keyword) || item.account.includes(this.keyword) ||
                //             item.note.includes(this.keyword) || item.tags.includes(this.keyword)
                //     })
                // }
                // return this.accounts
            }
        },
        mounted() {
            let { host } = this.$route.query
            if (host) {
                this.$router.push(`/manage?keyword=${encodeURIComponent(host)}`)
                return
            }

            this.init()

            this.clipboard = new Clipboard('.btn-copy')
            this.clipboard.on('success', e => {
                console.info('Action:', e.action)
                console.info('Text:', e.text)
                console.info('Trigger:', e.trigger)
                e.clearSelection()
                this.$message({
                    type: 'success',
                    text: '已复制'
                })
            })
            this.clipboard.on('error', function (e) {
                console.error('Action:', e.action)
                console.error('Trigger:', e.trigger)
            })
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
                let { keyword } = this.$route.query
                // this.userId = this.$route.params.id
                this.keyword = keyword
                this.$http.get(`/password/users/${this.$store.state.user.id}/accounts?keyword=${keyword ? encodeURIComponent(keyword) : ''}`).then(
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
                this.$router.push('/manage')
            },
            search() {
                if (!this.keyword) {
                    this.$message({
                        type: 'danger',
                        text: '请输入关键词'
                    })
                    return
                }
                this.$router.push(`/manage?keyword=${encodeURIComponent(this.keyword)}`)
            },
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
    .btn-copy {
        color: #f00;
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
