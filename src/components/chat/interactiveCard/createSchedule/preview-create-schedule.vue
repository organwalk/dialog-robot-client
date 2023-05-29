<template>
<el-card shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <el-tooltip :content=strEndTime placement="top">
                <span style="color: #B5B8C0;font-weight: bolder;user-select: none" v-html="strStartTime"/>
            </el-tooltip>
        </el-col>
    </el-row><br/>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
            <el-card shadow="never" style="border:none;border-radius: 15px;">
                <span style="font-weight: bolder;font-size: 25px;">Working morning</span><br/><br/>
                <span style="font-size: 15px;"><el-icon size="small"><Location /></el-icon>&nbsp;P.C Street</span><br/><br/>
                <span style="font-size: 10px;">This is a content about schedule,This is a content about schedule,This is a content about schedule,</span><br/><br/>
                <el-collapse >
                    <el-collapse-item title="Members" name="1">
                        <span v-html="members"/>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-col>
    </el-row>
</el-card><br/>
</template>

<script setup>
import { Location } from '@element-plus/icons-vue'
import {ref} from "vue";

const startTime = ref('2023-05-04 10:30')
const strStartTime = ref(startTime.value.split(' ')[0] + ',' + startTime.value.split(' ')[1])
const endTime = ref('2023-05-05 10:30')
const strEndTime = ref("截止日期: " + endTime.value.split(' ')[0] + ',' + endTime.value.split(' ')[1])
const members = ref(["John","Amy","Mike"])
</script>

<style scoped>
/deep/ .el-collapse {
    --el-collapse-border-color:none;
    --el-collapse-header-height: 30px;
}
</style>