<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
            <span style="font-weight: bolder;align-items: center">Today's notification</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:480px;overflow-y: auto">
        <el-card v-for="(item,index) in notificationList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center">
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                    <el-collapse >
                        <el-collapse-item :title="item.time" >
                            <h5>{{ item.des }}</h5>
                        </el-collapse-item>
                    </el-collapse>
                    <h4 v-if="showContext" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 400px;">{{ item.des }}</h4>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="20" :xl="11" align="left">
                <span style="font-size: 10px;color: #808080">{{ item.releaser }} released this notification</span>
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
                align-center
                style="border-radius: 20px;background-color: rgba(0, 0, 0, 0)"
                :show-close="false"
        >
            <CreateUpdataNotificationComp style="width: 100%;" @getNotificationStatus="getNotificationStatus"/>
        </el-dialog>
    </div>
</template>

<script setup>
import {ref} from "vue";
import {
    Delete,
    Edit,
} from '@element-plus/icons-vue'
import CreateUpdataNotificationComp from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue";

const notificationList = ref([])
notificationList.value.push(
    {
        time: "08:30-09:30",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
    },
    {
        time: "08:30-09:30",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
    },
    {
        time: "08:30-09:30",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
    },
    {
        time: "08:30-09:30",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
    },
)
const dialogUpdataSchedule = ref(false)
const updataSchedule = ()=> {
    dialogUpdataSchedule.value = true
}

const getNotificationStatus = (notificationStatus) => {
    if (notificationStatus){
        setTimeout(()=>{
            dialogUpdataSchedule.value = false
        },1000)
    }
}
const showContext = ref(true)
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