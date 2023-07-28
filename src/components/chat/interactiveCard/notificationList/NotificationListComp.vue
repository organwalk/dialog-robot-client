<!--suppress ALL -->
<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row justify="center">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="left">
                <span style="font-size: 18px;font-weight: bolder;">Notification</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right">
                <el-icon size="20px">
                    <List/>
                </el-icon>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <n-custom-calendar @send-click-day="getClickDay"/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <a-notification :click-day="clickDay"/>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {List} from '@element-plus/icons-vue'
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