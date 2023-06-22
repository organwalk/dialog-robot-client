<template>
    <el-card shadow="never" class="history" style="border-top: none;border-bottom: none;border-radius: 0" >
        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card shadow="never" style="border-radius: 10px">
                    <el-row>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" align="center" style="display:flex;justify-content: center">
                            <el-card shadow="never" style="display: flex;align-items: center;border: none">
                                <span style="font-size: 20px;font-weight: bolder;user-select: none;font-family: 微软雅黑,serif">Working</span>
                            </el-card>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                            <el-card shadow="never" style="border: none">
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <el-button  size="large" :icon="ChatDotRound" circle :color="chat" @click="onChat" v-btn></el-button>
                                    </el-col>
                                </el-row><br/>
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <el-button  size="large" :icon="Monitor" circle :color="work" @click="onWork" v-btn></el-button>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </el-card>

</template>

<script setup>
import { ChatDotRound,Monitor } from '@element-plus/icons-vue'
import {ref,defineEmits} from "vue";

const chat = ref('#2C6AE3')
const work = ref('')
const emit = defineEmits(['getTabStatus'])

const onChat = () => {
    chat.value = '#2C6AE3'
    work.value = ''
    emit('getTabStatus','chat')
}

const onWork = () => {
    chat.value = ''
    work.value = '#2C6AE3'
    emit('getTabStatus','work')
}
</script>

<style scoped>

</style>