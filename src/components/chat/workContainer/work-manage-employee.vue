<template>
    <el-card shadow="never" style="border-radius: 5px;">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <img style="width: 50%" src="@/assets/manage.png" alt="404">
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-button style="width: 100%" color="#333" :icon="ScaleToOriginal" @click="createManage()">管理部门人员</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {ScaleToOriginal} from "@element-plus/icons-vue";
import {useStore} from "vuex";

const store = useStore()
const createManage = () => {
    store.dispatch('updataCreateStatus','manage')
}
</script>

<style scoped>

</style>