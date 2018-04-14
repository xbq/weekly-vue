<template>

    <div>

        <Table :data="tableData" :columns="tableColumns1" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="count" :current="1" @on-change="changePage" show-elevator show-sizer show-total></Page>
            </div>
        </div>
        <Modal v-model="modalUserinfo" width="400px" :mask-closable="false">
            <p slot="header" style="color:#2d8cf0;text-align:left;font-size: 16px;font-weight: 100;">
                <Icon type="person"></Icon>
                <span>用户信息</span>
            </p>
            <div style="text-align:center">
                <UserInfo :userInfo="user"></UserInfo>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="save">保存</Button>
                <Button type="primary" size="large"  @click="cancel">取消</Button>
            </div>
            <Child :parentMsg="propsTest"></Child>
        </Modal>

        {{propsTest}}
    </div>
</template>
<script>
    import UserInfo from './userInfo';
import Child from './child'
    export default {
        data () {
            return {
                propsTest:{a:1},
                modal_loading: false,
                user: {},
                modalUserinfo: false,
                limit: 10,
                page: 1,
                count: 0,
                tableData: [],
                tableColumns1: [
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '部门',
                        key: 'department',
                    },
                    {
                        title: '职位',
                        render: (h, params) => {
                            return h('div', params.row.roleObj.role);
                        }
                    },
                    {
                        title: '是否是管理员',
                        key: 'isAdmin',
                        render: (h, params) => {
                            return h('div', params.row.isAdmin ? '是' : '否');

                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index);

                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            changePage (page) {
                this.page = page;
            },
            update () {
                var url = this.server + '/user/list';
                this.$axios.get(url, {
                    params: {
                        limit: this.limit,
                        page: this.page
                    }
                }).then(res => {
                    this.tableData = res.data.data;
                    this.count = res.data.count;
                });
            },
            edit (index) {
                this.modalUserinfo = true;
                var selectUser= this.tableData[index];
                this.user = {
                    id:selectUser.id,
                    username:selectUser.username,
                    tel:selectUser.tel,
                    department:selectUser.department,
                    role:selectUser.role
                }
            },
            remove (index) {
                this.$Modal.confirm({
                    okText: '确定',
                    cancelText: '取消',
                    content: '确定要删除 ' + this.tableData[index].username + '用户',
                    onOk: () => {
                        var url = this.server + '/user/delete';
                        this.$axios.get(url, {
                            params: {
                                id: this.tableData[index].id
                            }
                        }).then(res => {
                            if (res.data.code == 0) {

                                this.$Message.success({
                                    content: '删除成功',
                                    onClose:()=>{
                                        this.modalUserinfo = false;
                                        this.update()
                                    }
                                });
                            } else {
                                this.$Modal.info({
                                    content: res.data.message
                                });
                            }
                        });
                    }
                });
            },
            save () {
                var url = this.server + '/user/update';
                this.$axios.post(url, this.user).then(res => {
                    if (res.data.code == 0) {

                        this.$Message.success({
                            content: '修改成功',
                            onClose:()=>{
                                this.modalUserinfo = false;
                                this.update()
                            }
                        });
                    } else {
                        this.$Modal.info({
                            content: res.data.message
                        });
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },
            cancel () {
                this.modalUserinfo = false;
            }
        },
        computed: {},
        components: {
            UserInfo,
            Child
        },
        created () {
            this.update();
            this.$Message.config({
                top: 100,
                duration: 2
            });
        },
        watch: {
            page () {
                this.update();
            },
            user(){
                console.log(this.user);
            }
        }
    };
</script>
