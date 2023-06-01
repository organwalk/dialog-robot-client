<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 80%">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                <span style="font-weight: bolder;user-select: none">Notification</span><br/>
            </el-col>
        </el-row>
        <br/>
        <el-card shadow="never" style="border: none" v-if="showCreateForm">
            <!--            创建事项的页面     -->
            <one-create-notification :showPageOne="showPageOne" @getPageOneData="getPageOneData"/>

            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                    <el-button @click="create()" round color="#2C6AE3" v-if="createStep">Confirm</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-alert style="user-select: none;border-radius: 10px;" v-if="showSuccessTip" title="Success" type="success" center show-icon :closable="false" />
    </el-card>

</template>

<script setup>
import {reactive, ref, watch,defineEmits} from "vue";
import {useStore} from "vuex";
import OneCreateNotification from "@/components/chat/interactiveCard/createNotification/one-create-notification.vue";

const create = () => {
    showCreateForm.value = false
    showSuccessTip.value = true
}



const showCreateForm = ref(true)
const showPageOne = ref(true)
const createStep = ref(false)
const showSuccessTip = ref(false)

const store = useStore()

const pageOneData = reactive(
    {
        notificationDes:'',
        startTime:'',
        endTime:'',
        notice:''
    }
)
const getPageOneData = (notificationDes,startTime,endTime,notice)=>{
    pageOneData.notificationDes = notificationDes
    pageOneData.startTime = startTime
    pageOneData.endTime = endTime
    pageOneData.notice = notice
    store.dispatch('updataPageOneData',pageOneData)
}
watch(
    () => [pageOneData.notificationDes, pageOneData.startTime, pageOneData.endTime, pageOneData.notice],
    ([notificationDes, startTime, endTime, notice]) => {
        createStep.value = (notificationDes && startTime && endTime && notice !== '')
    }
);

const emit = defineEmits(["getNotificationStatus"])
watch(showSuccessTip,(newTip)=>{
    if_success(newTip)
})
const if_success = (notificationStatus)=> {
    emit("getNotificationStatus",notificationStatus)
}

</script>

<style scoped>

</style>