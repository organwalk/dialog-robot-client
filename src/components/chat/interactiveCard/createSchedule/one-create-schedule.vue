<template>
    <div v-show="props.showPageOne" style="width: 100%">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-input
                        v-model="title"
                        placeholder="请输入日程标题"
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
                                        :default-value="nowTime"
                                        placeholder="开始时间"
                                        :disabled-date="disabledDate"
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
                                        ref="endDateRef"
                                        placeholder="结束时间"
                                        :disabled-date="disabledDate"
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
import {defineEmits, ref, defineProps, computed, watchEffect, onMounted} from "vue";
import * as data from '@/api/server/data'
import {getNowTime, getUnixConversion, getUnixOnNewDateAndProcess} from "@/optionConfig/time-process-utils";

const props = defineProps({
    showPageOne: Boolean,
    sid:String
})

const nowTime = ref()
const startTime = ref('')
const notice = ref(true)
const endTime = ref('')
const title = ref('')

const emit = defineEmits(["getPageOneData","getPageOneDataStatus"])

watchEffect(() => {
    if (!startTime.value || !endTime.value || !title.value) {
        emit('getPageOneData', "", "", "", "")
    } else {
        emit('getPageOneData', title.value, startTime.value, endTime.value, notice.value)
    }
})

const disabledDate = (time)=> {
    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}
const sid = computed(()=>props.sid)
onMounted(() => {
    nowTime.value = getNowTime("yyyy-mm-dd hh:mm")
    startTime.value = getUnixOnNewDateAndProcess("yyyy-mm-dd hh:mm start",new Date(getNowTime("yyyy-mm-dd hh:mm")))
    endTime.value = getUnixOnNewDateAndProcess("yyyy-mm-dd hh:mm end",new Date(getNowTime("yyyy-mm-dd hh:mm")))
    if (sid.value){
        data.getScheduleBySid(sid.value).then(res=>{
            const obj = res.data.scheduleData[0]
            nowTime.value = getUnixConversion(obj.begintime)
            startTime.value = getUnixConversion(obj.begintime)
            endTime.value = getUnixConversion(obj.endtime)
            title.value = obj.content
            notice.value = Boolean(obj.iswarn)
            emit('getPageOneDataStatus',true)
        })
    }
})




</script>

<style scoped>

</style>