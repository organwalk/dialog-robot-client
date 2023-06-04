<template>
<el-card v-show="props.showPagePreview" shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <el-tooltip :content=strEndTime placement="top">
                <span style="color: #B5B8C0;font-weight: bolder;user-select: none" v-html="strStartTime"/>
            </el-tooltip>
        </el-col>
    </el-row><br/>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
            <el-card shadow="never" style="border:none;border-radius: 15px;">
                <span style="font-weight: bolder;font-size: 25px;">{{ allPageData.pageOneData.title }}</span><br/><br/>
                <span style="font-size: 15px;"><el-icon size="small"><Location /></el-icon>&nbsp;{{ allPageData.pageTwoData.location }}</span><br/><br/>
                <span style="font-size: 10px;">{{ allPageData.pageTwoData.scheduleDes }}</span><br/><br/>
                <el-collapse >
                    <el-collapse-item title="Members" name="1">
                        <span v-html="allPageData.pageTwoData.scheduleMembers"/>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-col>
    </el-row>
</el-card><br/>
</template>

<script setup>
import { Location } from '@element-plus/icons-vue'
import {reactive, ref,defineProps} from "vue";
console.log(sessionStorage.getItem("userName"))
const props = defineProps({
    showPagePreview:Boolean,
    pageOneData:Object,
    pageTwoData:Object
})

const allPageData = reactive({
    pageOneData:props.pageOneData,
    pageTwoData:props.pageTwoData
})
const strStartTime = ref(allPageData.pageOneData.startTime.split(' ')[0] + ',' + allPageData.pageOneData.startTime.split(' ')[1])
const strEndTime = ref("截止日期: " + allPageData.pageOneData.endTime.split(' ')[0] + ',' + allPageData.pageOneData.endTime.split(' ')[1])

</script>

<style scoped>
/deep/ .el-collapse {
    --el-collapse-border-color:none;
    --el-collapse-header-height: 30px;
}
</style>