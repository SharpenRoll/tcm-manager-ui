<template>
    <section>

        <el-container>
            <el-header style="height: 20%">
                <span class="area-header-text">患者信息</span>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="4">
                        <el-button icon="el-icon-files" type="warning"
                                   @click="patientInfoSelectDialogOn = true"
                                   style="float: left">
                            选择/添加患者信息
                        </el-button>

                        <el-dialog :visible.sync="patientInfoSelectDialogOn" title="选择/添加患者信息">

                        </el-dialog>
                    </el-col>
                    <el-col :span="20">
                        <el-form :model="patientInfo" inline
                                 style="float: left">
                            <el-form-item class="patient-info-form-item" label="编号：">
                                <span class="patient-info-content">{{ patientInfo.id }}</span>
                            </el-form-item>
                            <el-form-item class="patient-info-form-item" label="姓名：">
                                <span class="patient-info-content">{{ patientInfo.name }}</span>
                            </el-form-item>
                            <el-form-item class="patient-info-form-item" label="性别：">
                                <span class="patient-info-content">{{ patientInfo.gender === 0 ? '男' : '女' }}</span>
                            </el-form-item>
                            <el-form-item class="patient-info-form-item" label="年龄：">
                                <span class="patient-info-content">{{ patientInfo.age }}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-header>

            <el-container>

                <el-aside style="padding-left: 20px; width: 35%">
                    <span class="area-header-text">药品选择</span>
                    <el-divider></el-divider>

                    <el-input v-model="queryDrugName" placeholder="根据药品名称查找" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="findDrugInfoByName"></el-button>
                    </el-input>
                    <br><br>

                    <el-table :data="drugInfo" :height="tableHeight">
                        <el-table-column label="编号" prop="id"></el-table-column>
                        <el-table-column label="药品名" prop="name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-popover placement="right" @show="selectedDrugAmount = 0">
                                    <el-input-number v-model="selectedDrugAmount" placeholder="添加数量"></el-input-number>
                                    <el-button type="primary" @click="addDrug(scope.row)">确定</el-button>
                                    <el-button slot="reference">添加</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-aside>

                <el-main style="padding-top: 0">
                    <span class="area-header-text">处方内容</span>
                    <el-divider></el-divider>

                    <div v-if="selectedDrugInfo.length > 0">
                        <div v-for="(singleDrugInfo, index) in selectedDrugInfo" v-bind:key="index">
                            <el-card>
                                {{singleDrugInfo}}
                            </el-card>
                        </div>
                    </div>

                    <div v-else style="font-size:x-large; font-weight:bold; display:flex; height: 80%">
                        <span style="margin:auto">点击左侧查询结果添加药品</span>
                    </div>
                </el-main>

            </el-container>

            <el-footer style="height: 5%">
                <div style="float: right">
                    <el-button>保存</el-button>
                    <el-button>保存并导出</el-button>
                    <el-button>保存为模版</el-button>
                </div>
            </el-footer>

        </el-container>

    </section>
</template>

<script>
    import * as API from "@/api";

    export default {
        name: "Prescription",
        data() {
            return {
                patientId: null,
                patientInfo: null,
                patientInfoSelectDialogOn: false,
                prescriptionId: null,
                prescriptionInfo: null,
                patientInfoStr: null,
                queryDrugName: '',
                drugInfo: [],
                tableHeight: window.innerHeight * 0.37,
                selectedDrugInfo: [],
                selectedDrugAmount: null
            }
        },
        watch: {
            async patientId() {
                await this.queryPatientInfoById();
                this.patientInfoStr = JSON.stringify(this.patientInfo);
            }
        },
        methods: {
            init() {
                this.prescriptionId = this.$route.query.prescriptionId
                    ? this.$route.query.prescriptionId
                    : null;
                this.patientId = this.$route.query.patientId
                    ? this.$route.query.patientId
                    : this.prescriptionInfo.patientId;
            },
            async queryPatientInfoById() {
                await API.queryPatientInfoById({patientInfoId: this.patientId}).then(res => {
                    this.patientInfo = res.data;
                    this.getAge();
                }).catch(err => {
                    this.$message.error('获取患者信息失败：' + JSON.stringify(err));
                })
            },
            getAge() {
                let birthdays = new Date(this.patientInfo.birth.replace(/-/g, "/"));
                let d = new Date();
                this.patientInfo.age = d.getFullYear() -
                    birthdays.getFullYear() -
                    (d.getMonth() < birthdays.getMonth() ||
                    (d.getMonth() === birthdays.getMonth() &&
                        d.getDate() < birthdays.getDate())
                        ? 1
                        : 0);
            },
            async findDrugInfoByName() {
                await API.queryDrugInfoByName({drugName: this.queryDrugName}).then(res => {
                    this.drugInfo = res.data;
                }).catch(err => {
                    this.$message.error('获取药品信息失败：' + JSON.stringify(err));
                })
            },
            addDrug(row) {
                row.amount = this.selectedDrugAmount;
                this.selectedDrugInfo.push(row);
            }
        },
        mounted() {
            this.init();
            window.onresize = () => {
                return (() => {
                    this.tableHeight = window.innerHeight * 0.37;
                })()
            };
        }
    }
</script>

<style type="text/css">
    /* 将el-container设置为充满全屏 */
    html, body, section, #app {
        padding: 0px;
        margin: 0px;
        height: 100%;
    }

    .area-header-text {
        float: left;
    }

    .patient-info-form-item {
        margin-bottom: 0;
        margin-left: 80px;
    }

    .patient-info-form-item .el-form-item__label {
        font-size: 18px;
    }

    .patient-info-content {
        font-size: 18px;
    }
</style>