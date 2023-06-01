<template>
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
                        <el-button type="primary" :icon="Edit" circle size="small"/>
                        <el-button  type="danger" :icon="Delete" circle size="small"/>
                    </template>
                    <el-descriptions-item>
                        <template #label>Name</template>
                        {{ item.userName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Mobile</template>
                        {{ item.mobile }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Department</template>
                        {{ item.deptName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>Job</template>
                        {{ item.title }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>ID</template>
                        {{ item.id }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-collapse-item>
        </el-card>
    </el-collapse>
</template>

<script setup>
import {ref} from "vue";
import {Delete, Edit} from "@element-plus/icons-vue";

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
</script>

<style scoped>

</style>