<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row justify="center">
            <el-col :xs="4" :sm="6" :md="8" :lg="12" :xl="11" align="left">
                <span style="font-size: 18px;font-weight: bolder;">Notification</span>
            </el-col>
            <el-col :xs="4" :sm="6" :md="8" :lg="12" :xl="11" align="right">
                <el-icon size="20px">
                    <AlarmClock/>
                </el-icon>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <n-custom-calendar @send-click-day="getClickDay"/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <a-notification :click-day="clickDay"/>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {AlarmClock} from '@element-plus/icons-vue'
import ANotification from "@/components/chat/interactiveCard/notificationList/a-notification.vue";
import {ref} from "vue";
import NCustomCalendar from "@/components/chat/interactiveCard/notificationList/n-custom-calendar.vue";
const clickDay = ref('')
const getClickDay = (day)=>{
    clickDay.value = day
}
</script>

<style scoped>

</style>