<template>
    <section style="height: 100%">

        <!-- 根据名字查找病患信息的搜索栏 -->
        <el-row>
            <el-col :span="6">
                <el-input v-model="queryName" placeholder="根据名字查找" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="queryPatientInfoByName"></el-button>
                </el-input>
            </el-col>
        </el-row>

        <br>

        <el-row style="height: 90%">

            <!-- 屏幕左侧，展示病患略缩信息、可选中条目查看详细信息的表格 -->
            <el-col :span="6">
                <el-table :data="patientInfo" :height="tableHeight"
                          highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                </el-table>
            </el-col>

            <!-- 为了产生空隙需要放一个<br>，是否有更优雅的解决办法？ -->
            <el-col :span="1">
                <br>
            </el-col>

            <!-- 屏幕右侧，病患详细信息展示部分 -->
            <el-col :span="14" style="height: 80%">
                <div v-if="currentPatientInfo">
                    <el-card shadow="hover">
                        <div slot="header">
                            <span style="float: left">详细信息 （编号：{{ currentPatientInfo.id }}）</span>
                            <br>
                        </div>
                        <el-container>
                            <el-main>
                                <el-form label-width="100px" :model="currentPatientInfo" style="width: 90%">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="姓名">
                                                <el-input v-model="currentPatientInfo.name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="性别">
                                                <el-radio-group v-model="currentPatientInfo.gender">
                                                    <el-radio :label="0">男</el-radio>
                                                    <el-radio :label="1">女</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="出生日期">
                                                <el-date-picker v-model="currentPatientInfo.birth"
                                                                format="yyyy-MM-dd"
                                                                value-format="yyyy-MM-dd"
                                                                placeholder="请选择出生日期"
                                                                style="width: 175px; float: left">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="年龄">
                                                <el-input v-model="currentPatientInfo.age" disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="16">
                                            <el-form-item label="联系方式">
                                                <el-input v-model="currentPatientInfo.phone"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </el-main>
                            <el-footer>
                                <el-button @click="showPrescriptionHistory(currentPatientInfo.id)">查看历史处方单</el-button>
                                <el-button @click="jumpToNewPrescription(currentPatientInfo.id)">开具新处方单</el-button>
                            </el-footer>
                        </el-container>
                    </el-card>

                    <!-- 历史处方单弹出框 -->
                    <el-dialog :visible.sync="prescriptionHistoryDialogOn">

                    </el-dialog>

                </div>
                <div v-else style="font-size:x-large; font-weight:bold; display:flex; height: 100%">
                    <span style="margin:auto">点击左侧查询结果显示具体信息</span>
                </div>
            </el-col>
        </el-row>

    </section>
</template>

<script>

    import * as API from '@/api'

    export default {
        name: "PatientInfo",
        data() {
            return {
                tableHeight: window.innerHeight * 0.65,
                queryName: '',
                patientInfo: [],
                currentPatientInfo: null,
                mockGender: 0,
                prescriptionHistoryDialogOn: false
            }
        },
        watch: {
            'currentPatientInfo.birth': {
                handler: function () {
                    this.getAge();
                }
            }
        },
        methods: {
            async queryPatientInfoByName() {
                await API.queryPatientInfoByName({patientName: this.queryName}).then(res => {
                    this.patientInfo = res.data;
                }).catch(err => {
                    this.$message.error('获取患者信息失败：' + JSON.stringify(err));
                })
            },
            handleCurrentChange(currentRow) {
                this.queryPatientInfoById(currentRow.id);
            },
            async queryPatientInfoById(id) {
                await API.queryPatientInfoById({patientInfoId: id}).then(res => {
                    this.currentPatientInfo = res.data;
                }).catch(err => {
                    this.$message.error('获取患者信息失败：' + JSON.stringify(err));
                })
            },
            getAge() {
                let birthdays = new Date(this.currentPatientInfo.birth.replace(/-/g, "/"));
                let d = new Date();
                this.currentPatientInfo.age = d.getFullYear() -
                    birthdays.getFullYear() -
                    (d.getMonth() < birthdays.getMonth() ||
                    (d.getMonth() === birthdays.getMonth() &&
                        d.getDate() < birthdays.getDate())
                        ? 1
                        : 0);
            },
            showPrescriptionHistory(id) {
                console.log(id);
                this.prescriptionHistoryDialogOn = true;
            },
            jumpToNewPrescription(id) {
                this.$router.push({
                    path: '/biz/prescription',
                    query: {patientId: id}
                });
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.tableHeight = window.innerHeight * 0.65;
                })()
            }
        }
    }
</script>

<style scoped>

</style>