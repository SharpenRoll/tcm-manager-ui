<template>
    <section>

        <!-- 信息列表展示区域 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input v-model="filterName" placeholder="根据药品名称查找" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="filterTableInfo"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button icon="el-icon-circle-plus-outline" @click="editNewDrugInfo" type="success">新增药品信息</el-button>
            </el-col>
        </el-row>
        <br>
        <el-table :data="filteredDrugInfo" max-height="350" stripe>
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="药品名称" prop="name"></el-table-column>
            <el-table-column label="价格">
                <template slot-scope="scope">
                    <span v-if="scope.row.price">{{scope.row.price}}</span>
                    <span v-else style="color: red">null</span>
                    /
                    <span v-if="scope.row.unit">{{scope.row.unit}}</span>
                    <span v-else style="color: red">null</span>
                </template>
            </el-table-column>
            <el-table-column label="库存量">
                <template slot-scope="scope">
                    <span>{{scope.row.inventory}} </span>
                    <span v-if="scope.row.unit">{{scope.row.unit}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-edit" @click="editDrugInfo(scope.row)">编辑</el-button>
                    <el-button size="small" icon="el-icon-delete" @click="deleteDrugInfo(scope.row)" type="danger">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑药品信息弹出对话框 -->
        <el-dialog :visible.sync="onEdit" title="编辑药品信息" :before-close="handleClose">
            <el-form label-width="100px" :model="editDrugInfoForm" style="width: 90%">
                <el-form-item label="药品名称" required
                              :rules="[{required: true, message: '【药品名称】是必填项', trigger: 'blur'}]">
                    <el-input v-model="editDrugInfoForm.name" placeholder="请填写药品名称"></el-input>
                </el-form-item>
                <el-form-item label="单价" size="medium">
                    <el-col :span="8">
                        <el-input-number v-model="editDrugInfoForm.price" placeholder="请填写单价"
                                         :precision="2" :step="0.01">
                        </el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="计量单位">
                    <el-input v-model="editDrugInfoForm.unit" placeholder="请填写计量单位"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editDrugInfoForm.comment" placeholder="（可选）请填写备注"
                              type="textarea" :autosize="{ minRows: 3}">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="!editFormChanged" @click="saveDrugInfo">保 存</el-button>
            </span>
        </el-dialog>

    </section>
</template>

<script>
    import * as API from "@/api";

    export default {
        name: "DrugInfo",
        data() {
            return {
                drugInfo: [],
                filterName: '',
                filteredDrugInfo: [],
                onEdit: false,
                editFormChanged: false,
                editDrugInfoForm: {}
            }
        },
        watch: {
            editDrugInfoForm: {
                handler: function (nv, ov) {
                    if (JSON.stringify(ov) !== '{}') {
                        this.editFormChanged = true;
                    }
                },
                deep: true
            }
        },
        methods: {
            async getDrugInfo() {
                await API.listAllDrugInfo({}).then(res => {
                    this.drugInfo = res.data;
                    this.filteredDrugInfo = res.data;
                })
            },
            filterTableInfo() {
                if (this.filterName.length === 0) {
                    this.filteredDrugInfo = this.drugInfo;
                } else {
                    let tmpDrugInfo = this.drugInfo;
                    this.filteredDrugInfo = [];
                    for (let i in tmpDrugInfo) {
                        if (Object.prototype.hasOwnProperty.call(tmpDrugInfo, i) &&
                            tmpDrugInfo[i].name.indexOf(this.filterName) !== -1) {
                            this.filteredDrugInfo.push(tmpDrugInfo[i]);
                        }
                    }
                }
            },
            async saveDrugInfo() {
                await API.saveDrugInfo(this.editDrugInfoForm).then(res => {
                    if (res && res.data) {
                        this.$message.success('保存药品信息成功');
                        this.getDrugInfo();
                        this.editDrugInfoForm = {};
                        this.onEdit = false;
                    }
                }).catch(err => {
                    this.$message.error('保存药品信息失败：' + JSON.stringify(err));
                });
            },
            editNewDrugInfo() {
                this.editDrugInfo({});
            },
            editDrugInfo(singleDrugInfo) {
                this.editDrugInfoForm = JSON.parse(JSON.stringify(singleDrugInfo));
                /* 为了让未填写药品单价时编辑信息的数字输入框不设置为默认值0，从而
                   触发药品信息的更改判定，此处提前将null值转化为undefined */
                if (!this.editDrugInfoForm.price) {
                    this.editDrugInfoForm.price = undefined;
                }
                this.editFormChanged = false;
                this.onEdit = true;
            },
            async deleteDrugInfo(singleDrugInfo) {
                let confirmStr = '确认删除 ' + singleDrugInfo.name + ' 的药品信息？';
                this.$confirm(confirmStr, '提示', {type: 'warning'}).then(() => {
                    API.deleteDrugInfo({drugInfoId: singleDrugInfo.id}).then(() => {
                        this.$message.success('删除药品信息成功');
                        this.getDrugInfo();
                    }).catch(err => {
                        this.$message.error('删除药品信息失败：' + JSON.stringify(err));
                    })
                })

            },
            handleClose(done) {
                if (this.editFormChanged) {
                    this.$confirm('仍有未保存的修改，确认关闭？')
                        .then(() => {
                            this.editDrugInfoForm = {};
                            done();
                        });
                } else {
                    this.editDrugInfoForm = {};
                    done();
                }
            }
        },
        mounted() {
            this.getDrugInfo();
        }
    }
</script>

<style scoped>

</style>