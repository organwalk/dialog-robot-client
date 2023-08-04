<!--suppress ALL -->
<template>
    <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <span style="font-weight: bolder;align-items: center">Schedule List</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:350px;overflow-y: auto" v-if="!scheduleId" v-loading="loading">
        <el-empty v-if="showEmpty" description="当前日期暂无日程" :image="emptyImage"></el-empty>
        <el-card v-for="(item,index) in scheduleList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center" :style="item.action === 'cancel' ? { 'text-decoration': 'line-through' } : {}">
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
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" >
                    <el-button v-if="item.uid === uid && item.action !== 'cancel'" type="primary" :icon="Edit" circle
                               size="small"
                               @click="updataSchedule(item.scheduleId)"/>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" >
                    <!--                    取消-->
                    <el-popconfirm width="200"
                                   title="确定 完成 / 取消 该日程吗？" @confirm="cancel(item.scheduleId)">
                        <template #reference>
                            <el-button v-if="item.action !== 'cancel'" type="info" :icon="Close" circle size="small"/>
                        </template>
                    </el-popconfirm>
                    <!-- 删除 -->
                    <el-popconfirm width="200"
                                   title="确定删除该日程吗？" @confirm="deleteSchedule(item.scheduleId)">
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
import emptyImage from "@/assets/empty.png";

const scheduleList = ref([])
const props = defineProps({
    clickDay: String,
    refreshSchedule: Boolean
})
const uid = sessionStorage.getItem("uid")
onMounted(() => {
    setTimeout(() => {
        getScheduleList()
    }, 500)
})

const showEmpty = ref(true)

watch(scheduleList, (val) => {
    showEmpty.value = val.length <= 0;
})

//切换日期
const clickDay = computed(() => props.clickDay)

watch(clickDay, (newVal) => {
    if (!newVal.includes("-00")) {
        getScheduleList()
    }
})

const getScheduleList = () => {
    loading.value = true
    let clickObj
    if (props.clickDay){
        const timestamp = new Date(props.clickDay).getTime();
        const utcDate = new Date(timestamp).toUTCString();
        const unixTimestamp = Date.parse(utcDate);
        clickObj = {
            begintime: unixTimestamp,
            endtime: unixTimestamp
        }
    }else {
        const timestamp = new Date().getTime();
        const utcDate = new Date(timestamp).toUTCString();
        const unixTimestamp = Date.parse(utcDate);
        clickObj = {
            begintime: unixTimestamp
        }
    }
    //且换到新的日期时，获取新的日程列表
    data.getSchedule(clickObj).then(res => {
        scheduleList.value = res.data.scheduleData.map(item => {
            const time = `${timeShowStyle(item)[0]} - ${timeShowStyle(item)[1]}`;
            loading.value = false
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
        if (scheduleList.value.length === 0) {
            loading.value = false
            showEmpty.value = true
        }
    })
}
const scheduleId = ref('')
const updataSchedule = (val) => {
    scheduleId.value = val
}

//清空sid并刷新
const clearSid = (val) => {
    scheduleId.value = val
    setTimeout(() => {
        getScheduleList()
    }, 1000)
}

//取消日程
const cancel = (val) => {
    card.cancelPlan(val).then(res => {
        if (res.data.code === 200) {
            data.cancelSchedule(val).then(res => {
                if (res.data.status === 200) {
                    getScheduleList()
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
            data.deleteSchedule(val).then(res => {
                if (res.data.status === 200) {
                    getScheduleList()
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

const timeShowStyle = (item) => {
    const startTime = new Date(Number(item.begintime)).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = new Date(Number(item.endtime)).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    return  [startTime,endTime]
}
const refreshSchedule = computed(() => props.refreshSchedule)
watch(refreshSchedule, (newVal) => {
    if (newVal) {
        getScheduleList()
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
