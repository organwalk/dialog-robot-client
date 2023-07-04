<template>
    <el-card class="chatContainer" :scrollTop="state.containerScrollTop" shadow="never"
             style="border: none; background-color: #f7f7f7;height: calc(100% - 119.5px);overflow-y: auto;border-radius: 0">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <span style="font-size: 10px;color: #B5B8C0;font-weight: bolder" v-if="state.showToDay">{{
                    state.toDay
                    }}</span>
            </el-col>
        </el-row>
        <br/>
        <!--        展示推荐指令      -->
        <RecommendComp v-if="state.showRecommend" @send-recommend-text="getRecommendText"/>
        <div v-for="(item,index) in state.chatMessages" :key="index">
            <el-row v-if="item.type === 'line'" align="middle">
                <el-col :xs="10" :sm="9" :md="10" :lg="10" :xl="10" align="left">
                    <div style="height:1px;background-color: #CDD0D6"/>
                </el-col>
                <el-col :xs="4" :sm="6" :md="4" :lg="4" :xl="4" align="center">
                    <span style="font-size: 10px;color: #909399">{{ item.message }}</span>
                </el-col>
                <el-col :xs="10" :sm="9" :md="10" :lg="10" :xl="10" align="right">
                    <div style="height:1px;background-color: #CDD0D6"/>
                </el-col>
            </el-row>
            <el-row v-if="!state.showRecommend && item.type === 'user' && checkImage(item.message) && checkVoice(item.message)" justify="end" style="padding-left: 10%">
                <!-- 用户 -->
                <el-card shadow="never" class="user-chat-bubble"
                         :body-style="{padding:'10px'}"
                         align="left">
                    <span style="line-height: 1.5;color: white" v-html="item.message"/>
                </el-card>
            </el-row>
            <el-row v-if="item.type === 'image'">
                <!--图片-->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                    <el-image style="width: 30%;border-radius: 15px;border: 1px solid var(--el-border-color);"
                              :src="item.message" />
                </el-col>
            </el-row>
            <el-row v-if="item.type === 'voice'">
                <!--语音-->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                    <el-button style="width: auto;min-width: 100px;" color="#2C6AE3" :icon="VideoPlay" size="large" @click="playVoice(item.message.url)" round>
                        {{item.message.time}} ''
                    </el-button>
                </el-col>
            </el-row>
            <el-row v-if="item.type === 'robot'" style="padding-right: 10%">
                <!-- 对话机器人 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                    <robot-reply :order-type="state.orderType"
                                 :empty-keys-list="state.emptyKeysList"
                                 :card-status="state.cardStatus"
                                 :status="state.messageStatus"
                                 :msg="item.message"
                                 @send-miss-value-type="getMissValueType"
                                 @send-loading="getLoading"
                                 @show-recommend="dontShowRec"
                                 @show-object-rec="showObjectRec"/>
                </el-col>
            </el-row>
            <br/>
        </div>
        <el-row v-if="loading">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card :body-style="{padding:'0'}" shadow="never" style="border: none;background-color:#f7f7f7;">
                    <span style="font-size: 10px;font-family: 微软雅黑,serif;user-select: none;">Responding...</span>
                </el-card>
            </el-col>
        </el-row>
<!--        问询操作对象时推荐-->
        <el-row style="margin-top: -4%" v-if="state.showObjectNameFromRec">
            <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" align="left">
                <el-tooltip
                    effect="dark"
                    content="为您推荐"
                    placement="bottom"
                >
                    <el-button :icon="More" circle v-btn/>
                </el-tooltip>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"
                    v-for="(item,index) in objectRecommend.slice(0,3)"
                    :key="index"
            >
                <el-button style="width: 95%;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                           round v-btn @click="sendObjectNameToInput(item.name)">
                    {{ item.name }}
                </el-button>
            </el-col>
        </el-row>
        <!--        在对话下展示推荐指令  -->
        <el-row v-if="state.showRecommendTip || state.dontShowRec" style="margin-top: -1%">
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
            @reply-robot='getReplyStatus'
            @clear-chat="clearChat"
            @image-url="imageUrl"
            @voice-info="voiceInfo"
            :res-over="state.resOver"
            :recommend="state.recommendText"
            :object-name-from-rec="state.objectNameFromRec"
            :missing-value="state.missValueType"/>
</template>

<script setup>
import ChatInputComp from "@/components/chat/chatContainer/chat-input-comp.vue";
import RobotReply from "@/components/chat/chatContainer/robot-reply-c.vue";
import RecommendComp from "@/components/chat/chatContainer/RecommendComp.vue";
import recommendsData from "@/optionConfig/recommendText.json";
import {nextTick, reactive, ref} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import {VideoPlay,More} from '@element-plus/icons-vue'
import {playRecording, playRecordingPause} from "@/optionConfig/voice-function";
import {getDeptList, getPersonDept} from "@/api/cloud/manage-person";

const state = reactive({
    toDay: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    showRecommend: true,    //  展示首屏推荐
    showRecommendTip: true, //  展示回复语句下的推荐
    showObjectNameFromRec: false, // 展示操作对象推荐
    showToDay: false,   //  展示顶部聊天日期
    chatMessages: [],   //  聊天记录数组
    containerScrollTop: 0,  //  滚动至聊天容器底部
    recommendList: [],  //  推荐数组
    randomIndexes: new Set(),   //  推荐数组索引
    messageStatus: '',  //  回复组件所需中”总体回复状态机“所需参数
    typeStatus: false,  //  机器人回复所用状态判定值
    orderType: '',  //  指令类型
    emptyKeysList: [],  //  空缺值数组
    missValueType: '',  //空缺值类型
    cardStatus: '', //  回复组件中所需”卡片回复状态机“所需参数
    recommendText: '',  //  推荐语句
    objectNameFromRec: '', // 推荐人名
    imageUrl: '',    //图片url
    voiceUrl:'',//录音文件Url
    duration:Number,//时长
    resOver: false,  //  未响应完成不可进行提交事件
    dontShowRec: true   //  不展示推荐卡片
})

const loading = ref(false)  //  加载语句
//  用户输入
const onUserInput = (userInput) => {
    // 当用户输入时,隐藏初始推荐输入卡片,显示今日日期
    if (userInput !== '') {
        state.showToDay = true
        state.showRecommend = false
        state.showRecommendTip = false
        state.dontShowRec = false
        state.showObjectNameFromRec = false
        // 显示用户输入
        state.chatMessages.push({
            type: 'user',
            message: userInput
        })
        state.resOver = true
        loading.value = true
        scrollBottom() //自动滚动至聊天容器底部
    }
}

//  发送图片
const imageUrl = (val) => {
    state.imageUrl = val
    state.showToDay = true
    state.showRecommend = false
    state.showRecommendTip = false
    state.dontShowRec = false
    state.chatMessages.push({
        type: 'image',
        message: 'https://organwalk.ink/api/images/' + val
    })
    state.resOver = true
    loading.value = true
    scrollBottom()  //自动滚动至聊天容器底部
}

// 语音信息
const voiceInfo = (obj) => {
    state.voiceUrl = obj.voiceUrl
    state.duration = obj.duration
    state.showToDay = true
    state.showRecommend = false
    state.showRecommendTip = false
    state.dontShowRec = false
    state.chatMessages.push({
        type: 'voice',
        message: {
            url:'https://organwalk.ink/api/voice/' + obj.voiceUrl,
            time:obj.duration
        }
    })
    state.resOver = true
    loading.value = true
    scrollBottom()  //自动滚动至聊天容器底部
}

//  播放语音
const voiceMark = ref(1)
const playVoice= (url) => {
    if (voiceMark.value === 1){
        playRecording(url)
        voiceMark.value ++
    }else {
        playRecordingPause()
        voiceMark.value = 1
    }


}

const checkImage = (val) => {
    const reg = /https:\/\/organwalk\.ink\/api\/images\//
    return !reg.test(val)
}

const checkVoice = (val) => {
    const reg = /\.wav$/
    return !reg.test(val.voiceUrl)
}

// 机器人回复
let id = 1
const getReplyStatus = (val) => {
    state.typeStatus = val
    if (state.typeStatus) {
        state.chatMessages.push({
            type: 'robot',
            message: id++
        })
        state.resOver = false
        loading.value = false
        // state.showRecommendTip = true
        scrollBottom()
    }
}

const scrollBottom = () => {
    nextTick(() => {
        const chatContainer = document.querySelector('.chatContainer')
        state.containerScrollTop = chatContainer.scrollHeight - chatContainer.clientHeight
    })
}

// 推荐操作对象并提供点击事件
const objectRecommend = ref([])
const getObjectRecommendUserList = ( type ) => {
    objectRecommend.value = []
    if ( type === "name"){
        getPersonDept(Number(sessionStorage.getItem("deptId"))).then(res => {
            const users = res.data.data.users
            const randomIndexes = []
            while (randomIndexes.length < 3) {
                const randomIndex = Math.floor(Math.random() * users.length)
                if (!randomIndexes.includes(randomIndex)) {
                    randomIndexes.push(randomIndex)
                }
            }
            randomIndexes.forEach(index => {
                objectRecommend.value.push(users[index])
            })
        })
    }else if (type === "group"){
        getDeptList().then(res => {
            res.data.data.departments.forEach((dept) => {
                objectRecommend.value.push(dept)
                loading.value = false
            })
        })
    }
}
const sendObjectNameToInput = (name) => {
    state.objectNameFromRec = name
    state.showObjectNameFromRec = false
}
const showObjectRec = (val) => {
    state.showObjectNameFromRec = true
    getObjectRecommendUserList(val)
}

const getRecommendList = () => {
    state.randomIndexes.clear();
    state.recommendList = [];
    if (state.orderType === "SendMsg"){
        whenOrderTypeIsSendMsg()
    } else if (/\w+Plan$/.test(state.orderType) ||
        state.orderType === "GetPlanByMan"){
        if (/\w+QueryPlan$/.test(state.orderType)){
            whenOrderTypeIsQueryPlan()
        }else {
            whenOrderTypeAboutPlanOrNote("plan")
        }
    } else if (/\w+QueryNotes$/.test(state.orderType)){
        whenOrderTypeIsQueryNotes()
    } else if (/\w+Note$/.test(state.orderType) ||
        state.orderType === "GetNotes" ||
        state.orderType === "GetNotesByMan" ||
        state.orderType === "FastAddNotes"){
        whenOrderTypeAboutPlanOrNote("note")
    }
    else {
        whenNormalTalking()
    }
}

const whenNormalTalking = () => {
    while (state.randomIndexes.size < 2) {
        state.randomIndexes.add(Math.floor(Math.random() * recommendsData.MsgAbout.length))
    }
    let randomRecommendIndex = new Set()
    while (randomRecommendIndex.size < 2) {
        randomRecommendIndex.add(Math.floor(Math.random() * recommendsData.recommend.length))
    }
    for (const index of state.randomIndexes) {
        state.recommendList.push(recommendsData.MsgAbout[index]);
    }
    for (const rIndex of randomRecommendIndex) {
        state.recommendList.push(recommendsData.recommend[rIndex])
    }
}
const whenOrderTypeIsSendMsg = () => {
    state.recommendList.push(recommendsData.MsgAbout[0]);
    while (state.randomIndexes.size < 3) {
        state.randomIndexes.add(Math.floor(Math.random() * (recommendsData.MsgAbout.length - 1)) + 1);
    }
    for (const index of state.randomIndexes) {
        state.recommendList.push(recommendsData.MsgAbout[index]);
    }
}

const whenOrderTypeAboutPlanOrNote = (type) => {
    let randomRecommendIndex = new Set()
    while (randomRecommendIndex.size < 2) {
        randomRecommendIndex.add(Math.floor(Math.random() * recommendsData.recommend.length))
    }
    while (state.randomIndexes.size < 1) {
        state.randomIndexes.add(Math.floor(Math.random() * recommendsData.MsgAbout.length))
    }
    for (const rIndex of randomRecommendIndex) {
        state.recommendList.push(recommendsData.recommend[rIndex])
    }
    for (const index of state.randomIndexes) {
        state.recommendList.push(recommendsData.MsgAbout[index]);
    }
    if (type === "plan"){
        getIndexOfQueryPlanByLength(1)
    }else if (type === "note"){
        getIndexOfQueryNotesByLength(1)
    }

}

const whenOrderTypeIsQueryPlan = () => {
    let type
    const chatState = store.state.chat
    if ((chatState.timeQueryPlanData === '' && state.orderType === "TimeQueryPlan") ||
        (chatState.nameQueryPlanData === '' && state.orderType === "NameQueryPlan") ||
        (chatState.contentQueryPlanData === '' && state.orderType === "ContentQueryPlan")){
        type = "Missing"
    }else {
        type = ""
    }
    if (type === "Missing") {
        getIndexOfQueryPlanByLength(3)
    } else {
        getIndexOfQueryPlanByLength(2)
    }
}

const whenOrderTypeIsQueryNotes = () => {
    getIndexOfQueryNotesByLength(2)
}

const getIndexOfQueryPlanByLength = (num) => {
    let randomIndexes = []
    let dateTimeIndexes = []
    let randomIndex
    if (num === 3){
        state.recommendList.push(recommendsData.QueryPlanAbout[1])
        while (randomIndexes.length < 3) {
            randomIndex = Math.floor(Math.random() * (recommendsData.QueryPlanAbout.length -2)) + 2;
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        while (dateTimeIndexes.length < 3) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
    } else if (num === 1){
        while (randomIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * (recommendsData.QueryPlanAbout.length -2)) + 2;
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        while (dateTimeIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
    }
    else {
        for (let i = 0; i < 2; i++) {
            state.recommendList.push(recommendsData.QueryPlanAbout[i])
        }
        while (randomIndexes.length < 2) {
            randomIndex = Math.floor(Math.random() * (recommendsData.QueryPlanAbout.length - 2)) + 2
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        while (dateTimeIndexes.length < 2) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
    }
    for (const index of randomIndexes) {
        const dateTimeElement = recommendsData.dateTime[dateTimeIndexes.pop()];
        const queryPlanElement = recommendsData.QueryPlanAbout[index];
        const recommendElement = `${dateTimeElement}${queryPlanElement}`;
        state.recommendList.push(recommendElement);
    }
}

const getIndexOfQueryNotesByLength = (num) => {
    let randomIndexes = []
    let dateTimeIndexes = []
    let randomIndex
    if (num === 2){
        for (let i = 0; i < 2; i++) {
            state.recommendList.push(recommendsData.QueryNotesAbout[i])
        }
        while (randomIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * (recommendsData.QueryNotesAbout.length - 2)) + 2
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        while (dateTimeIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
        for (const index of randomIndexes) {
            const dateTimeElement = recommendsData.dateTime[dateTimeIndexes.pop()];
            const queryNotesElement = recommendsData.QueryNotesAbout[index];
            const recommendElement = `${dateTimeElement}${queryNotesElement}`;
            state.recommendList.push(recommendElement);
        }
        while (state.randomIndexes.size < 1) {
            state.randomIndexes.add(Math.floor(Math.random() * recommendsData.QueryPlanAbout.length))
        }
        while (dateTimeIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
        for (const index of randomIndexes) {
            const dateTimeElement = recommendsData.dateTime[dateTimeIndexes.pop()];
            const queryPlanElement = recommendsData.QueryPlanAbout[index];
            const recommendElement = `${dateTimeElement}${queryPlanElement}`;
            state.recommendList.push(recommendElement);
        }
    } else if (num === 1){
        while (randomIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * (recommendsData.QueryNotesAbout.length - 2)) + 2
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        while (dateTimeIndexes.length < 1) {
            randomIndex = Math.floor(Math.random() * recommendsData.dateTime.length);
            if (!dateTimeIndexes.includes(randomIndex)) {
                dateTimeIndexes.push(randomIndex);
            }
        }
        for (const index of randomIndexes) {
            const dateTimeElement = recommendsData.dateTime[dateTimeIndexes.pop()];
            const queryNotesElement = recommendsData.QueryNotesAbout[index];
            const recommendElement = `${dateTimeElement}${queryNotesElement}`;
            state.recommendList.push(recommendElement);
        }
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
const store = useStore()
const clearChat = (val) => {
    //  开启新对话意味着清除当前的问询状态
    if (val) {
        if (state.chatMessages.length >= 2) {
            store.dispatch('updataMissingKeyObj', {})
            //  同时增加一个分割线
            state.chatMessages.push({
                type: 'line',
                message: 'Context cleared'
            })
            scrollBottom()
        } else {
            ElMessage('对话量不足以达成清除要求')
        }
    }
}

//  接收机器人回复事件中的数据
const getMissValueType = (val) => {
    state.missValueType = val
}

const dontShowRec = (val) => {
    state.dontShowRec = val
    if (val) {
        setTimeout(() => {
            getRecommendList()
        }, 1000)
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