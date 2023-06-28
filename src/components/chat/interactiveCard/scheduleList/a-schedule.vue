<template>
    <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <span style="font-weight: bolder;align-items: center">Schedule List</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:350px;overflow-y: auto" v-if="!scheduleId" v-loading="loading">
        <el-empty v-if="showEmpty" description="当前日期暂无日程"></el-empty>
        <el-card v-for="(item,index) in scheduleList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <el-collapse>
                        <el-collapse-item :title="item.time">
                            <h5>{{ item.des }}</h5>
                        </el-collapse-item>
                    </el-collapse>
                    <h4>{{ item.title }}</h4>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" align="left">
                <span style="font-size: 10px;color: #808080">{{ item.releaser }} released this schedule | location: {{
                    item.location
                    }}</span>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" v-if="unShowInOtherDay">
                    <el-button v-if="item.uid === uid" type="primary" :icon="Edit" circle size="small"
                               @click="updataSchedule(item.scheduleId)"/>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" v-if="unShowInOtherDay">
                    <!--                    取消-->
                    <el-popconfirm width="200"
                                   title="确定取消该日程吗？" @confirm="cancel(item.scheduleId)">
                        <template #reference>
                            <el-button v-if="item.action !== 'cancel'" type="info" :icon="Close" circle size="small"/>
                        </template>
                    </el-popconfirm>
                    <!-- 删除 -->
                    <el-popconfirm width="200"
                                   title="确定取消该日程吗？" @confirm="deleteSchedule(item.scheduleId)">
                        <template #reference>
                            <el-button v-if="item.action === 'cancel'" type="danger" :icon="Delete" circle
                                       size="small"/>
                        </template>
                    </el-popconfirm>
                </el-col>
            </el-row>
        </el-card>
    </div>
    <create-updata-schedule-comp v-if="scheduleId"
                                 style="width: 100%"
                                 @clearSid="clearSid"
                                 :schedule-data="scheduleId"/>
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
import * as card from '@/api/cloud/card'
import {ElMessage} from "element-plus";

const scheduleList = ref([])
const props = defineProps({
    clickDay: String,
    refreshSchedule:Boolean
})
const uid = sessionStorage.getItem("uid")
onMounted(() => {
    setTimeout(() => {
        getToDayDate()
    }, 1000)
})

const showEmpty = ref(true)

watch(scheduleList,(val)=>{
    showEmpty.value = val.length <= 0;
})

//切换日期
const clickDay = computed(() => props.clickDay)
const today = new Date().toISOString().substring(0,10)
const unShowInOtherDay = ref(true)
watch(clickDay,(newVal)=>{
    unShowInOtherDay.value = newVal === today;
})


watch(clickDay, (newVal) => {
    if (newVal) {
        const timestamp = new Date(props.clickDay).getTime();
        const utcDate = new Date(timestamp).toUTCString();
        const unixTimestamp = Date.parse(utcDate);
        const clickObj = {
            begintime: unixTimestamp,
            endtime: unixTimestamp
        }
        //且换到新的日期时，获取新的日程列表
        data.getSchedule(clickObj).then(res => {
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
                    action: item.action
                }
            })
            if (scheduleList.value.length === 0){
                showEmpty.value = true
            }
        })
    }
})

const scheduleId = ref('')
const updataSchedule = (val) => {
    scheduleId.value = val
}

//清空sid并刷新
const clearSid = (val) => {
    scheduleId.value = val
    setTimeout(() => {
        getToDayDate()
    }, 1000)
}

//取消日程
const cancel = (val) => {
    card.cancelPlan(val).then(res => {
        if (res.data.code === 200) {
            data.cancelSchedule(val).then(res=>{
                if (res.data.status === 200){
                    getToDayDate()
                    ElMessage({
                        message: '取消成功',
                        type: 'success',
                    })
                }
            })
        }
    })
}

//删除日程
const deleteSchedule = (val) => {
    card.deletePlan(val).then(res => {
        if (res.data.code === 200) {
            data.deleteSchedule(val).then(res =>{
                if (res.data.status === 200){
                    getToDayDate()
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    })
                }
            })
        }
    })
}
const loading = ref(true)
const getToDayDate = () => {
    const timestamp = new Date().getTime();
    const utcDate = new Date(timestamp).toUTCString();
    const unixTimestamp = Date.parse(utcDate);
    const todayObj = {
        begintime: unixTimestamp
    }
    //在页面挂载时请求日程列表
    data.getSchedule(todayObj).then(res => {
        loading.value = false
        scheduleList.value = res.data.scheduleData.map(item => {
            const startTime = new Date(Number(item.begintime)).toLocaleString('en-US',
                { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(Number(item.endtime)).toLocaleString('en-US',
                { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit', minute: '2-digit' });
            const time = `${startTime}-${endTime}`;
            return {
                time: time,
                title: item.content,
                des: item.strdescrip,
                releaser: item.name,
                location: JSON.parse(item.straddr).address,
                uid: item.uid,
                scheduleId: item.scheduleId,
                action: item.action
            }
        })
    })
}
const refreshSchedule = computed(() => props.refreshSchedule)
watch(refreshSchedule,(newVal) => {
    if (newVal){
        getToDayDate()
    }
})
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