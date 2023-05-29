<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 80%">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                <span style="font-weight: bolder;">Create Schedule</span><br/>
            </el-col>
        </el-row>
        <br/>
        <el-card shadow="never" style="border: none">
            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                    <el-steps :active="active"
                              finish-status="success">
                        <el-step/>
                        <el-step/>
                        <el-step/>
                    </el-steps>
                </el-col>
            </el-row>
            <br/><br/>

<!--            创建日程的页面     -->
            <one-create-schedule v-if="showPageOne" @getPageOneData="getPageOneData"/>
            <two-create-schedule v-if="showPageTwo" @getPageTwoData="getPageTwoData"/>
            <preview-create-schedule v-if="showPagePreview"/>

            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                    <el-button @click="next()" round color="#2C6AE3" v-if="nextStep">Next Step</el-button>
                </el-col>
            </el-row>
        </el-card>
    </el-card>

</template>

<script setup>
import {reactive, ref, watch} from "vue";
import OneCreateSchedule from "@/components/chat/interactiveCard/createSchedule/one-create-schedule.vue";
import TwoCreateSchedule from "@/components/chat/interactiveCard/createSchedule/two-create-schedule.vue";
import PreviewCreateSchedule from "@/components/chat/interactiveCard/createSchedule/preview-create-schedule.vue";

const active = ref(0)
const next = () => {
    if (active.value++ > 2) active.value = 0
}

watch(active,(newVal)=>{
    switch (newVal){
        case 0:
            showPageOne.value = true
            showPagePreview.value = false
            break
        case 1:
            showPageOne.value = false
            showPageTwo.value = true
            break
        case 2:
            showPageTwo.value = false
            showPagePreview.value = true
            break
    }
})

const showPageOne = ref(true)
const showPageTwo = ref(false)
const showPagePreview = ref(false)
const nextStep = ref(false)

watch(active,(newVal) => {
    if (newVal){
        nextStep.value = false
    }
})

const pageOneData = reactive(
    {
        title:'',
        startTime:'',
        endTime:'',
        notice:''
    }
)
const getPageOneData = (title,startTime,endTime,notice)=>{
    pageOneData.title = title
    pageOneData.startTime = startTime
    pageOneData.endTime = endTime
    pageOneData.notice = notice
}
watch(
    () => [pageOneData.title, pageOneData.startTime, pageOneData.endTime, pageOneData.notice],
    ([title, startTime, endTime, notice]) => {
        nextStep.value = (title && startTime && endTime && notice !== '')
    }
);

const pageTwoData = reactive(
    {
        scheduleDes:'',
        location:'',
        scheduleMembers:''
    }
)
const getPageTwoData = (scheduleDes,location,scheduleMembers) => {
    pageTwoData.scheduleDes = scheduleDes
    pageTwoData.location = location
    pageTwoData.scheduleMembers = scheduleMembers
}
watch(
    () => [pageTwoData.scheduleDes,pageTwoData.location,pageTwoData.scheduleMembers,active],
    ([scheduleDes,location,scheduleMembers]) => {
        nextStep.value = (scheduleDes && location && scheduleMembers.length !==0 )
    }
)

</script>

<style scoped>

</style>