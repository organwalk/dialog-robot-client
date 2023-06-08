<template>
    <el-card class="chatContainer" :scrollTop="state.containerScrollTop" shadow="never"
             style="border: none; background-color: #f7f7f7;height: 570px;overflow-y: auto">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <span style="font-size: 10px;color: #B5B8C0;font-weight: bolder" v-if="state.showToDay">{{ state.toDay }}</span>
            </el-col>
        </el-row>
        <br/>
        <!--        展示推荐指令      -->
        <RecommendComp v-if="state.showRecommend" @send-recommend-text="getRecommendText"/>
        <div v-for="(item,index) in state.chatMessages" :key="index">
            <el-row v-if="!state.showRecommend && item.type === 'user'" justify="end" style="padding-left: 10%">
                <!-- 用户 -->
                <el-card shadow="never" class="user-chat-bubble"
                         :body-style="{padding:'10px'}"
                         align="left">
                    <span style="line-height: 1.5;color: white" v-html="item.message"/>
                </el-card>
            </el-row>
            <el-row v-if="item.type === 'robot'" style="padding-right: 10%">
                <!-- 对话机器人 -->
                <!--                语言回复        -->
                <robot-reply :order-type="state.orderType"
                             :empty-keys-list="state.emptyKeysList"
                             :card-status="state.cardStatus"
                             :status="state.messageStatus"
                             :msg="item.message"
                             @send-miss-value-type="getMissValueType"
                             @send-loading = "getLoading"
                             @show-recommend="dontShowRec"/>
            </el-row><br/>
        </div>
        <el-row v-if="loading">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card :body-style="{padding:'0'}" shadow="never" style="border: none;background-color:#f7f7f7;">
                    <span style="font-size: 10px;font-family: 微软雅黑,serif;user-select: none;">Responding...</span>
                </el-card>
            </el-col>
        </el-row>
        <!--        在对话下展示推荐指令  -->
        <el-row v-if="state.showRecommendTip" style="margin-top: -1%">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                <el-button v-for="(recommend,index) in state.recommendList" :key="index"
                           @click="getRecommendTip(recommend)"
                           style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom:10px;margin-left:0;width: 100%"
                           round>
                    <span v-html="recommend"/>
                </el-button>
            </el-col>
        </el-row>
    </el-card>
    <ChatInputComp
        @user-input="onUserInput"
        @res-order-type="getOrderType"
        @send-empty-keys-list="getEmptyKeysList"
        @send-card-status="getCardStatus"
        @send-status="getMessageStatus"
        @reply-robot = 'getReplyStatus'
        :recommend = "state.recommendText"
        :missing-value="state.missValueType"/>
</template>

<script setup>
import ChatInputComp from "@/components/chat/chatContainer/chat-input-comp.vue";
import RobotReply from "@/components/chat/chatContainer/robot-reply-c.vue";
import RecommendComp from "@/components/chat/chatContainer/RecommendComp.vue";
import recommendsData from "@/optionConfig/recommendText.json";
import {nextTick, reactive, ref} from "vue";

const state = reactive({
    toDay: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    showRecommend: true,
    showRecommendTip: true,
    showToDay: false,
    chatMessages: [],
    containerScrollTop: 0,
    recommendList: [],
    randomIndexes: new Set(),
    messageStatus: '',
    typeStatus: false,
    orderType: '',
    emptyKeysList: [],
    missValueType: '',
    cardStatus: '',
    recommendText:'',
    dontShowRec: true
})

const loading = ref(false)
//  用户输入
const onUserInput = (userInput) => {
    // 当用户输入时,隐藏初始推荐输入卡片,显示今日日期
    if (userInput !== '') {
        state.showToDay = true
        state.showRecommend = false
        state.showRecommendTip = false
        // 显示用户输入
        state.chatMessages.push({
            type: 'user',
            message: userInput
        })
        loading.value = true
        scrollBottom() //自动滚动至聊天容器底部
    }
}

 // 机器人回复
let id = 1
const getReplyStatus = (val) => {
    state.typeStatus = val
    if (state.typeStatus) {
        state.chatMessages.push({
            type: 'robot',
            message: id ++
        })
        loading.value = false
        state.showRecommendTip = true
        scrollBottom()
    }
}

const scrollBottom = () => {
    nextTick(() => {
        const chatContainer = document.querySelector('.chatContainer')
        state.containerScrollTop = chatContainer.scrollHeight - chatContainer.clientHeight
    })
}

const getRecommendList = () => {
    state.randomIndexes.clear();
    state.recommendList = [];
    while (state.randomIndexes.size < 3) {
        state.randomIndexes.add(Math.floor(Math.random() * recommendsData.length));
    }
    for (const index of state.randomIndexes) {
        state.recommendList.push(recommendsData[index].recommend);
    }
}


//  接收用户发送事件的数据
const getOrderType = (val) => {
    state.orderType = val
}
const getEmptyKeysList = (val) => {
    state.emptyKeysList = val
}
const getCardStatus = (val) => {
    state.cardStatus = val
}
const getMessageStatus = (val) => {
    state.messageStatus = val
}

//  接收机器人回复事件中的数据
const getMissValueType = (val) => {
    state.missValueType = val
}

const dontShowRec = (val) => {
    state.dontShowRec = val
    if (val){
        setTimeout(()=>{
            getRecommendList()
        },1000)
    }
}

const getLoading = (val) => {
    loading.value = val
}

//  推荐卡片
const getRecommendText = (val) => {
    state.showRecommend = val
    state.recommendText = val
}

const getRecommendTip = (recommend) => {
    state.showToDay = true
    state.recommendText = recommend
}

</script>

<style scoped>
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