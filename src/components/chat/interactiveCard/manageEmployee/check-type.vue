<template>
    <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="left">
            <el-tag style="width: 100%" type="info" round>{{ props.deptName }}</el-tag>
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

const props = defineProps({
    newCheckType:String,
    deptName:String
})

const emit = defineEmits(["getCheckType"])
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
</script>