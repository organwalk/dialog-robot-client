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
    <el-collapse accordion style="width: 100%;height:370px;overflow-y: auto">
        <el-card v-for="(item,index) in employeeList" :key="index"
                 shadow="never"
                 style="border-radius: 10px;margin-bottom: 10px">
            <el-collapse-item :title="item.userName">
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
                        <el-input class="edit" v-model="item.userName" :readonly="read"/>
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
import {ref, defineProps} from "vue";
import {Delete, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

defineProps(
    {
        deptId:String
    }
)

const employeeList = ref([])

employeeList.value.push(
    {
        id:'10101003',
        userName:'John',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    },
    {
        id:'10101003',
        userName:'Bob',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    },
    {
        id:'10101003',
        userName:'Bob',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    },
    {
        id:'10101003',
        userName:'Bob',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    },
    {
        id:'10101003',
        userName:'Bob',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    },
    {
        id:'10101003',
        userName:'Bob',
        mobile:'183xxxxxxxx',
        deptName:'开发部',
        title:'开发人员'
    }
)
const search = ref('')

const searchEmployee = ()=> {
    console.log(search.value)
}

const read = ref(true)
const confirmEdit = (itemObject) =>{
    if (itemObject.userName && itemObject.mobile && itemObject.deptName && itemObject.title){
        console.log(itemObject)
        read.value = true
        ElMessage({
            message: '修改成功',
            type: 'success',
        })
    }else {
        ElMessage.error('请完整填写信息')
    }

}

const deleteUser = (userID)=>{
    console.log(userID)
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