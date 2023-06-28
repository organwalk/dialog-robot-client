<template>
    <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <span style="font-weight: bolder;align-items: center">Notification List</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:350px;overflow-y: auto" v-if="!notice_id" v-loading="loading">
        <el-empty v-if="showEmpty" description="当前日期暂无事项" />
        <el-card v-for="(item,index) in notificationList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <el-collapse >
                        <el-collapse-item :title="item.remind_time" >
                            <h5>{{ item.content }}</h5>
                        </el-collapse-item>
                    </el-collapse>
                    <h4 v-if="showContext" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 400px;">{{ item.content }}</h4>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" align="left">
                <span style="font-size: 10px;color: #808080">{{ item.name }} released this notification</span>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" v-if="unShowInOtherDay">
                    <el-button v-if="item.uid === uid" type="primary" :icon="Edit" circle size="small"
                               @click="updataNotification(item.notice_id)"/>
                </el-col>
                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center" v-if="unShowInOtherDay">
                    <!--                    取消-->
                    <el-popconfirm width="200"
                                   title="确定取消该日程吗？" @confirm="cancel(item.notice_id)">
                        <template #reference>
                            <el-button v-if="item.action !== 'cancel'" type="info" :icon="Close" circle size="small"/>
                        </template>
                    </el-popconfirm>
                    <!-- 删除 -->
                    <el-popconfirm width="200"
                                   title="确定取消该日程吗？" @confirm="deleteSchedule(item.notice_id)">
                        <template #reference>
                            <el-button v-if="item.action === 'cancel'" type="danger" :icon="Delete" circle
                                       size="small"/>
                        </template>
                    </el-popconfirm>
                </el-col>
            </el-row>
        </el-card>
    </div>
    <CreateUpdataNotificationComp style="width: 100%;"
                                  :nid="notice_id"
                                  @clear-nid="getClearNid"
                                  v-if="notice_id"/>
</template>

<script setup>
import {onMounted, ref, defineProps, computed, watch} from "vue";
import {
    Close,
    Delete,
    Edit,
} from '@element-plus/icons-vue'
import CreateUpdataNotificationComp from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue";
import * as data from "@/api/server/data";
import * as card from "@/api/cloud/card"
import {ElMessage} from "element-plus";

//  接收由父组件中转的日历组件提供的当前点击日期
const props = defineProps({
    clickDay: String
})
const notificationList = ref([])
const uid = sessionStorage.getItem("uid")

//  切换日期时渲染相应的事项列表
const clickDay = computed(() => props.clickDay)
const today = new Date().toISOString().substring(0,10)
//  只有当日的事项才享有编辑事件的入口
const unShowInOtherDay = ref(true)
watch(clickDay,(newVal)=>{
    unShowInOtherDay.value = newVal === today;
})

watch(clickDay, (newVal) => {
    if (newVal) {
        loading.value = true
        const timestamp = new Date(props.clickDay).getTime();
        const utcDate = new Date(timestamp).toUTCString();
        const unixTimestamp = Date.parse(utcDate);
        const clickObj = {
            remind_time: String(unixTimestamp)
        }
        //且换到新的日期时，获取新的日程列表
        data.getNotification(clickObj).then(res => {
            //  取出事项列表数据
            if (res.data.notificationData.length !== 0 ){
                showEmpty.value = false
                notificationList.value = res.data.notificationData.map(item => {
                    const Time = new Date(Number(item.remind_time)).toLocaleString('en-US',
                        { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit', minute: '2-digit' }); // 将UTC时间转换为北京时间
                    return {
                        uid:item.uid,
                        name:item.name,
                        notice_id:item.notice_id,
                        content:item.content,
                        remind_time: Time,
                        is_push_mail:item.is_push_mail,
                        members:item.members,
                        action:item.action
                    }
                })
                loading.value = false   //关闭加载
            }else {
                loading.value = false
                showEmpty.value= true
            }
        })
    }
})

//  当该值为空时，表明处于列表，不为空则进入相应修改页面
const notice_id = ref('')
//  接收子组件发送的标记，用于清除nid，以达成返回操作
const getClearNid = (val)=>{
    notice_id.value = val
    setTimeout(() => {
        getToDayDate()
    }, 1000)
}
//  更新事项
const updataNotification = (val)=>{
    notice_id.value = val
}

//  取消
const cancel = (val)=>{
    card.cancelNotes(val).then(res=>{
        if (res.data.code === 200){
            data.cancelNotificationByNid(val).then(res=>{
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

//  删除
const deleteSchedule = (val)=>{
    card.deleteNotes(val).then(res=>{
        if (res.data.code === 200){
            data.deleteNotificationByNid(val).then(res=>{
                if (res.data.status === 200){
                    getToDayDate()
                    ElMessage({
                        message: '取消成功',
                        type: 'success',
                    })
                    notificationList.value = []
                }
            })
        }
    })
}

const showContext = ref(true)
const loading = ref(true)

onMounted(() => {
    setTimeout(() => {
        getToDayDate()
    }, 1000)
})

const showEmpty = ref(false)
//一个获取当前事项列表数据的通用方法
const getToDayDate = () => {
    loading.value = true
    const timestamp = new Date().getTime();
    const utcDate = new Date(timestamp).toUTCString();
    const unixTimestamp = Date.parse(utcDate);
    const todayObj = {
        remind_time: String(unixTimestamp)
    }
    //请求当日的事项列表
    data.getNotification(todayObj).then(res => {
        //  取出事项列表数据
        if (res.data.notificationData.length !== 0 ){
            showEmpty.value = false
            notificationList.value = res.data.notificationData.map(item => {
                const Time = new Date(Number(item.remind_time)).toLocaleString('en-US',
                    { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit', minute: '2-digit' }); // 将UTC时间转换为北京时间
                return {
                    uid:item.uid,
                    name:item.name,
                    notice_id:item.notice_id,
                    content:item.content,
                    remind_time: Time,
                    is_push_mail:item.is_push_mail,
                    members:item.members,
                    action:item.action
                }
            })
            loading.value = false   //关闭加载
        }else {
            loading.value = false
            showEmpty.value= true
        }

    })
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