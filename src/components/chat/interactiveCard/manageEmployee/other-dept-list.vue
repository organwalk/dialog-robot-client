<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-input
                    v-model="search"
                    placeholder="Search"
                    :prefix-icon="Search"
                    class="search"
                    style="width: 100%"
                    @input="searchEmployee()"
            />
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height: 400px;overflow-y: auto" v-loading="loading">
        <el-card   shadow="never" v-for="(item,index) in deptList" :key="index"
                 style="border-radius: 10px;margin-bottom: 10px;">
            <el-row>
                <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" align="left">
                    <span >{{ item.name }}</span>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                    <el-tooltip
                        effect="dark"
                        content="修改部门名称"
                        placement="top"
                        hide-after="0"
                        v-if="item.name!=='未分组'"
                    >
                        <el-button :icon="Edit" circle size="small" type="primary"  @click="editDeptName(item.name)" v-btn/>
                    </el-tooltip>
                    <el-popconfirm v-if="item.name!=='未分组'" width="200" title="您确定要删除此部门吗？" @confirm="deleteDeptByDeptId(item.deptId)">
                        <template #reference>
                            <el-button :icon="Delete" circle size="small" type="danger" v-btn/>
                        </template>
                    </el-popconfirm>
                    <el-tooltip
                        effect="dark"
                        content="跳转部门"
                        placement="top"
                        hide-after="0"
                    >
                        <el-button :icon="ArrowRight" circle size="small" @click="sendDeptName(item.deptId,item.name)" v-btn/>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-card>
    </div>
    <el-dialog
        v-model="visible"
        width="30%"
        :show-close="false"
        top="35vh"
    >
        <el-card>
            <el-row>
                <h4 style="margin: 0">修改部门名称</h4>
            </el-row><br/>
            <el-row v-loading="updateLoading">
                <el-input v-model="changeDeptNameValue" />
            </el-row>
            <br/>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                    <el-button :icon="Close" @click="visible = false" circle size="small"/>
                    <el-button type="primary" :icon="Check" circle size="small" @click="changeDeptName()"/>
                </el-col>
            </el-row>
        </el-card>
    </el-dialog>
</template>

<script setup>
import {ArrowRight, Check, Close, Edit, Search,Delete} from "@element-plus/icons-vue";
import {ref, defineEmits, onMounted, defineProps,  computed} from "vue";
import * as mp from "@/api/cloud/manage-person"
import {ElMessage} from "element-plus";
import {getDeptIdByName} from "@/api/server/order";
import {delDept, dept} from "@/api/cloud/manage-dept";
import * as personInfoRefresh from "@/components/chat/interactiveCard/manageEmployee/personInfoRefresh";

const deptList = ref([])
const emit = defineEmits(['sendDeptId'])
const loading = ref(true)

const props = defineProps({
    nowDeptName:String
})

onMounted(() => {
    getDeptList()
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

//修改部门名称
const changeDeptNameValue = ref()
const cacheDeptName = ref()
const visible = ref(false)
const updateLoading = ref(false)
const editDeptName = (val) => {
    visible.value = true
    cacheDeptName.value = val
    changeDeptNameValue.value = val
}
const changeDeptName = () => {
    updateLoading.value = true
    getDeptIdByName(cacheDeptName.value).then(res=>{
        let deptId = res.data.data[0]
        let obj = {
            deptId: Number(deptId),
            name:String(changeDeptNameValue.value)
        }
        dept("UpdateDept",obj).then(res => {
           if (res.data.code === 200){
               let status = personInfoRefresh.updateDeptName()
               if (status){
                   ElMessage.success("修改成功");
                   updateLoading.value = false;
                   visible.value = loading.value
                   emit("getNewDeptName",true)
                   getDeptList()
               } else {
                   updateLoading.value = false;
               }
           }
        })
    })
}


//删除部门
const deleteDeptByDeptId = (val) => {
    delDept(val).then(res => {
        if (res.data.code === 200){
            let status = personInfoRefresh.updateDeptName()
            if (status){
                ElMessage.success("成功删除此部门")
                getDeptList()
            }
        }else {
            ElMessage.error("删除失败，请重试")
            getDeptList()
        }
    })
}

// 加载部门列表
const getDeptList = () => {
    loading.value = true
    deptList.value = []
    mp.getDeptList().then(res => {
        res.data.data.departments.forEach((dept) => {
            deptList.value.push(dept)
            loading.value = false
        })
    })
}
</script>

<style scoped>
/deep/ .search .el-input {
    --el-input-focus-border-color:none;

}
/deep/ .search .el-input__wrapper {
    background-color: #F2F3F5;
    border-radius: 15px;
    box-shadow: none;
    border:none;
}
/deep/  .search .el-input__wrapper :hover{
    box-shadow: none;
}
</style>