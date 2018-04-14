<template>
    <Form ref="formValidate"   :label-width="80">
        <FormItem label="用户名" prop="name">
            <Input v-model="userInfo.username" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mail">
            <Input v-model="userInfo.tel" placeholder="Enter your e-mail"></Input>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        name:'user-info',
        data () {
            return {

            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        props:['userInfo']
    }
</script>

