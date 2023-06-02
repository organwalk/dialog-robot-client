<template>
    <el-card :body-style="{padding:'10px'}"
             shadow="never"
             class="robot-chat-bubble">
        <span style="line-height: 1.5;" v-html="robotReply"/>
    </el-card>
</template>

<script setup>
import robotReplyConfig from '@/optionConfig/robot-reply.json'
import {reactive, ref} from "vue";

const orderType = ref("TxtMsg")
const robotReplyObject = reactive(robotReplyConfig)
const robotReply = ref(robotReplyObject[orderType.value])


</script>

<style scoped>
.robot-chat-bubble {
    animation: robot-chat-bubble 0.5s ease-out;
    border-radius: 10px;
}

@keyframes robot-chat-bubble {
    0% {
        opacity: 0;
        transform: translateX(-30%) translateY(50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translateX(0) translateY(0) scale(1);
    }
}
</style>