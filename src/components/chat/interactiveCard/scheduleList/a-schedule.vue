<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
            <span style="font-weight: bolder;align-items: center">Today's schedule</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:480px;overflow-y: auto" v-if="!scheduleId">
        <el-card v-for="(item,index) in scheduleList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center">
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                    <el-collapse>
                        <el-collapse-item :title="item.time">
                            <h5>{{ item.des }}</h5>
                        </el-collapse-item>
                    </el-collapse>
                    <h4>{{ item.title }}</h4>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="20" :xl="11" align="left">
                <span style="font-size: 10px;color: #808080">{{ item.releaser }} released this schedule | location: {{
                    item.location
                    }}</span>
                </el-col>
                <el-col :xs="4" :sm="6" :md="8" :lg="2" :xl="11" align="center">
                    <el-button v-if="item.uid === uid" type="primary" :icon="Edit" circle size="small" @click="updataSchedule(item.scheduleId)"/>
                </el-col>
                <el-col :xs="4" :sm="6" :md="8" :lg="2" :xl="11" align="center">
<!--                    取消-->
                    <el-button v-if="item.action !== 'cancel'" type="info" :icon="Close" circle size="small"/>
                    <!-- 删除 -->
                    <el-button v-if="item.action === 'cancel'"  type="danger" :icon="Delete" circle size="small"/>
                </el-col>
            </el-row>
        </el-card>
<!--        <el-dialog-->
<!--                v-model="dialogUpdataSchedule"-->
<!--                width="40%"-->
<!--                destroy-on-close-->
<!--                top="20px"-->
<!--                style="border-radius: 20px;background-color: rgba(0, 0, 0, 0)"-->
<!--                :show-close="false"-->
<!--        >-->
<!--            -->
<!--        </el-dialog>-->

    </div>
    <create-updata-schedule-comp v-if="scheduleId"
                                 style="width: 100%"
                                 @getScheduleStatus="getScheduleStatus"
                                 @clearSid = "clearSid"
                                 :schedule-data="scheduleId" />
</template>

<script setup>
import {onMounted, ref, defineProps, computed, watch} from "vue";
import {
    Delete,
    Edit,
    Close
} from '@element-plus/icons-vue'
import CreateUpdataScheduleComp from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";
import * as data from '@/api/server/data'

const scheduleList = ref([])
const props = defineProps({
    clickDay:String
})
const uid =  sessionStorage.getItem("uid")
onMounted(()=>{
    getToDayDate()
})

//切换日期
const clickDay = computed(()=>props.clickDay)
watch(clickDay,(newVal)=>{
    if (newVal){
        const timestamp = new Date(props.clickDay).getTime();
        const utcDate = new Date(timestamp).toUTCString();
        const unixTimestamp = Date.parse(utcDate);
        const clickObj = {
            begintime:unixTimestamp,
            endtime:unixTimestamp
        }
        //且换到新的日期时，获取新的日程列表
        data.getSchedule(clickObj).then(res=>{
            scheduleList.value = res.data.scheduleData.map(item => {
                const start = new Date(item.begintime * 1000)
                const end = new Date(item.endtime * 1000);
                const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
                const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                const time = `${startTime}-${endTime}`;
                return {
                    time: time,
                    title: item.content,
                    des: item.strdescrip,
                    releaser: item.name,
                    location: JSON.parse(item.straddr).address,
                    uid: item.uid,
                    scheduleId: item.scheduleId,
                    action:item.action
                }
            })
        })
    }
})

// 更新日程对话框
const dialogUpdataSchedule = ref(false)
const scheduleId = ref('')
const updataSchedule = (val)=> {
    dialogUpdataSchedule.value = true
    scheduleId.value = val
}

const clearSid = (val)=>{
    scheduleId.value = val
    getToDayDate()
}

const getToDayDate = ()=>{
    const timestamp = new Date().getTime();
    const utcDate = new Date(timestamp).toUTCString();
    const unixTimestamp = Date.parse(utcDate);
    const todayObj = {
        begintime:unixTimestamp
    }
    //在页面挂载时请求日程列表
    data.getSchedule(todayObj).then(res=>{
        scheduleList.value = res.data.scheduleData.map(item => {
            const start = new Date(item.begintime * 1000)
            const end = new Date(item.endtime * 1000);
            const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
            const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
            const time = `${startTime}-${endTime}`;
            return {
                time: time,
                title: item.content,
                des: item.strdescrip,
                releaser: item.name,
                location: JSON.parse(item.straddr).address,
                uid: item.uid,
                scheduleId: item.scheduleId,
                action:item.action
            }
        })
    })
}
const getScheduleStatus = (scheduleStatus) => {
    if (scheduleStatus){
        setTimeout(()=>{
            dialogUpdataSchedule.value = false
        },1000)

    }
}
</script>

<style scoped>
/deep/ .el-collapse-item__header {
    background-color: #f5f9fa;
    border: none;
}

/deep/ .el-collapse {
    --el-collapse-border-color: none;
    --el-collapse-header-height: 20px;
    --el-collapse-content-bg-color: none;
}

/deep/ .el-collapse-item__content {
    padding: 0;
}

::-webkit-scrollbar {
    display: none;
}
</style>