<template>
    <el-card class="chatContainer" :scrollTop="containerScrollTop" shadow="never"
             style="border: none; background-color: #f7f7f7;height: 550px;overflow-y: auto">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                <span style="font-size: 10px;color: #B5B8C0;font-weight: bolder" v-if="showToDay">{{ toDay }}</span>
            </el-col>
        </el-row>
        <br/>
<!--        展示推荐指令      -->
        <RecommendComp v-if="showRecommend" @send-recommend-text="getRecommendText"/>
        <div v-for="(item, index) in chatMessages" :key="index">
            <el-row v-if="item.type === 'robot'" style="padding-right: 10%">
                <!-- 对话机器人 -->
                <!--                查看日程卡片      -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <ScheduleListComp v-if="showScheduleList"/>
                </el-col>
                <!--                创建日程卡片      -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <CreateSchedule v-if="showCreateSchedule" />
                </el-col>
                <!--                查看事项告知卡片    -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <NotificationListComp v-if="showNotificationList"/>
                </el-col>
                <!--                创建事项卡片  -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <CreateNotification v-if="showCreateNotification"/>
                </el-col>
                <!--                部门人员管理  -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <UpdataEmployeeComp v-if="showUpdataEmployee"/>
                </el-col>
                <!--                发送OA消息  -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <OaMessageComp v-if="showOAMessage"/>
                </el-col>
                <!--                语言回复        -->
                <robot-reply :order-type="orderType"
                             :empty-keys-list="emptyKeysList"
                             @send-miss-value-type="getMissValueType"/>
            </el-row>
            <br/>
            <el-row v-if="!showRecommend && item.type === 'user'" justify="end" style="padding-left: 10%">
                <!-- 用户 -->
                <el-card shadow="never" class="user-chat-bubble"
                         :body-style="{padding:'10px'}"
                         align="left">
                    <span style="line-height: 1.5;color: white" v-html="item.message" />
                </el-card>
            </el-row>
        </div>
<!--        在对话下展示推荐指令  -->
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
    <ChatInputComp
        @user-input="onUserInput"
        @res-order-type="getOrderType"
        @send-empty-keys-list="getEmptyKeysList"
        :missing-value="missValueType"/>
</template>

<script setup>
import ChatInputComp from "@/components/chat/chatContainer/ChatInputComp.vue";
import RecommendComp from "@/components/chat/chatContainer/RecommendComp.vue";
import ScheduleListComp from "@/components/chat/interactiveCard/scheduleList/ScheduleListComp.vue";
import CreateSchedule from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";
import recommendsData from "@/optionConfig/recommendText.json";
import {nextTick, ref} from "vue";
import NotificationListComp from "@/components/chat/interactiveCard/notificationList/NotificationListComp.vue";
import CreateNotification from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue"
import UpdataEmployeeComp from "@/components/chat/interactiveCard/manageEmployee/UpdataEmployeeComp.vue";
import OaMessageComp from "@/components/chat/interactiveCard/oa-message/OaMessageComp.vue";
import RobotReply from "@/components/chat/chatContainer/robot-reply.vue";

const toDay = ref(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
const showRecommend = ref(true)
const showRecommendTip = ref(true)
const showToDay = ref(false)
const showScheduleList = ref(false)
const showCreateSchedule = ref(false)
const showNotificationList = ref(false)
const showCreateNotification = ref(false)
const showUpdataEmployee = ref(false)
const showOAMessage = ref(false)

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
        chatMessages.value.push({
            type: 'user',
            message: userInput
        });
        scrollBottom()
        setTimeout(() => {
            chatMessages.value.push({
                type: 'robot',
                message:''
            })
            scrollBottom()
        }, 2000)
        setTimeout(() => {
            showRecommendTip.value = true
            getRecommendList()
            scrollBottom()
        }, 2500)
    }
}

const orderType = ref('')
const getOrderType = (ot) =>{
    orderType.value = ot
}

const emptyKeysList = ref([])
const getEmptyKeysList = (emptyKeys) => {
    emptyKeysList.value = emptyKeys
}

const missValueType = ref('')
const getMissValueType = (val) => {
    missValueType.value = val
}
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