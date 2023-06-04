<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
            <span style="font-weight: bolder;align-items: center">Today's schedule</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:480px;overflow-y: auto">
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
                    <el-button type="primary" :icon="Edit" circle size="small" @click="updataSchedule"/>
                </el-col>
                <el-col :xs="4" :sm="6" :md="8" :lg="2" :xl="11" align="center">
                    <!-- 删除 -->
                    <el-button  type="danger" :icon="Delete" circle size="small"/>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
            v-model="dialogUpdataSchedule"
            width="40%"
            destroy-on-close
            top="20px"
            style="border-radius: 20px;background-color: rgba(0, 0, 0, 0)"
            :show-close="false"
        >
            <create-updata-schedule-comp style="width: 100%;" @getScheduleStatus="getScheduleStatus"/>
        </el-dialog>
    </div>
</template>

<script setup>
import {onMounted, ref, defineProps, computed, watch} from "vue";
import {
    Delete,
    Edit,
} from '@element-plus/icons-vue'
import CreateUpdataScheduleComp from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";
import * as data from '@/api/server/data'

const scheduleList = ref([])
const props = defineProps({
    clickDay:String
})
onMounted(()=>{
    const today = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-').split('-');
    const year = today[0];
    const month = today[1].padStart(2, '0');
    const date = today[2].padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    const todayObj = {
        begintime:formattedDate,
        endtime:formattedDate
    }
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
                scheduleId: item.scheduleId
            }
        })
    })
})
const clickDay = computed(()=>props.clickDay)
watch(clickDay,(newVal)=>{
    if (newVal){
        console.log(clickDay.value)
        const clickObj = {
            begintime:props.clickDay,
            endtime:props.clickDay
        }
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
                    scheduleId: item.scheduleId
                }
            })
        })
    }
})

const dialogUpdataSchedule = ref(false)
const updataSchedule = ()=> {
    dialogUpdataSchedule.value = true
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