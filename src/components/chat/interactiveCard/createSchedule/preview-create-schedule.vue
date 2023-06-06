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
                <span style="font-weight: bolder;font-size: 25px;">{{ strTitle }}</span><br/><br/>
                <span style="font-size: 15px;"><el-icon size="small"><Location /></el-icon>&nbsp;{{ strLocation }}</span><br/><br/>
                <span style="font-size: 10px;">{{ strScheduleDes }}</span><br/><br/>
                <el-collapse >
                    <el-collapse-item class="preview" title="Members" name="1">
                            <span v-for="(item,index) in strScheduleMembers[0]" :key="index" v-html="item.label + '&nbsp&nbsp' "/>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-col>
    </el-row>
</el-card><br/>
</template>

<script setup>
import { Location } from '@element-plus/icons-vue'
import {reactive, ref, defineProps, computed, watch} from "vue";
const props = defineProps({
    showPagePreview:Boolean,
    pageOneData:Object,
    pageTwoData:Object
})
const allPageData = reactive({
    pageOneData:props.pageOneData,
    pageTwoData:props.pageTwoData
})

const start = computed(()=>allPageData.pageOneData.startTime)
const end = computed(()=>allPageData.pageOneData.endTime)
const title = computed(()=>allPageData.pageOneData.title)
const location = computed(()=>allPageData.pageTwoData.location)
const scheduleDes = computed(()=> allPageData.pageTwoData.scheduleDes)
const scheduleMembers =  computed(()=>props.pageTwoData.scheduleMembers)
const strStartTime = ref('')
const strEndTime = ref('')
const strTitle = ref('')
const strLocation = ref('')
const strScheduleDes = ref('')
const strScheduleMembers = ref([])
watch(allPageData,(newVal)=>{
    if (newVal){
        strStartTime.value = (start.value.split(' ')[0] + ',' + start.value.split(' ')[1])
        strEndTime.value = ("截止日期: " + end.value.split(' ')[0] + ',' + end.value.split(' ')[1])
        strTitle.value = title.value
        strLocation.value = location.value
        strScheduleDes.value = scheduleDes.value
        strScheduleMembers.value = scheduleMembers.value
    }
})
</script>

<style scoped>
/deep/ .el-collapse {
    --el-collapse-border-color:none;
    --el-collapse-header-height: 30px;
}
/deep/ .preview .el-collapse-item__header {
    background-color: white;
}
</style>