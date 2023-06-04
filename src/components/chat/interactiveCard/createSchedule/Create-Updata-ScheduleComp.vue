<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                <span style="font-weight: bolder;user-select: none">Schedule</span><br/>
            </el-col>
        </el-row>
        <br/>
        <el-card shadow="never" style="border: none" v-if="showCreateForm">
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
            <one-create-schedule :showPageOne="showPageOne" @getPageOneData="getPageOneData"/>
            <two-create-schedule :showPageTwo="showPageTwo" @getPageTwoData="getPageTwoData"/>
            <preview-create-schedule :showPagePreview="showPagePreview"
                                     :page-one-data="pageOneData"
                                     :page-two-data="pageTwoData"/>


            <el-row>
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                    <el-button @click="back()" round color="#e9e9eb" v-if="backStep">Back</el-button>
                    <el-button @click="next()" round color="#2C6AE3" v-if="nextStep">Next Step</el-button>
                    <el-button @click="create()" round color="#2C6AE3" v-if="createStep">Confirm</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-alert style="user-select: none;border-radius: 10px;" v-if="showSuccessTip" title="Success" type="success" center show-icon :closable="false" />
    </el-card>

</template>

<script setup>
import {reactive, ref, watch,defineEmits} from "vue";
import OneCreateSchedule from "@/components/chat/interactiveCard/createSchedule/one-create-schedule.vue";
import TwoCreateSchedule from "@/components/chat/interactiveCard/createSchedule/two-create-schedule.vue";
import PreviewCreateSchedule from "@/components/chat/interactiveCard/createSchedule/preview-create-schedule.vue";
import {sendAddPlan} from "@/api/cloud/card";
import * as data from "@/api/server/data"

const active = ref(0)
const next = () => {
    if (active.value++ > 2) active.value = 0
}
const back = () => {
    active.value --
}
const create = () => {
    showCreateForm.value = false
    showSuccessTip.value = true
    allPageData.content = pageOneData.title
    allPageData.begintime = Math.floor(Date.parse(pageOneData.startTime) / 1000)
    allPageData.endtime = Math.floor(Date.parse(pageOneData.endTime) / 1000)
    if (pageOneData.notice){
        allPageData['warntime']=[0,5,15]
        allPageData.iswarn = Boolean(pageOneData.notice)
    }else {
        allPageData.iswarn = Boolean(pageOneData.notice)
    }
    allPageData.straddr = JSON.stringify(
        {
            isCoordinate:0,
            title:pageTwoData.location,
            address:pageTwoData.location,
            latitude:0,
            longitude:0
        }
    )
    allPageData.strdescrip = pageTwoData.scheduleDes
    allPageData.members = pageTwoData.scheduleMembers
    sendAddPlan(allPageData).then(res=>{
        const sid = res.data.data.scheduleId
        data.saveScheduleCount(sid,allPageData)
    })
}

watch(active,(newVal,oldVal)=>{
    switch (newVal){
        case 0:
            showPageOne.value = true
            showPageTwo.value = false
            showPagePreview.value = false
            backStep.value = false
            break
        case 1:
            showPageOne.value = false
            showPageTwo.value = true
            showPagePreview.value = false
            break
        case 2:
            showPageTwo.value = false
            showPagePreview.value = true
            break
    }
    if (newVal < oldVal){
        nextStep.value = true
    }
    else if (newVal > oldVal && pageTwoData.scheduleDes !==''&&pageTwoData.location !==''&&pageTwoData.scheduleMembers.length>0){
        nextStep.value = true
    }else {
        nextStep.value = false
    }
})

const showCreateForm = ref(true)
const showPageOne = ref(true)
const showPageTwo = ref(false)
const showPagePreview = ref(false)
const nextStep = ref(false)
const backStep = ref(false)
const createStep = ref(false)
const showSuccessTip = ref(false)

watch(active,(newVal) => {
    if (newVal){
        backStep.value = true
    }
    if (newVal === 2){
        nextStep.value = false
        createStep.value = true
    }
    else {
        createStep.value = false
    }
})

const allPageData = reactive({
    content:'',
    begintime:Number,
    endtime:Number,
    iswarn:Boolean,
    straddr:'',
    strdescrip:'',
    members:[]
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
        scheduleMembers:[]
    }
)
const getPageTwoData = (scheduleDes,location,scheduleMembers) => {
    pageTwoData.scheduleDes = scheduleDes
    pageTwoData.location = location
    pageTwoData.scheduleMembers = scheduleMembers
}
watch(
    () => [pageTwoData.scheduleDes,pageTwoData.location,pageTwoData.scheduleMembers],
    ([des,location,mem]) => {
        nextStep.value = (des && location && mem.length>0)
    }
)

const emit = defineEmits(["getScheduleStatus"])

watch(showSuccessTip,(newTip)=>{
    if_success(newTip)
})
const if_success = (scheduleStatus)=> {
    emit("getScheduleStatus",scheduleStatus)
}

</script>

<style scoped>

</style>