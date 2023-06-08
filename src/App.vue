<template>
    <div style="width: 100%;height: 100%;">
        <router-view/>
    </div>
</template>

<script setup>
import {getAccessToken} from "@/api/cloud/auth";
import {onMounted} from "vue";

onMounted(()=>{
    setInterval(()=>{
        getAccessToken().then(res=>{
            sessionStorage.setItem("accessToken", res.data.data.accessToken)
        })
    },1000 * 60 * 60)
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
