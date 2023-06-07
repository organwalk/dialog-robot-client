<template>
    <div v-show="props.showPageOne" style="width: 100%">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-input
                        v-model="title"
                        placeholder="Please input a title about schedule "
                        :prefix-icon="Check"
                        maxlength="15"
                        show-word-limit
                />
            </el-col>
        </el-row>
        <br/><br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
                    <span style="font-weight: bolder">请选择日程的基本配置项</span><br/><br/>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <el-date-picker
                                        v-model="startTime"
                                        type="datetime"
                                        format="YYYY-MM-DD HH:mm"
                                        value-format="YYYY-MM-DD HH:mm"
                                        placeholder="开始时间"
                                        style="width: 100%"
                                />
                            </el-card>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <el-date-picker
                                        v-model="endTime"
                                        type="datetime"
                                        format="YYYY-MM-DD HH:mm"
                                        value-format="YYYY-MM-DD HH:mm"
                                        placeholder="结束时间"
                                        style="width: 100%"
                                />
                            </el-card>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <span>是否提醒</span><br/><br/>
                                <el-switch
                                        v-model="notice"
                                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                /><br/>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <br/>
    </div>
</template>

<script setup>
import {Check} from "@element-plus/icons-vue";
import {defineEmits, ref, watch, defineProps, computed} from "vue";
import {ElMessage} from "element-plus";
import * as data from '@/api/server/data'

const props = defineProps({
    showPageOne: Boolean,
    sid:String
})

const startTime = ref('')
const notice = ref(true)
const endTime = ref('')
const title = ref('')

const emit = defineEmits(["getPageOneData"])

const sendPageOneData = () => {
    const startDate = new Date(startTime.value).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })
    if (startTime.value){
        if (endTime.value){
            const endDate = new Date(endTime.value).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })
            // 如果输入的日期等于今天的日期
            if (startDate === endDate ){
                emit('getPageOneData', title.value, startTime.value, endTime.value, notice.value);
            }else {
                ElMessage.error('日程仅限定在今日范围');
                endTime.value = '';
            }
        }
    }
}

watch([startTime, endTime], (newStart,newEnd) => {
    if (newStart[0]!=='' && newEnd[0] !== ''){
        sendPageOneData()
    }
});

const sid = computed(()=>props.sid)
if (sid.value){
    data.getScheduleBySid(sid.value).then(res=>{
        const obj = res.data.scheduleData[0]
        title.value = obj.content
        notice.value = Boolean(obj.iswarn)
    })
}
</script>

<style scoped>

</style>