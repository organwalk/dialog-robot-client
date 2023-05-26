<template>
    <el-card class="chatContainer" :scrollTop="containerScrollTop" shadow="never"
             style="border: none; background-color: #f7f7f7;height: 520px;overflow-y: auto">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <span style="font-size: 10px;color: #B5B8C0;font-weight: bolder">{{ toDay }}</span>
            </el-col>
        </el-row>
        <br/>

        <div v-for="(item, index) in chatMessages" :key="index">
            <el-row v-if="item.type === 'robot'">
                <!-- 对话机器人 -->
                <el-col :xs="4" :sm="6" :md="8" :lg="20" :xl="11" align="left">
                    <el-card class="robot-chat-bubble" style="border-radius: 10px;">
                        <span style="line-height: 1.5;" v-html="item.message" />
                    </el-card>
                </el-col>
                <el-col :xs="4" :sm="6" :md="8" :lg="4" :xl="11"/>
            </el-row>
            <el-row v-else>
                <!-- 用户 -->
                <el-col :xs="4" :sm="6" :md="8" :lg="4" :xl="11"/>
                <el-col :xs="4" :sm="6" :md="8" :lg="20" :xl="11" align="left">
                    <el-card class="user-chat-bubble" style="border-radius: 10px;background-color: #2C6AE3">
                        <span style="line-height: 1.5;color: white">{{ item.message }}</span>
                    </el-card>
                </el-col>
            </el-row>
            <br/>
        </div>
    </el-card>
    <ChatInputComp @user-input="onUserInput"/>
</template>

<script setup>
import ChatInputComp from "@/components/chat/chatContainer/ChatInputComp.vue";
import {nextTick, onMounted, ref} from "vue";

const toDay = ref(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
const robotContent = ref('Hi，这里是Xeno-Loader😊，一个基于自然语言处理模型的办公助手🤓，我能辅助您完成一些简单的工作🫡。请问有什么能帮到您的吗？')
// const userContent = ref('Hi，Xeno-Loader，很高兴认识你🥰。你能帮我给John发一条应用消息吗？告诉它今天上午10点有一个会议。')


const chatMessages = ref([]);
const containerScrollTop = ref(0)

onMounted(() => {
    chatMessages.value.push({type: 'robot', message: robotContent.value})
})

const onUserInput = (userInput) => {
    if (userInput !== '') {
        const newRandomNumber = Math.floor(Math.random() * 100);
        chatMessages.value.push({
            type: 'user',
            message: userInput
        });
        scrollBottom()
        setTimeout(()=>{
            chatMessages.value.push({
                type: 'robot',
                message: `好的，我已经成功帮您执行了这个任务😊。你还需要我帮你做别的事情吗？😝没事的，全都可以交给我🥰<br/>您的指令:${userInput}<br/>随机数编号：${newRandomNumber}`
            })
            scrollBottom()
        },2000)
    }
};
const scrollBottom = ()=>{
    nextTick(() => {
        const chatContainer = document.querySelector('.chatContainer')
        containerScrollTop.value = chatContainer.scrollHeight - chatContainer.clientHeight
    })
}


</script>

<style scoped>
.robot-chat-bubble {
    animation: robot-chat-bubble 0.5s ease-out;
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

.user-chat-bubble {
    animation: user-chat-bubble 0.5s ease-out;
}

@keyframes user-chat-bubble {
    0% {
        opacity: 0;
        transform: translateX(30%) translateY(50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translateX(0) translateY(0) scale(1);
    }
}

::-webkit-scrollbar {
    display: none;
}
</style>