<template>
    <el-card class="bubble" shadow="never" style="width: 50%;margin-bottom: 10px;border-radius: 15px;background-color: white;">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <img src="@/assets/schedule-list.png" style="width: 80%;" alt="not image"/>
            </el-col>
        </el-row><br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card shadow="never" style="width: 85%;border: none;background-color: #F2F3F5;border-radius: 10px">
                    <el-row>
                        <el-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19" align="left">
                            <span style="font-weight: bolder;user-select: none">Schedule</span>
                        </el-col>
                        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" align="right">
                            <el-button type="primary" :icon="ArrowRight" circle @click="confirm()" size="small" />
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row><br/>
    </el-card>

</template>

<script setup>
import {defineEmits} from 'vue'
import {ArrowRight} from "@element-plus/icons-vue";
const emit = defineEmits(['sendConfirm'])
const confirm = ()=>{
    emit('sendConfirm',true)
}
</script>

<style scoped>
.bubble {
    animation: robot-chat-bubble 0.5s ease-out;
}

@keyframes bubble {
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