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
                            <!--
                            <el-input v-model="patientId"></el-input>
                            <el-input v-model="patientInfoStr"></el-input>
                            -->
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

                <el-aside style="padding-left: 20px">
                    <span class="area-header-text">药品选择</span>
                    <el-divider></el-divider>
                </el-aside>

                <el-main style="padding-top: 0">
                    <span class="area-header-text">处方内容</span>
                    <el-divider></el-divider>
                </el-main>

            </el-container>

            <el-footer>Footer</el-footer>
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
                patientInfoStr: null
            }
        },
        watch: {
            async patientId() {
                await this.queryPatientInfoById();
                console.log("patient id changed");
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
            }
        },
        mounted() {
            this.init();
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