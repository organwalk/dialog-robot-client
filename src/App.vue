<template>
    <div style="width: 100%;height: 100%;">
        <router-view/>
    </div>
</template>

<script setup>
import {getAccessToken} from "@/api/cloud/auth";
import {onMounted} from "vue";

onMounted(()=>{
    const refreshAccessToken = () => {
        getAccessToken().then(res => {
            const accessToken = res.data.data.accessToken;
            sessionStorage.setItem("accessToken", accessToken);
            // 计算access token的过期时间，提前5分钟刷新
            const expiresIn = res.data.data.expiresIn - 5 * 60;
            setTimeout(refreshAccessToken, expiresIn * 1000);
        })
    };

    refreshAccessToken();
})

</script>

<style>
body html{
    width: 100%;
    height: 100%;
}
::-webkit-scrollbar {
    display: none;
}
</style>
