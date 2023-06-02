<template>
    <el-row >
        <el-col :xs="8" :sm="6" :md="4" :lg="24" :xl="1">
            <HeaderComp/>
        </el-col>
    </el-row>
    <el-row>
        <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <HistoryComp/>
            <HistoryListComp/>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="18" :xl="11">
            <ChatComp/>
        </el-col>
    </el-row>
</template>

<script setup>
import HeaderComp from "@/components/chat/header/HeaderComp.vue";
import HistoryComp from "@/components/chat/history/HistoryComp.vue";
import HistoryListComp from "@/components/chat/history/HistoryListComp.vue";
import ChatComp from "@/components/chat/chatContainer/ChatComp.vue";
</script>