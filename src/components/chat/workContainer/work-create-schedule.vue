<template>
    <el-card shadow="never" style="border-radius: 5px;">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <img style="width: 60%" src="@/assets/create_schedule.png" alt="404">
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-button style="width: 100%" color="#333" :icon="Clock" @click="createSchedule()">创建日程</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {Clock} from "@element-plus/icons-vue";
import {useStore} from "vuex";

const store = useStore()
const createSchedule = () => {
    store.dispatch('updataCreateStatus','schedule')
}
</script>

<style scoped>

</style>