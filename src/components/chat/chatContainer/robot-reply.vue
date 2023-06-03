<template>
    <el-row>
        <el-card :body-style="{padding:'10px'}"
                 shadow="never"
                 class="robot-chat-bubble">
            <span style="line-height: 1.5;" v-html="robotReply"/>
        </el-card>
    </el-row>
</template>

<script setup>
import robotReplyConfig from '@/optionConfig/robot-reply.json'
import {reactive, ref, defineProps,defineEmits} from "vue";
import {useStore} from "vuex";

const props = defineProps({
    orderType:String,
    emptyKeysList:Array
})
const emit = defineEmits(['sendMissValueType'])
const store = useStore()
const robotReplyObject = reactive(robotReplyConfig)
const robotReply = ref('')

//如果意图不明则恳请用户重新输入
if (props.orderType === ''){
    robotReply.value = (robotReplyObject["OrderTypeNull"])
}else {
    //如果意图明确，则判断其对话是否含有空缺值
    //如果有空缺值则返回相应问句要求其输入
    if (props.emptyKeysList.length > 0){
        //根据构词设计，缺失值问询语句由"缺失字段名 + Missing"构成
        console.log(props.emptyKeysList)
        emit('sendMissValueType', props.emptyKeysList[0])
        robotReply.value = (robotReplyObject[props.emptyKeysList[0]+"Missing"])
    }else {
        robotReply.value = (robotReplyObject[props.orderType])
        let refreshObj = {}
        store.dispatch('updataMissingKeyObj',refreshObj)
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