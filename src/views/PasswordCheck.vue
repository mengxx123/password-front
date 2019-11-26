<template>
    <my-page title="密码强度检测" :page="page">
        <div class="common-container container">
            <textarea class="form-control" v-model="code" rows="6" placeholder="文本"></textarea>
            <div class="btns">
                <ui-raised-button class="btn" primary label="检测" @click="calculate" />
            </div>
            <div v-if="result">
                <div v-if="result === 4">安全不错</div>
                <div v-if="result === 3">安全系数还可以</div>
                <div v-if="result < 3">不安全</div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    function checkStrong(sValue) {
        var modes = 0;
        //正则表达式验证符合要求的
        if (sValue.length < 1)
            return modes;
        if (/\d/.test(sValue))
            modes++; //数字
        if (/[a-z]/.test(sValue))
            modes++; //小写
        if (/[A-Z]/.test(sValue))
            modes++; //大写  
        if (/\W/.test(sValue))
            modes++; //特殊字符

        //逻辑处理
        switch (modes) {
            case 1:
                return 1;
                break;
            case 2:
                return 2;
            case 3:
            case 4:
                return sValue.length < 12 ? 3 : 4
                break;
        }
    }

    console.log(checkStrong('1212'))

    export default {
        data () {
            return {
                code: '',
                result: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/15a458905aea11e982887f5221e49d12',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
            },
            calculate() {
                if (!this.code) {
                    alert('请输入文本')
                    return
                }
                this.result = checkStrong(this.code)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }
textarea.form-control {
    height: auto;
}
.form-control {
    display: block;
    width: 100%;
    max-width: 400px;
    height: 33px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42;
    color: #55595c;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
}
.charset {
    margin-top: 16px;
}
.btns {
    margin-top: 16px;
    margin-bottom: 16px;
    .btn {
        margin-right: 8px;
    }
}
</style>
