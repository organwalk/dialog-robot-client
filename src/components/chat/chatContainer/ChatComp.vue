<template>
    <el-card class="chatContainer" :scrollTop="containerScrollTop" shadow="never"
             style="border: none; background-color: #f7f7f7;height: 520px;overflow-y: auto">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <span style="font-size: 10px;color: #B5B8C0;font-weight: bolder" v-if="showToDay">{{ toDay }}</span>
            </el-col>
        </el-row>
        <br/>
        <RecommendComp v-if="showRecommend" @send-recommend-text="getRecommendText"/>
        <div v-for="(item, index) in chatMessages" :key="index">
            <el-row v-if="item.type === 'robot'" style="padding-right: 10%">
                <!-- 对话机器人 -->
                <ScheduleListComp/>
                <el-card :body-style="{padding:'10px'}"
                    shadow="never"
                    class="robot-chat-bubble">
                    <span style="line-height: 1.5;" v-html="item.message"/>
                </el-card>
            </el-row>
            <el-row v-else justify="end" style="padding-left: 10%">
                <!-- 用户 -->
                <el-card shadow="never" class="user-chat-bubble"
                         :body-style="{padding:'10px'}"
                         align="left">
                    <span style="line-height: 1.5;color: white" v-html="item.message" />
                </el-card>
            </el-row>
            <br/>
        </div>
        <el-row v-if="showRecommendTip" style="margin-top: -1%">
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                <el-button v-for="(recommend,index) in recommendList" :key="index"
                           @click="getRecommendTip(recommend)"
                           style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom:10px;margin-left:0;width: 100%"
                           round>
                    <span v-html="recommend"/>
                </el-button>
            </el-col>
        </el-row>
    </el-card>
    <ChatInputComp @user-input="onUserInput"/>
</template>

<script setup>
import ChatInputComp from "@/components/chat/chatContainer/ChatInputComp.vue";
import RecommendComp from "@/components/chat/chatContainer/RecommendComp.vue";
import recommendsData from "@/optionConfig/recommendText.json"
import ScheduleListComp from "@/components/chat/interactiveCard/ScheduleListComp.vue";
import { nextTick, ref,} from "vue";

const toDay = ref(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
// const robotContent = ref('Hi，这里是Xeno-Loader😊，一个基于自然语言处理模型的办公助手🤓，我能辅助您完成一些简单的工作🫡。请问有什么能帮到您的吗？')
// const userContent = ref('Hi，Xeno-Loader，很高兴认识你🥰。你能帮我给John发一条应用消息吗？告诉它今天上午10点有一个会议。')
const showRecommend = ref(true)
const showRecommendTip = ref(true)
const showToDay = ref(false)

const chatMessages = ref([]);
const containerScrollTop = ref(0)
const recommendList = ref([])
const randomIndexes = new Set();

const getRecommendText = (recommend) => {
    showToDay.value = true
    onUserInput(recommend)
}

const getRecommendTip = (recommend) => {
    showToDay.value = true
    onUserInput(recommend)
}

const onUserInput = (userInput) => {
    if (userInput !== '') {
        showToDay.value = true
        showRecommend.value = false
        showRecommendTip.value = false
        const newRandomNumber = Math.floor(Math.random() * 100);
        chatMessages.value.push({
            type: 'user',
            message: userInput
        });
        scrollBottom()
        setTimeout(() => {
            chatMessages.value.push({
                type: 'robot',
                message: `好的，我已经成功帮您执行了这个任务😊。你还需要我帮你做别的事情吗？😝没事的，全都可以交给我🥰<br/>您的指令:${userInput}<br/>随机数编号：${newRandomNumber}`
            })
            scrollBottom()
        }, 2000)
        setTimeout(() => {
            showRecommendTip.value = true
            getRecommendList()
            scrollBottom()
        }, 2500)

    }
};
const scrollBottom = () => {
    nextTick(() => {
        const chatContainer = document.querySelector('.chatContainer')
        containerScrollTop.value = chatContainer.scrollHeight - chatContainer.clientHeight
    })
}

const getRecommendList = () => {
    randomIndexes.clear();
    recommendList.value = [];
    while (randomIndexes.size < 3) {
        randomIndexes.add(Math.floor(Math.random() * recommendsData.length));
    }
    for (const index of randomIndexes) {
        recommendList.value.push(recommendsData[index].recommend);
    }
}


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

.user-chat-bubble {
    animation: user-chat-bubble 0.5s ease-out;
    border-radius: 10px;
    background-color: #2C6AE3;
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