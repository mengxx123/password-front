<template>
    <my-page title="用户密码">
        <ui-text-field v-model="key" hintText="请输入密钥" />
        <ui-article>
            <table>
                <tr>
                    <th class="column-title">标题</th>
                    <th class="column-account">账号</th>
                    <th class="column-password">密码</th>
                    <th class="column-note">备注</th>
                </tr>
                <tr v-for="account in accounts">
                    <td>{{ account.title }}</td>
                    <td>{{ account.account }}</td>
                    <td class="password-box">
                        <div class="password">{{ key ? decrypt(account.password) : '请输入密钥'}}</div>
                    </td>
                    <td>{{ account.note }}</td>
                </tr>
            </table>
        </ui-article>
    </my-page>
</template>

<script>
    const CryptoJS = window.CryptoJS

    export default {
        data () {
            return {
                key: '',
                accounts: []
            }
        },
        mounted() {
            this.init()
        },
        filters: {
        },
        methods: {
            init() {
                let userId = this.$route.params.id
                this.$http.get(`/users/${userId}/accounts`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.accounts = data
                    },
                    response => {
                        console.log(response)
                    })
            },
            decrypt(text) {
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
</style>
