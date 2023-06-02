<template>
    <confirm-use @sendConfirm="getConfirm" v-if="showConfirm"/>
    <employee-manage v-if="confirm"/>
</template>

<script setup>
import EmployeeManage from "@/components/chat/interactiveCard/manageEmployee/employee-manage.vue";
import ConfirmUse from "@/components/chat/interactiveCard/manageEmployee/confirm-use.vue";
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