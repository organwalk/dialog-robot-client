<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <HeaderComp/>
        </el-col>
    </el-row>
    <el-row>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <HistoryComp @get-tab-status="getTabStatus"/>
            <HistoryListComp/>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
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
import {ref} from "vue";

const showChat = ref(true)
const getTabStatus = (val) => {
    if (val === 'chat'){
        showChat.value = true
    }else if (val === 'work'){
        showChat.value = false
    }
}
</script>

<style>
</style>