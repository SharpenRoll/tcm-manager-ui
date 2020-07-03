<template>
    <section style="height: 100%">
        <el-row>
            <el-col :span="6">
                <el-input v-model="queryName" placeholder="根据名字查找" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="queryPatientInfoByName"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <br>
        <el-row style="height: 90%">
            <el-col :span="10">
                <el-table :data="patientInfo" :height="tableHeight"
                          highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="1">
                <br>
            </el-col>
            <el-col :span="13" style="height: 80%">
                <div v-if="currentPatientInfo">
                    <el-card>
                        <el-form label-width="100px" :model="currentPatientInfo" style="width: 90%">
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="编号">
                                        <el-input v-model="currentPatientInfo.id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="14">
                                    <el-form-item label="姓名">
                                        <el-input v-model="currentPatientInfo.name"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="性别">
                                        <el-radio-group v-model="mockGender">
                                            <el-radio :label="0">男</el-radio>
                                            <el-radio :label="1">女</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-card>
                </div>
                <div v-else style="font-size:x-large; font-weight:bold; display:flex; height: 100%">
                    <span style="margin:auto">点击左侧显示具体信息</span>
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
                mockGender: 0
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