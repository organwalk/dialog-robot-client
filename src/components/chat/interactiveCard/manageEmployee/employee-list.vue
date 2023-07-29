<template>
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-input
                v-model="search"
                placeholder="Search"
                :prefix-icon="Search"
                style="width: 100%"
                class="search"
                @input="searchEmployee()"
            />
        </el-col>
    </el-row><br/>
    <el-collapse v-loading="loading" accordion style="width: 100%;height:400px;overflow-y: auto;user-select: none">
        <el-card v-for="(item,index) in employeeList" :key="index"
                 shadow="never"
                 style="border-radius: 10px;margin-bottom: 10px">
            <el-collapse-item :title="item.name" >
                <el-descriptions
                        title="Employee Details"
                        :column="2"
                        size="default"
                        border
                        v-loading="editLoading"
                >
                    <template #extra>
                        <el-button type="primary" :icon="Edit" @click="getCacheData(item)" circle size="small"/>
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
                        <el-select class="edit" v-model="defaultDept" value-key="id" size="large" :disabled="read">
                            <el-option
                                v-for="dept in deptList"
                                :key="dept.value"
                                :label="dept.label"
                                :value="dept.value"
                            />
                        </el-select>
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
import * as auth from "@/api/cloud/auth";
import * as save from "@/api/server/save-data";

const props = defineProps(
    {
        deptId:String,
        deptName:String,
        ifChangeDeptName:String
    }
)

const employeeList = ref([])
const deptId = computed(()=>props.deptId)
const deptName = computed(()=>props.deptName)
const ifChangeDeptName = computed(()=>props.ifChangeDeptName)
const defaultDept = ref('')

//实现人员列表加载
onMounted(()=>{
    if (deptId.value){
        getPersonByDeptId(deptId.value)
    }
})
watch(deptId,(newVal)=>{
    getPersonByDeptId(newVal)
})
watch(ifChangeDeptName,(newVal)=>{
    if (newVal){
        loading.value = true
        getPersonByDeptId(deptId.value)
    }
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
        getPersonByDeptId(deptId.value)
    }
}

const getCacheData = (item) => {
    read.value = false
    cacheName.value = item.name
}
//实现职员修改
const read = ref(true)
const editLoading = ref(false)
const cacheName = ref()
const confirmEdit = (itemObject) =>{
    editLoading.value = true
    if (itemObject.name && itemObject.mobile && defaultDept.value && itemObject.title){
        itemObject["uid"] = itemObject.id
        if (defaultDept.value !== deptId.value){
            itemObject["oldDeptId"] = deptId.value
            itemObject["deptId"] = defaultDept.value
        }
        delete itemObject.id
        mp.updataPersonInfo(itemObject).then(res=>{
            if (res.data.code===200){
                editLoading.value = false
                read.value = true
                if (itemObject["deptId"] !== deptId.value){
                    auth.getDeptPersonList(itemObject["deptId"]).then(res => {
                        console.log(res.data)
                        const personList = res.data.data.users.map(person => {
                            return {
                                id: person.id.toString(),
                                name: person.name,
                                mobile: person.mobile,
                                sequence: person.sequence,
                                orgId: person.orgId,
                                privilege: "mydeptonly"
                            }
                        })
                        if (personList.length === 0){
                            if (cacheName.value !== undefined){
                                save.deletePersonInDept(cacheName.value, deptName.value)
                            }
                        }
                        let deptList = []
                        mp.getDeptList().then(res => {
                            res.data.data.departments.forEach((dept) => {
                                deptList.push({
                                    label:dept.name,
                                    value:dept.deptId
                                })
                            })
                            save.saveDeptPersonList(deptList.find(item => item.value === itemObject["deptId"]).label, personList).then(res => {
                                if (res.data.status !== 200) {
                                    throw new Error("服务错误，请重试");
                                }
                            })
                        })
                    })
                }
                getPersonByDeptId(deptId.value)
                editLoading.value = false
                ElMessage.success("职员信息修改成功")
            }else {
                ElMessage.error(res.data.msg)
                editLoading.value = false
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

let deptList = []
//获取职员列表
const getPersonByDeptId = (val) => {
    employeeList.value = []
    mp.getPersonDept(val).then(res=>{
        res.data.data.users.forEach((user) => {
            user.deptName = deptName.value
            employeeList.value.push(user)
            loading.value = false
        })
    })
    deptList = []
    mp.getDeptList().then(res => {
        res.data.data.departments.forEach((dept) => {
            deptList.push({
                label:dept.name,
                value:dept.deptId
            })

        })
        defaultDept.value = deptList.find(item => item.label === deptName.value)?.value || '';
    })
    auth.getDeptPersonList(val).then(res => {
        let personList = []
        if (res.data.data.users !== []){
            personList = res.data.data.users.map(person => {
                return {
                    id: person.id.toString(),
                    name: person.name,
                    mobile: person.mobile,
                    sequence: person.sequence,
                    orgId: person.orgId,
                    privilege: "mydeptonly"
                }
            })
        }
        if (personList.length === 0){
            if (cacheName.value !== undefined){
                save.deletePersonInDept(cacheName.value, deptName.value)
            }else {
                loading.value = false
                ElMessage.error("当前部门暂无人员")
            }
        }else {
            save.saveDeptPersonList(deptName.value,personList).then(res => {
                if (res.data.status !== 200) {
                    throw new Error("服务错误，请重试");
                }
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
/deep/ .el-input.is-disabled .el-input__wrapper {
    background-color: #ffffff;
}
/deep/ .el-input.is-disabled .el-input__inner {
    color: #000000;
    -webkit-text-fill-color: #6a6870;
}
</style>