<template>
    <el-card shadow="never" style="border: none;background-color: #f7f7f7;height: 630px;overflow-y: auto">
        <el-row :gutter="10">
            <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                <el-card style="border-radius: 10px">
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <h2 style="font-family: 微软雅黑,serif">Hi {{username}}😊, 欢迎来到工作台</h2>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right">
                            <img style="width: 35%" src="@/assets/work.png" alt="'404">
                        </el-col>
                    </el-row>
                </el-card><br/>
                <el-card style="border-radius: 10px;">
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-button style="width: 100%" text :bg="snCardColor" @click="clickSchedule()">日程</el-button>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-button style="width: 100%" text :bg="!snCardColor" @click="clickNotification">事项</el-button>
                        </el-col>
                    </el-row><br/>
                    <a-schedule v-if="snCard === '日程' "/>
                    <a-notification v-if="snCard === '事项' "/>
                </el-card>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-card style="border-radius: 10px">
                    <el-carousel class="create-area" height="210px" direction="vertical" :autoplay="true">
                        <el-carousel-item>
                            <work-create-schedule/>
                        </el-carousel-item>
                        <el-carousel-item>
                            <work-create-notification/>
                        </el-carousel-item>
                        <el-carousel-item>
                            <work-send-oa/>
                        </el-carousel-item>
                        <el-carousel-item>
                            <work-manage-employee/>
                        </el-carousel-item>
                    </el-carousel>
                </el-card><br/>
                <work-xeno-server/>
            </el-col>
        </el-row>
    </el-card>
    <el-dialog
        class="card-dialog"
        v-model="dialogVisible"
        width="70%"
        :align-center="true"
        :show-close="false"
    >
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <create-updata-schedule-comp
                    @send-success="getSuccess"
                    v-if="type === 'schedule' "/>
                <create-updata-notification-comp
                    @sendNotifiSuccess = "getNotifiSuccess"
                    v-if="type === 'notification' "/>
                <OaMessageComp
                    @sendOASuccess="getOASuccess"
                    v-if="type === 'oa' "/>
                <employee-manage v-if="type === 'manage' "/>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script setup>
import ASchedule from "@/components/chat/interactiveCard/scheduleList/a-schedule.vue";
import WorkCreateSchedule from "@/components/chat/workContainer/work-create-schedule.vue";
import WorkCreateNotification from "@/components/chat/workContainer/work-create-notification.vue";
import WorkSendOa from "@/components/chat/workContainer/work-send-oa.vue";
import WorkManageEmployee from "@/components/chat/workContainer/work-manage-employee.vue";
import {computed,  ref, watch} from "vue";
import {useStore} from "vuex";
import CreateUpdataScheduleComp from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";
import CreateUpdataNotificationComp
    from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue";
import OaMessageComp from "@/components/chat/interactiveCard/oa-message/OaMessageComp.vue";
import EmployeeManage from "@/components/chat/interactiveCard/manageEmployee/employee-manage.vue";
import ANotification from "@/components/chat/interactiveCard/notificationList/a-notification.vue";
import WorkXenoServer from "@/components/chat/workContainer/work-xeno-server.vue";


const store = useStore()
const dialogVisible = ref(false)
const status = computed(() => store.state.chat.createStatus)
const type = ref('')
const snCard = ref('日程')
const snCardColor = ref(true)
const username = ref(sessionStorage.getItem("userName"))


const clickSchedule = () => {
    snCard.value = '日程'
    snCardColor.value = true
}

const clickNotification = () => {
    snCard.value = '事项'
    snCardColor.value = false
}

watch(status,(newVal) => {
    if (newVal){
        dialogVisible.value = true
        type.value = newVal
    }
})

watch(dialogVisible,(newVal) => {
    if (newVal === false){
        store.dispatch('updataCreateStatus','')
    }
})

const getSuccess = (val) => {
    letDialogVisibleValueToFalse(val)
}

const getNotifiSuccess = (val) => {
    letDialogVisibleValueToFalse(val)
}

const getOASuccess = (val) => {
    letDialogVisibleValueToFalse(val)
}

const letDialogVisibleValueToFalse = (val) => {
    if (val){
        dialogVisible.value = false
    }
}
</script>

<style scoped>
:global(.el-dialog){
    --el-dialog-bg-color: none;
    --el-dialog-box-shadow: none;
    --el-dialog-padding-primary: 0;
}

</style>