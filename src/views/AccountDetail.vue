<template>
    <my-page title="账号详情" :page="page" backable>
        <div class="common-container container">
            <div v-if="account">
                <div class="title">
                    <router-link :to="`/accounts/${account.id}`">{{ account.title }}</router-link>
                </div>
                <div>
                    账号：{{ account.account || '无' }}
                    <a class="item-btn btn-copy" href="javascript:;" :data-clipboard-text="account.account" v-if="account.account">复制</a>
                </div>
                <div>加密类型：{{ account.type || '-'}} </div>
                <div class="password-box">
                    密码：******
                    <a class="item-btn btn-copy" href="javascript:;" :data-clipboard-text="account.password">复制</a>
                    <!-- {{ account.password }} -->
                    <!-- <span class="password2" v-if="account.type === ''">{{ account.password }}</span> -->
                    <!-- <span class="password2" v-if="account.type !== ''">{{ key ? decrypt(account.password) : '请输入密钥'}}</span> -->
                </div>
                <div>备注：{{ account.note }}</div>
                <div>
                    网址：
                    <a :href="account.url" target="_blank">{{ account.url }}</a>
                </div>
                <div>标签：{{ account.tags }}</div>
                <div>
                    <!-- <router-link :to="`/accounts/${account.id}/edit`">编辑</router-link> -->
                    <!-- <button @click="remove(account, index)">删除</button> -->
                </div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const CryptoJS = window.CryptoJS
    const Clipboard = window.Clipboard

    export default {
        data () {
            return {
                key: '',
                account: null,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'edit',
                            click: this.edit,
                            title: '编辑'
                        },
                        {
                            type: 'icon',
                            icon: 'delete',
                            click: this.remove,
                            title: '删除'
                        },
                    ]
                }
            }
        },
        mounted() {
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
                this.accountId = this.$route.params.id
                this.key = this.$storage.get('key', '')
                this.loadData()
            },
            loadData() {
                if (!this.accountId) {
                    return
                }
                this.$http.get(`/password/accounts/${this.accountId}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.account = data
                        if (this.account.type === '3DES') {
                            this.account.password = CryptoJS.TripleDES.decrypt(this.account.password, this.key).toString(CryptoJS.enc.Utf8)
                        }
                    },
                    response => {
                        console.log(response)
                    })
            },
            edit() {
                this.$router.push(`/accounts/${this.accountId}/edit`)
            },
            remove() {
                let ret = confirm(`删除${this.account.title}?`)
                if (!ret) {
                    return
                }
                this.$http.delete(`/password/accounts/${this.account.id}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.$router.go(-1)
                    },
                    response => {
                        console.log(response)
                    })
            },
            decrypt(text) {
                console.log('jiemi', text, this.key, CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8))
                return CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8)
            }
        }
    }
</script>

<style lang="scss" scoped>
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
.btn-copy {
        color: #f00;
    }
</style>
