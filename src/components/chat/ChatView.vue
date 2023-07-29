<template>
    <el-row class="header-box">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <HeaderComp/>
        </el-col>
    </el-row>
    <el-row class="main-area">
        <el-col class="history-area" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <HistoryComp @get-tab-status="getTabStatus"/>
            <HistoryListComp/>
        </el-col>
        <el-col class="handle-area"  :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
            <ChatComp v-if="showChat"/>
            <WorkComp v-if="!showChat"/>
        </el-col>
    </el-row>
</template>

<script setup>
import HeaderComp from "@/components/chat/header/HeaderComp.vue";
import HistoryComp from "@/components/chat/history/HistoryComp.vue";
import HistoryListComp from "@/components/chat/history/HistoryListComp.vue";
import ChatComp from "@/components/chat/chatContainer/chat-comp.vue";
import WorkComp from "@/components/chat/workContainer/work-comp.vue";
import {onMounted, ref} from "vue";
import {ElNotification} from "element-plus";

const showChat = ref(true)
const getTabStatus = (val) => {
    if (val === 'chat'){
        showChat.value = true
    }else if (val === 'work'){
        showChat.value = false
    }
}
onMounted(()=> {
    window.currentWindow.center()
    window.currentWindow.setSize(1500, 860)
    ElNotification({
        title: '提示',
        message: '您当前所处部门为：Xeno开发部。您可以在设置中切换当前所处部门',
        type: 'info',
        duration:0,
        offset: 70,
    })
})
</script>

<style scoped>
    .main-area{
        /* height: 630px; */
        height: calc(100% - 40px);
    }
    .header-box {
        z-index: 99;
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
    }
    .history-area {
        height: 100%;
        position: fixed;
        z-index: 99; 
        top: 60px; 
        width: 100%;
    }
    .handle-area {
        height: 100%;
        position: fixed;
        z-index: 98; 
        top: 60px; 
        right: 0;
        width: 100%;
    }
</style>