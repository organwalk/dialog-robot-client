<template>
    <el-row v-show="showPageOne">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-card shadow="never" style="border-radius: 10px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-input
                                v-model="messageTitle"
                                placeholder="请输入消息标题，如：一则会议消息"
                                :prefix-icon="Position"
                                maxlength="25"
                                show-word-limit
                        />
                    </el-col>
                </el-row>
                <br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-input
                                v-model="contentTitle"
                                placeholder="请输入内容标题，如：全链路深度营销"
                                :prefix-icon="Tickets"
                                maxlength="30"
                                show-word-limit
                        />
                    </el-col>
                </el-row>
                <br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="left">
                        <el-input
                                v-model="summary"
                                placeholder="请输入消息内容概要"
                                maxlength="100"
                                show-word-limit
                                type="textarea"
                                :rows="3"
                        />
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import {ref, defineEmits, watch,defineProps} from "vue";
import {Position, Tickets} from '@element-plus/icons-vue'

defineProps({
    showPageOne:Boolean
})
const messageTitle = ref('')
const contentTitle = ref('')
const summary = ref('')

const emit = defineEmits(['sendPageOneData'])

watch(
    [messageTitle,contentTitle,summary],
    ([newMsg,newTit,newSum]) => {
        emit('sendPageOneData',newMsg,newTit,newSum)
    }
)


</script>

<style scoped>
/deep/ .el-input {
    --el-input-focus-border-color: none;

}

/deep/ .el-input__wrapper {
    box-shadow: none;
}

/deep/ .el-input__wrapper :hover {
    box-shadow: none;
}
</style>