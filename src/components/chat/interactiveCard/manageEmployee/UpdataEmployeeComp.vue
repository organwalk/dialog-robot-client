<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 80%">
        <check-type/>
        <employee-list/>
    </el-card>
</template>

<script setup>
import EmployeeList from "@/components/chat/interactiveCard/manageEmployee/employee-list.vue";
import CheckType from "@/components/chat/interactiveCard/manageEmployee/check-type.vue";

</script>

<style scoped>
/deep/ .el-collapse-item__header {
    border: none;
}

/deep/ .el-collapse {
    --el-collapse-border-color: none;
    --el-collapse-header-height: 20px;
    --el-collapse-content-bg-color: none;
}

/deep/ .el-collapse-item__content {
    padding-top: 20px;
    padding-bottom: 0;
}

::-webkit-scrollbar {
    display: none;
}
</style>