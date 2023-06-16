<template>
    <el-card shadow="never" style="border-radius: 5px">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <img style="width: 60%" src="@/assets/create_notifi.png" alt="404">
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-button style="width: 100%;" color="#333" :icon="Notification" @click="createNotifi()">创建事项告知</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {Notification} from "@element-plus/icons-vue";
import {useStore} from "vuex";

const store = useStore()
const createNotifi = () => {
    store.dispatch('updataCreateStatus','notification')
}
</script>

<style scoped>

</style>