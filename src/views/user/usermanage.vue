<template>

    <div>
        <Table :data="tableData" :columns="tableColumns1" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="count" :current="1" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data () {
            return {
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
                            return h('div',  params.row.roleObj.role );
                        }
                    },
                    {
                        title: '是否是管理员',
                        key: 'isAdmin',
                        render: (h, params) => {
                            return h('div',  params.row.isAdmin?'是':'否' );
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
                                            this.edit(params.index)
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
                                            this.remove(params.index)
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
                var form=`
                
                `;
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            }
        },
        computed: {},
        created () {
            this.update();
        },
        watch: {
            page () {
                this.update();
            }
        }
    };
</script>
