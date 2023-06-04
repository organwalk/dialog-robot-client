<template>
    <el-row v-if="cardStatus === 'OA'" >
        <!--                发送OA消息  -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <OaMessageComp @send-success="getOASuccess"/>
        </el-col>
    </el-row>
    <el-row v-if="cardStatus === 'GetPlan'">
        <!--                查看日程卡片      -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <ScheduleListComp />
        </el-col>
    </el-row>
    <el-row v-if="cardStatus === 'AddPlan'">
        <!--                创建日程卡片      -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <CreateSchedule />
        </el-col>
    </el-row>
    <el-row v-if="!cardStatus">
        <el-card :body-style="{padding:'10px'}"
                 shadow="never"
                 class="robot-chat-bubble">
            <span style="line-height: 1.5;" v-html="robotReply"/>
        </el-card>
    </el-row>
</template>

<script setup>
import robotReplyConfig from '@/optionConfig/robot-reply.json'
import {reactive, ref, defineProps, defineEmits, watch} from "vue";
import {useStore} from "vuex";
import OaMessageComp from "@/components/chat/interactiveCard/oa-message/OaMessageComp.vue";
import ScheduleListComp from "@/components/chat/interactiveCard/scheduleList/ScheduleListComp.vue";
import CreateSchedule from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";

const props = defineProps({
    orderType:String,
    emptyKeysList:Array,
    cardStatus:String
})
const emit = defineEmits(['sendMissValueType','showRecommend'])
const store = useStore()
const robotReplyObject = reactive(robotReplyConfig)
const robotReply = ref('')
const cardStatus = ref(props.cardStatus)
const showRec = false

// 如果有卡片式或处于追问环境，则取消推荐卡片的显示
if (cardStatus.value){
    emit('showRecommend',showRec)
}

//如果意图不明则恳请用户重新输入
if (props.orderType === ''){
    robotReply.value = (robotReplyObject["OrderTypeNull"])
}else {
    //如果意图明确，则判断其对话是否含有空缺值
    //如果有空缺值则返回相应问句要求其输入
    if (props.emptyKeysList.length > 0){
        emit('showRecommend',showRec)
        emit('sendMissValueType', props.emptyKeysList[0])
        //根据构词设计，缺失值问询语句由"缺失字段名 + Missing"构成
        robotReply.value = (robotReplyObject[props.emptyKeysList[0]+"Missing"])
    }else {
        robotReply.value = (robotReplyObject[props.orderType])
        let refreshObj = {}
        store.dispatch('updataMissingKeyObj',refreshObj)
    }
}

watch(cardStatus,(newVal)=>{
    if (!newVal){
        setTimeout(()=>{
            emit('showRecommend',!showRec)
        },1500)
    }
})
const getOASuccess = (val)=>{
    if (val){
        setTimeout(()=>{
            cardStatus.value=''
        },1500)
        robotReply.value = (robotReplyObject['OAMsg'])
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
</style>