<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-input
                v-model="search"
                placeholder="Search"
                :prefix-icon="Search"
                style="width: 80%"
                @input="searchEmployee()"
            />
        </el-col>
    </el-row><br/>
    <el-card shadow="never" v-for="(item,index) in deptList" :key="index"
             style="border-radius: 10px;margin-bottom: 10px">
        <el-row>
            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" align="left">
                <span>{{ item.deptName }}</span>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                <el-button :icon="ArrowRight" circle size="small" @click="sendDeptName(item.deptId)" />
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import {ArrowRight, Search} from "@element-plus/icons-vue";
import {ref,defineEmits} from "vue";

const deptList = ref([])
const emit = defineEmits(['sendDeptId'])

deptList.value.push(
    {
        deptId:'111111',
        deptName:'开发部'
    },
    {
        deptId:'22222',
        deptName:'生产部'
    }
)

const sendDeptName = (deptId) => {
    emit('sendDeptId',deptId)
}

const search = ref('')
const searchEmployee = ()=> {
    console.log(search.value)
}
</script>

<style scoped>
/deep/ .el-input{
    --el-input-focus-border-color:none;

}
/deep/ .el-input__wrapper{
    background-color: #F2F3F5;
    border-radius: 15px;
    border:none;
}
/deep/ .el-input__wrapper:hover{
    box-shadow: none;
}
</style>