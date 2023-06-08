<template>
    <el-card  style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row justify="center">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="left">
                <span style="font-size: 18px;font-weight: bolder;">Schedule</span>
            </el-col>
            <el-col  :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right">
                <el-icon size="20px">
                    <AlarmClock/>
                </el-icon>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col v-loading="loading" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <custom-calendar @send-click-day="getClickDay"/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <a-schedule :click-day="clickDay"/>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {AlarmClock} from '@element-plus/icons-vue'
import CustomCalendar from "@/components/chat/interactiveCard/scheduleList/custom-calendar.vue";
import ASchedule from "@/components/chat/interactiveCard/scheduleList/a-schedule.vue";
import {onMounted, ref} from "vue";

const clickDay = ref('')
const getClickDay = (day)=>{
    clickDay.value = day
}
const loading = ref(true)

onMounted(()=>{
    setTimeout(()=>{
        loading.value = false
    },1500)
})
</script>

<style scoped>

</style>