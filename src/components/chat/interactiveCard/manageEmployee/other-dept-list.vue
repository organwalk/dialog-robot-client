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
    </el-row>
    <br/>
    <div style="width: 100%;height: 200px" v-loading="loading" v-if="loading"></div>
        <el-card   shadow="never" v-for="(item,index) in deptList" :key="index"
                 style="border-radius: 10px;margin-bottom: 10px">
            <el-row>
                <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" align="left">
                    <span >{{ item.name }}</span>
                </el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                    <el-button :icon="ArrowRight" circle size="small" @click="sendDeptName(item.deptId,item.name)"/>
                </el-col>
            </el-row>
        </el-card>
</template>

<script setup>
import {ArrowRight, Search} from "@element-plus/icons-vue";
import {ref, defineEmits, onMounted, defineProps,  computed} from "vue";
import * as mp from "@/api/cloud/manage-person"
import {ElMessage} from "element-plus";

const deptList = ref([])
const emit = defineEmits(['sendDeptId'])
const loading = ref(true)

const props = defineProps({
    nowDeptName:String
})

onMounted(() => {
    mp.getDeptList().then(res => {
        res.data.data.departments.forEach((dept) => {
            deptList.value.push(dept)
            loading.value = false
        })
    })
})

const ndn = computed(()=>props.nowDeptName)

const sendDeptName = (deptId,name) => {
    if (ndn.value === name){
        ElMessage.error("您已身处此部门")
    }
    emit('sendDeptId', deptId,name)
}

const search = ref('')
const searchEmployee = () => {
    if(search.value){
        const found = deptList.value.find(dept => {
            return dept.name.includes(search.value)
        })
        if(found) {
            deptList.value = [found]
        }
    } else {
        mp.getDeptList().then(res => {
            deptList.value = []
            res.data.data.departments.forEach((dept) => {
                deptList.value.push(dept)
                loading.value = false
            })
        })
    }
}
</script>

<style scoped>
/deep/ .el-input {
    --el-input-focus-border-color: none;

}

/deep/ .el-input__wrapper {
    background-color: #F2F3F5;
    border-radius: 15px;
    border: none;
}

/deep/ .el-input__wrapper:hover {
    box-shadow: none;
}
</style>