<template>
    <el-card shadow="never"
             :body-style="{padding:'10px'}"
             class="robot-chat-bubble"
             style="display: inline-block;line-height: 1.5;"
             v-if="robotReply">
        <span v-html="robotReply"/>
    </el-card><br/><br/>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
            <component
                :is="component"
            />
        </el-col>
    </el-row>
</template>

<script setup>
import robotReplyConfig from '@/optionConfig/robot-reply.json'
import {ref, defineProps, defineEmits, computed, onMounted} from "vue";
import {useStore} from "vuex";
import {getUserDept, getUserDetail} from '@/api/cloud/manage-person'
import OaMessageComp from "@/components/chat/interactiveCard/oa-message/OaMessageComp.vue";
import ScheduleListComp from "@/components/chat/interactiveCard/scheduleList/ScheduleListView.vue";
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
    cardStatus: String,
    msg:Number
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
const emit = defineEmits(['showRecommend', 'send-miss-value-type','send-loading'])
const store = useStore()

//  初始化文字回复
const robotReply = ref('')

//  定义总体回复状态机
const getReply = () => {
    emit('send-loading',false)
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

onMounted(()=>{
    getReply()
    cardComponent()
})

//  定义不同类别卡片回复状态机
const component = ref()
const cardComponent = () => {
    switch (cardStatus.value) {
        case 'OAMsg':
            component.value =  OaMessageComp
            break
        case 'ModMan':
            component.value =  UpdataEmployeeComp
            break
        case 'GetPlan':
            component.value = ScheduleListComp
            break
        case 'GetPlanByMan':
            component.value = ScheduleListComp
            break
        case 'AddPlan':
            component.value = CreateSchedule
            break
        case 'ModPlan':
            component.value = ScheduleListComp
            break
        case 'GetNotes':
            component.value = NotificationListComp
            break
        case 'GetNotesByMan':
            component.value = NotificationListComp
            break
        case 'ModNote':
            component.value = NotificationListComp
            break
        case 'AddNote':
            component.value = CreateNotification
            break
        default:
            return null
    }
}

//  详细定义回复状态机内的调用方法
const getInitialReply = () => {
    return robotReplyConfig.OrderTypeNull
}

const getMissValueReply = () => {
    //发送缺失值key
    emit('send-miss-value-type', missValue.value)
    emit('showRecommend', !missValue.value)
    return robotReplyConfig[missValue.value + 'Missing'];
}

const getOrderTypeReply = () => {
    const template = robotReplyConfig[orderType.value]
    let reply = template

    //获取人员详情
    if (orderType.value === 'GetManDept') {
        const uid = store.state.chat.searchUid.uid
        const userName= store.state.chat.searchUid.name
        getUserDept(uid).then(res => {
            const deptName = res.data.data.map(item => item.name)
            robotReply.value = reply.replace(/\${userName}/g, userName).replace(/\${deptName}/g, deptName.join("、"));
            let refresh = ''
            store.dispatch('updataSearchUid', refresh)
            store.dispatch('updataMissingKeyObj', {})
        })
    } else if (orderType.value === 'GetMan') {
        let userId
        if (store.state.chat.missingKeyObj) {
            if (store.state.chat.missingKeyObj.name.uid){
                userId = store.state.chat.missingKeyObj.name.uid
            }else {
                userId = store.state.chat.missingKeyObj.name[0]
            }
            const deptId = store.state.chat.missingKeyObj.dept
            getUserDetail(userId, deptId).then(res => {
                const userName = res.data.data.user.name
                let job
                if (res.data.data.user.title === undefined) {
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
        }
    } else {
        reply = template
    }
    emit('showRecommend', reply)
    store.dispatch('updataMissingKeyObj', {})
    return reply
}

const getCardStatusReply = () => {
    const reply = robotReplyConfig[cardStatus.value]
    emitShowRecommend()
    store.dispatch('updataCardSuccessReply',{})
    return reply
}

const emitShowRecommend = () => {
    emit('showRecommend', cardStatus.value)
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