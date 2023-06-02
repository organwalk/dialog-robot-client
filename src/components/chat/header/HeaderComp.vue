<template>
    <el-card style="background-color: #333333;border-radius: 15px 15px 0 0 ;" :body-style="{padding:'10px'}">
        <el-row>
            <el-col :xs="8" :sm="6" :md="4" :lg="20" :xl="1">
                <span class="head-text">Xeno-Loader</span>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="1" align="right">
                <el-button :icon=" ArrowRight " size="large" color="#333" round @click="logout()">Log out</el-button>
            </el-col>
        </el-row>
    </el-card>


</template>

<script setup>
import {ArrowRight} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

function logout(){
    ElMessage({
        message: '正在销毁本地Token并释放服务资源',
        type: 'warning',
    })
    //如果销毁请求成功
    ElMessage({
        message: '操作成功，退出登录',
        type: 'success',
    })
    //返回登录页面
    setTimeout(function(){
        window.location.href = "/auth"
    }, 2000);
}

</script>

<style scoped>
.head-text{
    font-size: 25px;
    font-weight: bolder;
    color: white;
    margin-left: 10px;
}
</style>