<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-input
                v-model="search"
                placeholder="Search"
                :prefix-icon="Search"
                style="width: 80%"
                class="search"
                @input="searchEmployee()"
            />
        </el-col>
    </el-row><br/>
    <el-collapse v-loading="loading" accordion style="width: 100%;height:370px;overflow-y: auto">
        <el-card v-for="(item,index) in employeeList" :key="index"
                 shadow="never"
                 style="border-radius: 10px;margin-bottom: 10px">
            <el-collapse-item :title="item.name" >
                <el-descriptions
                        title="Employee Details"
                        :column="2"
                        size="default"
                        border
                >
                    <template #extra>
                        <el-button type="primary" :icon="Edit" @click="read = false" circle size="small"/>
                        <el-popconfirm title="确认删除?" @confirm="deleteUser(item.id)">
                            <template #reference>
                                <el-button  type="danger" :icon="Delete" circle size="small"/>
                            </template>
                        </el-popconfirm>
                    </template>
                    <el-descriptions-item>
                        <template #label>Name</template>
                        <el-input class="edit" v-model="item.name" :readonly="read"/>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Mobile</template>
                        <el-input class="edit" v-model="item.mobile" :readonly="read" />
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Department</template>
                        <el-input class="edit" v-model="item.deptName" :readonly="read" />
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Job</template>
                        <el-input class="edit" v-model="item.title" :readonly="read" />
                    </el-descriptions-item>
                    <el-descriptions-item v-if="read">
                        <template #label>ID</template>
                        <el-input class="edit" style="user-select: none" v-model="item.id" readonly />
                    </el-descriptions-item>
                </el-descriptions><br v-if="!read"/>
                <el-row v-if="!read">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                        <el-button round size="small" @click="read = true">取消</el-button>
                        <el-button type="primary" round size="small" @click="confirmEdit(item)">确认</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-card>
    </el-collapse>
</template>

<script setup>
import {Search} from "@element-plus/icons-vue";
import {ref, defineProps, computed, watch, onMounted} from "vue";
import {Delete, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import * as mp from "@/api/cloud/manage-person"

const props = defineProps(
    {
        deptId:String,
        deptName:String
    }
)

const employeeList = ref([])
const deptId = computed(()=>props.deptId)
const deptName = computed(()=>props.deptName)

//实现人员列表加载
onMounted(()=>{
    if (deptId.value){
        mp.getPersonDept(deptId.value).then(res=>{
            res.data.data.users.forEach((user) => {
                user.deptName = deptName.value
                employeeList.value.push(user)
                loading.value = false
            })
        })
    }
})
watch(deptId,(newVal)=>{
    mp.getPersonDept(newVal).then(res=>{
        employeeList.value = []
        res.data.data.users.forEach((user) => {
            user.deptName = deptName.value
            employeeList.value.push(user)
            loading.value = false
        })
    })
})

//实现人员搜索
const loading = ref(true)
const search = ref('')
const searchEmployee = () => {
    if(search.value){
        const found = employeeList.value.find(employee => {
            return employee.name.includes(search.value)
        })
        if(found) {
            employeeList.value = [found]
        }
    } else {
        mp.getPersonDept(Number(deptId.value)).then(res=>{
            employeeList.value = []
            res.data.data.users.forEach((user) => {
                user.deptName = deptName.value
                employeeList.value.push(user)
                loading.value = false
            })
        })
    }
}

const read = ref(true)
const confirmEdit = (itemObject) =>{
    if (itemObject.name && itemObject.mobile && itemObject.deptName && itemObject.title){
        itemObject["uid"] = itemObject.id
        delete itemObject.id
        mp.updataPersonInfo(itemObject).then(res=>{
            if (res.data.data.uid){
                read.value = true
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
                mp.getPersonDept(Number(deptId.value)).then(res=>{
                    employeeList.value = []
                    res.data.data.users.forEach((user) => {
                        user.deptName = deptName.value
                        employeeList.value.push(user)
                        loading.value = false
                    })
                })
            }
        })
    }else {
        ElMessage.error('请完整填写信息')
    }

}

const deleteUser = (userID)=>{
    let user = {
        name:userID,
        dept:deptId.value
    }
    mp.delMan(user).then(res=>{
        if (res.data.code === 200){
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
            mp.getPersonDept(Number(deptId.value)).then(res=>{
                employeeList.value = []
                res.data.data.users.forEach((user) => {
                    user.deptName = deptName.value
                    employeeList.value.push(user)
                    loading.value = false
                })
            })
        }
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

/deep/ .edit .el-input {
    --el-input-focus-border-color:none;

}
/deep/ .edit .el-input__wrapper {
    box-shadow: none;
    border:none;
}
/deep/  .edit .el-input__wrapper :hover{
    box-shadow: none;
}
</style>