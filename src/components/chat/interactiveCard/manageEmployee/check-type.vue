<template>
    <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="left" @click="getDeptName(props.deptName)" >
            <el-popover
                :visible="visible"
                placement="bottom"
                title="修改部门名称"
                :width="200"
                trigger="click"
            >
                <template #reference>
                    <el-tag style="width: 100%;user-select: none" type="info" round @click="visible = true">{{ props.deptName }}</el-tag>
                </template>
                <el-row v-loading="loading">
                    <el-input v-model="changeDeptNameValue" />
                </el-row>
                <br/>
                <el-row >
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                        <el-button :icon="Close" @click="visible = false" circle size="small"/>
                        <el-button type="primary" :icon="Check" circle size="small" @click="changeDeptName()"/>
                    </el-col>
                </el-row>

            </el-popover>
        </el-col>
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9" align="left">
            <span style="font-weight: bolder;user-select: none">Employee Manage</span>
        </el-col>
        <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9" align="right">
            <el-radio-group v-model="checkType" size="small">
                <el-radio-button label="Staff List"/>
                <el-radio-button label="Other Depts"/>
            </el-radio-group>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {ref, defineEmits, watch, onMounted, defineProps, computed} from "vue";
import {Check, Close} from "@element-plus/icons-vue";
import {getDeptIdByName} from "@/api/server/order";
import {dept} from "@/api/cloud/manage-dept";
import {personInfoRefresh} from "@/components/chat/interactiveCard/manageEmployee/personInfoRefresh";

const props = defineProps({
    newCheckType:String,
    deptName:String
})

const emit = defineEmits(["getCheckType","getNewDeptName"])
const checkType = ref('Staff List')
watch(checkType,(newCheckType)=>{
    emit("getCheckType",newCheckType)
})
onMounted(()=>{
    emit("getCheckType",checkType.value)
})
const fCheckType = computed(()=>props.newCheckType)
watch(fCheckType,(newVal)=>{
    checkType.value = newVal
})

const changeDeptNameValue = ref()
const cacheDeptNameValue = ref()
const visible = ref(false)
const loading = ref(false)
const getDeptName = (val) => {
    changeDeptNameValue.value = val
    cacheDeptNameValue.value = val
}
const changeDeptName = () => {
    loading.value = true
    getDeptIdByName(cacheDeptNameValue.value).then(res=>{
        let deptId = res.data.data[0]
        let obj = {
            deptId: Number(deptId),
            name:String(changeDeptNameValue.value)
        }
        dept("UpdateDept",obj)
        loading.value = personInfoRefresh()
        visible.value = loading.value
        emit("getNewDeptName",true)
    })
}
</script>