<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 80%">
        <el-row justify="center">
            <el-col :xs="4" :sm="6" :md="8" :lg="12" :xl="11" align="left">
                <span style="font-size: 18px;font-weight: bolder;">Schedule</span>
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
                <custom-calendar/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <a-schedule/>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {AlarmClock} from '@element-plus/icons-vue'
import CustomCalendar from "@/components/chat/interactiveCard/custom-calendar.vue";
import ASchedule from "@/components/chat/interactiveCard/a-schedule.vue";

</script>

<style scoped>

</style>