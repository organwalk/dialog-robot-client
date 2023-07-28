<template>
    <el-card v-loading="loading" style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row v-if="sid && !showSuccessTip">
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="left">
                <el-button @click="backSchedule()" circle :icon="ArrowLeft" size="small" />
            </el-col>
            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" align="center">
                <span style="font-weight: bolder">修改日程</span>
            </el-col>
        </el-row>
        <el-card shadow="never" style="border: none" v-if="showCreateForm">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <el-steps :active="active"
                              finish-status="success">
                        <el-step/>
                        <el-step/>
                        <el-step/>
                    </el-steps>
                </el-col>
            </el-row>
            <br v-if="!showRefresh"/><br v-if="!showRefresh"/>

            <!--            创建日程的页面     -->
            <one-create-schedule :showPageOne="showPageOne" :sid="sid" v-loading="scheduleLoading"
                                 @getPageOneData="getPageOneData" @get-page-one-data-status="getPageOneDataStatus"/>
            <two-create-schedule :showPageTwo="showPageTwo" :sid="sid"
                                 @getPageTwoData="getPageTwoData"
                                 @get-page-two-data-status="getPageTwoDataStatus"/>
            <preview-create-schedule :showPagePreview="showPagePreview"
                                     :page-one-data="pageOneData"
                                     :page-two-data="pageTwoData"/>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                    <el-button @click="back()" round color="#e9e9eb" v-if="backStep" v-btn>Back</el-button>
                    <el-button @click="next()" round color="#2C6AE3" v-if="nextStep" v-btn>Next Step</el-button>
                    <el-button @click="create()" round color="#2C6AE3" v-if="createStep" v-btn>Confirm</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-alert v-if="showSuccessTip" style="user-select: none;border-radius: 10px;" title="Success" type="success" center show-icon :closable="false" />
        <el-row v-if="showRefresh" justify="center">
            <el-alert style="user-select: none;border-radius: 10px;" title="服务出错" type="warning" center show-icon :closable="false" />
            <el-card shadow="never" style="border: none">
                <el-button type="primary" round @click="retry()" v-btn :disabled="stopReTry">请重试</el-button>
            </el-card>
        </el-row>
    </el-card>

</template>

<script setup>
import {reactive, ref, watch, defineEmits, defineProps, computed} from "vue"
import OneCreateSchedule from "@/components/chat/interactiveCard/createSchedule/one-create-schedule.vue"
import TwoCreateSchedule from "@/components/chat/interactiveCard/createSchedule/two-create-schedule.vue"
import PreviewCreateSchedule from "@/components/chat/interactiveCard/createSchedule/preview-create-schedule.vue"
import * as card from "@/api/cloud/card"
import * as data from "@/api/server/data"
import {
    ArrowLeft,
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const active = ref(0)
const next = () => {
    const startDate = new Date(pageOneData.startTime);
    const endDate = new Date(pageOneData.endTime);
    if (startDate.getTime() > endDate.getTime()) {
        active.value = 0
        ElMessage.error("结束时间不能小于开始时间");
    }else {
        if (active.value++ > 2) active.value = 0
    }
}
const back = () => {
    active.value --
}
const backSchedule = () => {
    let refresh = ''
    emit("clearSid",refresh)
}
const props = defineProps({
    scheduleData:String
})

//监听步骤值，以切换不同页面
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
    else nextStep.value = newVal > oldVal && pageTwoData.scheduleDes !== '' && pageTwoData.location !== '' && pageTwoData.scheduleMembers.length > 0;
})

const showCreateForm = ref(true)
const showPageOne = ref(true)
const showPageTwo = ref(false)
const showPagePreview = ref(false)
const nextStep = ref(false)
const backStep = ref(false)
const createStep = ref(false)
const showSuccessTip = ref(false)
const loading = ref(false)

//监听步骤值以显示不同按钮
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
        nextStep.value = Boolean(des && location && mem)
    }
)

const emit = defineEmits(["clearSid","sendSuccess"])

const create = () => {
    loading.value = true
    allPageData.content = pageOneData.title
    allPageData.begintime = Date.parse(pageOneData.startTime);
    allPageData.endtime = Date.parse(pageOneData.endTime);
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
    allPageData.members = pageTwoData.scheduleMembers[0].map(({value: uid, label: name}) => ({uid, name}));
    //  如果存在sid则说明此次操作为修改操作
    if (sid.value){
        card.updataPlan(sid.value,allPageData).then(res=>{
            if (res.data.code !== 400){
                allPageData["members"] = JSON.stringify(pageTwoData.scheduleMembers[0].map(({value: uid, label: name}) => ({uid, name})))
                data.updataSchedule(sid.value,allPageData).then(res=>{
                    if (res.data.success){
                        setTimeout(()=>{
                            loading.value = false
                            showCreateForm.value = false
                            showSuccessTip.value = true
                        },1000)
                        setTimeout(()=>{
                            let refresh = ''
                            emit("clearSid",refresh)
                        },2000)
                    }
                })
            }else {
                loading.value = false
                showCreateForm.value = false
                ElMessage.error("服务错误。请使用 Ctrl + R 强制重新载入程序")
            }
        })
    }else {
        //若没有sid则为创建操作
        card.sendAddPlan(allPageData).then(res=>{
            if (res.data.code === 200){
                const sid = res.data.data.scheduleId
                allPageData["members"] = JSON.stringify(pageTwoData.scheduleMembers[0].map(({value: uid, label: name}) => ({uid, name})))
                data.saveScheduleCount(sid,allPageData).then(res=>{
                    if (res.data.success){
                        setTimeout(()=>{
                            loading.value = false
                            showCreateForm.value = false
                            showSuccessTip.value = true
                            emit("sendSuccess",showSuccessTip.value)
                        },1000)
                    }
                })
            }else {
                loading.value = false
                showCreateForm.value = false
                ElMessage.error("服务错误。请使用 Ctrl + R 强制重新载入程序")
            }
        })
    }
}

const sid = computed(()=>props.scheduleData)

const scheduleLoading = ref(true)
const showRefresh = ref(false)
const getPageOneDataStatus = (status) => {
    refreshPage(status)
}
const getPageTwoDataStatus = (status) => {
    refreshPage(status)
}

const refreshPage = (status) => {
    scheduleLoading.value = false
    if (status){
        showPageOne.value = true
        showRefresh.value = false
    }else {
        showPageOne.value = false
        showRefresh.value = true
    }
}

const retry = () => {
    showPageOne.value = true
}
</script>

<style scoped>

</style>