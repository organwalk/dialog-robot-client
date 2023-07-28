<template>
    <div v-show="props.showPageOne" style="width: 100%" v-loading="loading">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-input
                        v-model="notificationDes"
                        placeholder="请输入告知内容，如：请在上午十点参加小组会议 "
                        :prefix-icon="Check"
                        maxlength="80"
                        :rows="3"
                        type="textarea"
                        show-word-limit
                />
            </el-col>
        </el-row>
        <br/><br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
                    <span style="font-weight: bolder">请填写发布事项告知所需的必要信息</span><br/><br/>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <el-date-picker
                                        v-model="startTime"
                                        type="datetime"
                                        format="YYYY-MM-DD HH:mm"
                                        value-format="YYYY-MM-DD HH:mm"
                                        :default-value="nowTime"
                                        :disabled-date="disabledDate"
                                        placeholder="通知时间，日期范围不可小于今日"
                                        style="width: 100%"
                                />
                            </el-card>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <span>是否邮件提醒</span><br/><br/>
                                <el-switch
                                    v-model="notice"
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                />
                            </el-card>
                        </el-col>
                    </el-row><br/>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <span>选择通知人员</span><br/><br/>
                                <el-select style="width: 100%" v-model="scheduleMembers"
                                           placeholder="可同时选择多名人员"
                                           multiple
                                           filterable
                                           @change="handleChange">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
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
import {defineEmits, ref,  defineProps, onMounted, computed, watchEffect} from "vue";
import * as card from "@/api/cloud/card";
import * as data from "@/api/server/data"
import {getNowTime, getUnixConversion, getUnixOnNewDateAndProcess} from "@/optionConfig/time-process-utils";

const props = defineProps({
    showPageOne: Boolean,
    nid:String
})

const nowTime = ref()
const startTime = ref('')
const notice = ref(true)
const notificationDes = ref('')
const scheduleMembers = ref([])
const opUsers = ref([])
const notice_id = computed(()=>props.nid)
const loading = ref(true)

//  组件被挂载时远程获取人员列表
onMounted(()=>{
    card.getPersonList().then(res=>{
        if (res.data.code === 200){
            loading.value = false
            let users = res.data.data.userList
            opUsers.value = users
                .map(user => ({ value: user.userId, label: user.name }))
                .filter((user, index, arr) => (
                    arr.findIndex(u => u.value === user.value && u.label === user.label) === index
                ));
            options.value = opUsers.value
            nowTime.value = getNowTime("yyyy-mm-dd hh:mm")
            startTime.value = getUnixOnNewDateAndProcess("yyyy-mm-dd hh:mm start",new Date(getNowTime("yyyy-mm-dd hh:mm")))
            //  如果存在事项id则为修改事件，应该预先填充部分数据
            if (notice_id.value){
                loading.value = true
                data.getNotificationByNid(notice_id.value).then(res=>{
                    const obj = res.data.notificationData[0]
                    nowTime.value = getUnixConversion(obj.remind_time)
                    startTime.value = getUnixConversion(obj.remind_time)
                    notice.value = Boolean(obj.is_push_mail)
                    notificationDes.value = obj.content
                    JSON.parse(obj.members).forEach(member => {
                        scheduleMembers.value.push(member.uid)
                    })
                    getMemList(scheduleMembers.value)
                    loading.value = false
                })
            }
        }else {
            emit('getDataStatus',false)
        }
    })

})
const options = ref([])
const mem = ref([])

//获取选择用户的uid及name值
const handleChange = (selectedValues) => {
    mem.value = []
    getMemList(selectedValues)
}

const getMemList = (val) => {
    const selectedOptions = val.map((value) => {
        const option = options.value.find((item) => item.value === value);
        return { value: value, label: option ? option.label : '' };
    });
    const isDuplicate = mem.value.some((arr) => {
        if (arr.length !== selectedOptions.length) {
            return false;
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value !== selectedOptions[i].value || arr[i].label !== selectedOptions[i].label) {
                return false;
            }
        }
        return true;
    });
    if (!isDuplicate) {
        mem.value.push(selectedOptions)
    }
}

//向父组件发送该页数据，以辅助其进行表单检验
const emit = defineEmits(["getPageOneData","getDataStatus"])
watchEffect(() => {
    if (!startTime.value || !notice.value || !notificationDes.value || scheduleMembers.value.length === 0) {
        emit('getPageOneData', "", "", "", [])
    } else {
        emit('getPageOneData', notificationDes.value, startTime.value, notice.value, mem)
    }
})

const disabledDate = (time)=> {
    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}



</script>

<style scoped>

</style>