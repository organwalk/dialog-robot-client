<template>
    <el-row v-if="cardStatus === 'OA'" >
        <!--                发送OA消息  -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <OaMessageComp @send-success="getOASuccess"/>
        </el-col>
    </el-row>
    <el-row v-if="cardStatus === 'ModMan'" >
        <!--                部门人员管理  -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <UpdataEmployeeComp />
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
            <CreateSchedule @get-schedule-status="getScheduleSuccess"/>
        </el-col>
    </el-row>
    <el-row v-if="cardStatus === 'GetNotes'">
        <!--                查看事项告知卡片    -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <NotificationListComp/>
        </el-col>
    </el-row>
    <el-row v-if="cardStatus === 'AddNote'">
        <!--                创建事项卡片  -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <CreateNotification />
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
import UpdataEmployeeComp from "@/components/chat/interactiveCard/manageEmployee/UpdataEmployeeComp.vue";
import {getUserDept} from "@/api/cloud/manage-person";
import NotificationListComp from "@/components/chat/interactiveCard/notificationList/NotificationListComp.vue";
import CreateNotification
    from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue";

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

// 如果有卡片式消息或处于追问环境，则取消推荐卡片的显示
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
        emit('showRecommend',showRec)//此时应该禁止推荐卡片的显示
        emit('sendMissValueType', props.emptyKeysList[0])//应该持续发送空缺值
        //根据构词设计，缺失值问询语句由"缺失字段名 + Missing"构成
        robotReply.value = (robotReplyObject[props.emptyKeysList[0]+"Missing"])
    }else {
        if (props.orderType === 'GetManDept'){
            const replyTemplate = robotReplyObject[props.orderType];
            const userName = store.state.chat.searchUid.name;
            getUserDept(store.state.chat.searchUid.uid).then(res => {
                const deptName = res.data.data;
                const deptNames = deptName.map(item => item.name);
                robotReply.value = replyTemplate.replace(/\${userName}/g, userName).replace(/\${deptName}/g, deptNames.join("、"));
                let refresh = ''
                store.dispatch('updataSearchUid',refresh)
            })
        }
        else if (props.orderType === 'GetMan'){
            const replyTemplate = robotReplyObject[props.orderType];
            // const userName = store.state.chat.searchUid.name;
            // const deptName = store.state.chat.searchUid.deptName;
            const userName = "张豪";
            const deptName = "玩原神玩的";
            const job = "开发"
            const mobile = "18318924383"
            robotReply.value = replyTemplate.replace(/\${userName}/g, userName)
                .replace(/\${deptName}/g,deptName)
                .replace(/\${job}/g,job)
                .replace(/\${mobile}/g,mobile)

        }
        else {
            robotReply.value = (robotReplyObject[props.orderType])
            let refreshObj = {}
            store.dispatch('updataMissingKeyObj',refreshObj)
        }
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

const getScheduleSuccess = (val)=>{
    if (val){
        setTimeout(()=>{
            cardStatus.value=''
        },1500)
        robotReply.value = (robotReplyObject['AddPlan'])
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