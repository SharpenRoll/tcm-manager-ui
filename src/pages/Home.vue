<template>
    <el-container>

        <!-- 顶部 -->
        <el-header style="font-size:x-large; font-weight:bold; background:#50616d; display:flex">
            <span style="color:white; margin:auto" @click="jump('/')">TCM-Manager</span>
        </el-header>

        <el-container>
            <!-- 侧边导航栏 -->
            <el-aside :width="'200px'" style="background-color: #425066" background-color="#425066">
                <br>
                <el-button icon="el-icon-circle-plus-outline" @click="jump('/biz/prescription')"
                           type="success" style="font-size:medium">新建处方单</el-button>
                <el-menu menu-trigger="hover" width="100%"
                         background-color="#425066"
                         text-color="#fff"
                         active-text-color="#f2be45"
                         style="min-height:100%;text-align: left"
                         :default-openeds="allMenu">
                    <template v-for="(item, index) in $router.options.routes">
                        <el-menu-item :index="item.path" :key="index" v-if="item.isLeaf && !item.hidden">
                            <span slot="title" style="font-size:large">{{ item.name }}</span>
                        </el-menu-item>
                        <el-submenu :index="item.path" :key="index + '-s'" v-else-if="!item.hidden"
                                    @click="jump(item.path)">
                            <template slot="title">
                                <span slot="title" style="font-size:large">{{ item.name }}</span>
                            </template>
                            <template v-for="(childItem, childIndex) in item.children">
                                <el-menu-item :index="childItem.path" :key="childIndex + '-c'"
                                              v-if="!childItem.hidden"
                                              @click="jump(childItem.path)">
                                    <span slot="title" style="font-size:larger">{{ childItem.name }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>

            <el-main style="background-color: #e9f1f6">
                <router-view/>
            </el-main>

        </el-container>

        <el-footer style="background-color: #50616d">
            <span style="color:white;font-size: small">
                TCM-Manager 中医综合管理系统 由胥畔若独立开发<br>
                使用中若有问题，请联系：155 0125 5123
            </span>
        </el-footer>

    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                router: [],
                allMenu: []
            }
        },
        methods: {
            init() {
                this.router = this.$router.options.routes;
                this.allMenu = Array.from(
                    {length: this.$router.options.routes.length},
                    (x, i) => this.$router.options.routes[i].path);
            },
            jump(next) {
                this.$router.push(next);
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style type="text/css">
    /* 将el-container设置为充满全屏 */
    html, body, #app, .el-container {
        padding: 0px;
        margin: 0px;
        height: 100%;
    }
</style>