<template>
    <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="left">
            <h4 style="width: 100%;user-select: none;margin: 0" type="info">{{ props.deptName }}</h4>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right">
            <el-radio-group v-model="checkType" size="small">
                <el-radio-button label="Staff"/>
                <el-radio-button label="Depts"/>
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

const emit = defineEmits(["getCheckType","getNewDeptName"])
const checkType = ref('Staff')
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