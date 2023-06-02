<template>
    <el-card style="width: 50%;margin-bottom: 10px;border-radius: 15px;background-color: white;">
        <div style="width: 100%" v-show="!showSuccess">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <span style="font-weight: bolder">OA Message</span>
                </el-col>
            </el-row>
            <br/>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <el-steps :active="active" finish-status="success">
                        <el-step/>
                        <el-step/>
                    </el-steps>
                </el-col>
            </el-row>
            <br/>
            <!--        第一页 -->
            <one-page-send-oamessage :showPageOne="showPageOne" @sendPageOneData="getPageOneData"/>
            <two-page-send-oamessage :show-page-two="showPageTwo" @sendFileStatus="getPageTwoData"/>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                    <el-button @click="active --" round v-show="showBack">Back</el-button>
                    <el-button type="primary" @click="active ++" round v-show="showNext">Next</el-button>
                    <el-button type="primary" @click="submit()" round v-show="showSubmit">Confirm</el-button>
                </el-col>
            </el-row>
        </div>
        <el-alert title="成功发送OA消息" type="success" center show-icon :closable="false" v-show="showSuccess"/>
    </el-card><br/>
</template>

<script setup>
import OnePageSendOamessage from "@/components/chat/interactiveCard/oa-message/one-page-send-oamessage.vue";
import {ref, watch} from "vue";
import TwoPageSendOamessage from "@/components/chat/interactiveCard/oa-message/two-page-send-oamessage.vue";

const active = ref(0)
const showNext = ref(false)
const showBack = ref(false)
const showSubmit = ref(false)
watch(active, (newVal) => {
    if (newVal) {
        showBack.value = true
    }
    if (newVal === 1) {
        showPageOne.value = false
        showPageTwo.value = true
        showNext.value = false
    }
    if (newVal === 0) {
        showPageOne.value = true
        showPageTwo.value = false
        showBack.value = false
        showNext.value = true
    }
})

const showPageOne = ref(true)
const getPageOneData = (newMsg, newTit, newSum) => {
    showNext.value = !!(newMsg && newTit && newSum);
}

const getPageTwoData = (newFile) => {
    console.log("11" + newFile.name)
    showSubmit.value = (newFile.name)
}
const showPageTwo = ref(false)

const showSuccess = ref(false)
const submit = () => {
    showSuccess.value = true
}
</script>

<style scoped>

</style>