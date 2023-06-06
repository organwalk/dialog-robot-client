<template>
    <el-card v-loading="loading" style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <el-row v-if="notice_id && !showSuccessTip">
            <el-col :xs="4" :sm="6" :md="8" :lg="2" :xl="11" align="left">
                <el-button @click="backNotification()" circle :icon="ArrowLeft" size="small" />
            </el-col>
            <el-col :xs="4" :sm="6" :md="8" :lg="20" :xl="11" align="center">
                <span style="font-weight: bolder">修改事项告知</span>
            </el-col>
        </el-row>
        <el-card shadow="never" style="border: none" v-if="showCreateForm">
            <!--            创建事项的页面     -->
            <one-create-notification :showPageOne="showPageOne"
                                     :nid="notice_id"
                                     @getPageOneData="getPageOneData"/>
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
import {reactive, ref, watch, defineProps, computed,defineEmits} from "vue";
import OneCreateNotification from "@/components/chat/interactiveCard/createNotification/one-create-notification.vue";
import * as card from '@/api/cloud/card'
import * as data from '@/api/server/data'
import {ArrowLeft} from "@element-plus/icons-vue";

//  获取父组件的nid值，若存在，则表明为修改操作，并据此判断是否应该渲染当前组件的返回键
const props = defineProps({
    nid:String
})
const notice_id = computed(()=>props.nid)

//  向事项列表发送清除标记，用以返回事项列表组件
const emit = defineEmits(["clearNid"])
const backNotification = () => {
    let refresh = ''
    emit("clearNid",refresh)
}

const loading = ref(false)

//  点击提交按钮的事件，应该同时控制表单、成功提示和响应动画的的显隐
const create = () => {
    loading.value = true
    showCreateForm.value = false
    showSuccessTip.value = true
    pageOneData.remindTime = Date.parse(pageOneData.remindTime)
    pageOneData.members = pageOneData.members[0].map(({value: uid, label: name}) => ({uid, name}))
    //  若存在nid则表明为修改，若无则为创建
    if (notice_id.value){
        card.updataNotes(notice_id.value,pageOneData).then(res=>{
            if (res.data.code !== 400){
                pageOneData["members"] = JSON.stringify(pageOneData.members)
                data.updataNotification(notice_id.value,pageOneData).then(res=>{
                    if (res.data.success){
                        setTimeout(()=>{
                            loading.value = false
                            showCreateForm.value = false
                            showSuccessTip.value = true
                        },1000)
                        setTimeout(()=>{
                            let refresh = ''
                            emit("clearNid",refresh)
                        },2000)
                    }
                })
            }
        })
    }else {
        card.addNotes(pageOneData).then(res=>{
            let nid = res.data.data.noticeId
            pageOneData["members"] = JSON.stringify(pageOneData.members)
            if (nid){
                data.addNotes(nid,pageOneData).then(res=>{
                    if (res.data.success){
                        setTimeout(()=>{
                            loading.value = false
                            showCreateForm.value = false
                            showSuccessTip.value = true
                        },1000)
                        setTimeout(()=>{
                            let refresh = ''
                            emit("clearNid",refresh)
                        },2000)
                    }
                })
            }
        })
    }
}

const showCreateForm = ref(true)
const showPageOne = ref(true)
const createStep = ref(false)
const showSuccessTip = ref(false)

const pageOneData = reactive(
    {
        content:'',
        remindTime:'',
        isPushMail:Boolean,
        members:[]
    }
)
const getPageOneData = (notificationDes,time,notice,mem)=>{
    pageOneData.content = notificationDes
    pageOneData.remindTime = time
    pageOneData.isPushMail = notice
    pageOneData.members = mem
}
watch(
    () => [pageOneData.content, pageOneData.remindTime, pageOneData.members],
    ([content, remindTime, members]) => {
        createStep.value = Boolean(content && remindTime && members)
    }
)


</script>

<style scoped>

</style>