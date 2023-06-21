<template>
    <el-card style="background-color: #333333;border-radius: 15px 15px 0 0 ;" :body-style="{padding:'10px'}">
        <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="center">
            </el-col>
            <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" align="center">
                <span class="head-text">Xeno-Loader</span>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                <el-button :icon=" ArrowRight " style="font-weight: bolder;font-family: 微软雅黑" size="large" color="#333" round @click="logout()">Log out</el-button>
            </el-col>
        </el-row>
    </el-card>


</template>

<script setup>
import {ArrowRight} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {release} from "@/api/server/data";

function logout(){
    ElMessage({
        message: '正在销毁本地Token并释放服务资源',
        type: 'warning',
    })
    release().then(res=>{
        if (res.data.success){
            setTimeout(()=>{
                sessionStorage.clear()
            },1500)
            //如果销毁请求成功
            setTimeout(()=>{
                ElMessage({
                    message: '操作成功，退出登录',
                    type: 'success',
                })
            },2000)
            //返回登录页面
            setTimeout(function(){
                window.location.href = "/auth"
            }, 2500);
        }
    })
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