<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <component
                    :is="cardComponent"
            />
        </el-col>
    </el-row>
    <el-card shadow="never"
             :body-style="{padding:'10px'}"
             class="robot-chat-bubble"
             v-if="!cardStatus">
        <span v-html="robotReply"/>
    </el-card>
</template>

<script setup>
import robotReplyConfig from '@/optionConfig/robot-reply.json'
import {ref, defineProps, defineEmits, watch, computed, onMounted} from "vue";
import {useStore} from "vuex";
import {getUserDept, getUserDetail} from '@/api/cloud/manage-person'
import OaMessageComp from "@/components/chat/interactiveCard/oa-message/OaMessageComp.vue";
import ScheduleListComp from "@/components/chat/interactiveCard/scheduleList/ScheduleListComp.vue";
import CreateSchedule from "@/components/chat/interactiveCard/createSchedule/Create-Updata-ScheduleComp.vue";
import UpdataEmployeeComp from "@/components/chat/interactiveCard/manageEmployee/UpdataEmployeeComp.vue";
import NotificationListComp from "@/components/chat/interactiveCard/notificationList/NotificationListComp.vue";
import CreateNotification
    from "@/components/chat/interactiveCard/createNotification/Create-Updata-NotificationComp.vue";

//  定义状态值接收器
const props = defineProps({
    status: String,
    orderType: String,
    emptyKeysList: Array,
    cardStatus: String
})

//  初始化状态
const status = computed(() => props.status)
const missValue = ref(null)
const orderType = computed(() => props.orderType)
const emptyKeysList = computed(() => props.emptyKeysList)
const cardStatus = computed(() => props.cardStatus)

/** 定义提交事件和状态管理
 * 提交‘展示推荐卡片’、‘缺失值Key’
 * @type {EmitFn<(string)[]>}
 */
const emit = defineEmits(['showRecommend', 'send-miss-value-type'])
const store = useStore()

console.log(cardStatus.value)

//  初始化文字回复
const robotReply = ref('')

//  定义总体回复状态机
const getReply = () => {
    switch (status.value) {
        case 'initial':
            robotReply.value = getInitialReply()
            break;
        case 'missValue':
            emit('send-miss-value-type', emptyKeysList.value[0])
            missValue.value = emptyKeysList.value[0]
            robotReply.value = getMissValueReply()
            break;
        case 'orderType':
            robotReply.value = getOrderTypeReply()
            break;
        case 'cardInteraction':
            robotReply.value = getCardStatusReply()
            break;
    }
}
onMounted(() => {
    getReply()
    emitShowRecommend() //回复时展示推荐卡片
})
watch(status, () => {
    getReply()
})

//  定义不同类别卡片回复状态机
const cardComponent = computed(() => {
    switch (cardStatus.value) {
        case 'OAMsg':
            return OaMessageComp
        case 'ModMan':
            return UpdataEmployeeComp
        case 'GetPlan':
            return ScheduleListComp
        case 'AddPlan':
            return CreateSchedule
        case 'GetNotes':
            return NotificationListComp
        case 'AddNote':
            return CreateNotification
        default:
            return ''
    }
})

//  详细定义回复状态机内的调用方法
const getInitialReply = () => {
    return robotReplyConfig.OrderTypeNull
}

const getMissValueReply = () => {
    //发送缺失值key
    emit('send-miss-value-type', missValue.value)
    return robotReplyConfig[missValue.value + 'Missing'];
}

const getOrderTypeReply = () => {
    const template = robotReplyConfig[orderType.value]
    let reply = template

    //获取人员详情
    if (orderType.value === 'GetManDept') {
        const userName = store.state.chat.searchUid.name;
        const deptName = store.state.chat.searchUid.dept
        robotReply.value = reply.replace(/\${userName}/g, userName).replace(/\${deptName}/g, deptName.join("、"));
        let refresh = ''
        store.dispatch('updataSearchUid', refresh)
        store.dispatch('updataMissingKeyObj', {})
    } else if (orderType.value === 'GetMan') {
        let userId
        if (store.state.chat.missingKeyObj.name.uid) {
            userId = store.state.chat.missingKeyObj.name.uid
        } else {
            userId = store.state.chat.missingKeyObj.name[0]
        }
        const deptId = store.state.chat.missingKeyObj.dept
        getUserDetail(userId, deptId).then(res => {
            const userName = res.data.data.user.name
            let job
            if (job === undefined) {
                job = "暂未设置"
            } else {
                job = res.data.data.user.title
            }
            const mobile = res.data.data.user.mobile
            getUserDept(userId).then(res => {
                const deptName = res.data.data.map(item => item.name)
                robotReply.value = reply.replace(/\${userName}/g, userName)
                    .replace(/\${deptName}/g, deptName)
                    .replace(/\${job}/g, job)
                    .replace(/\${mobile}/g, mobile)
                store.dispatch('updataMissingKeyObj', {})
            })
        })
    } else {
        reply = template
    }
    store.dispatch('updataMissingKeyObj', {})
    return reply
}

const getCardStatusReply = () => {
    const reply = robotReplyConfig[cardStatus.value]
    // 卡片回复完成后重置回复状态与卡片状态
    status.value = 'initial'
    cardStatus.value = ''
    emitShowRecommend()
    return reply
}

const emitShowRecommend = () => {
    emit('showRecommend', !cardStatus.value)
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