<template>
    <el-card style="margin-bottom: 10px;border-radius: 15px;background-color: white;width: 60%">
        <check-type @getCheckType="getCheckType"
                    :dept-name="deptName"
                    :new-check-type="checkTypeValue"/>
        <employee-list v-if="checkTypeValue === 'Staff List'" :dept-id="deptId"/>
        <other-dept-list v-if="checkTypeValue === 'Other Depts' " @sendDeptId="getDeptId"/>
    </el-card>
</template>

<script setup>
import EmployeeList from "@/components/chat/interactiveCard/manageEmployee/employee-list.vue";
import CheckType from "@/components/chat/interactiveCard/manageEmployee/check-type.vue";
import {ref, watch} from "vue";
import OtherDeptList from "@/components/chat/interactiveCard/manageEmployee/other-dept-list.vue";

const checkTypeValue = ref('')
const getCheckType = (newCheckType) => {
    checkTypeValue.value = newCheckType
}

const deptId = ref('')
const getDeptId = (newDeptId) => {
    deptId.value = newDeptId
}

watch(deptId,(newDeptId)=>{
    if (newDeptId){
        checkTypeValue.value = 'Staff List'
        console.log(checkTypeValue.value)
    }
})

const deptName = ref('开发部')
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