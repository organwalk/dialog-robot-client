<template>
    <confirm-use @sendConfirm="getConfirm" v-if="showConfirm"/>
    <schedule-list-comp  v-if="confirm" />
</template>

<script setup>
import ScheduleListComp from "@/components/chat/interactiveCard/scheduleList/ScheduleListComp.vue";
import ConfirmUse from "@/components/chat/interactiveCard/scheduleList/confirm-use.vue";
import {ref} from "vue";

const showConfirm = ref(true)
const confirm = ref(false)
const getConfirm = (status) =>{
    confirm.value = status
    showConfirm.value = false
}
</script>

<style scoped>

</style>