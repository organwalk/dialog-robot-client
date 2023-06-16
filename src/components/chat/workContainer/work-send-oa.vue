<template>
    <el-card shadow="never" style="border-radius: 5px;">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <img style="width: 80%" src="@/assets/send_oa.png" alt="404">
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-button style="width: 100%" color="#333" :icon="ChatLineRound" @click="createOA()">发送OA消息</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {ChatLineRound} from "@element-plus/icons-vue";
import {useStore} from "vuex";

const store = useStore()
const createOA = () => {
    store.dispatch('updataCreateStatus','oa')
}
</script>

<style scoped>

</style>