<template>
    <el-card shadow="never" style="border: none">
        <span>所属部门成员</span><br/><br/>
        <el-table :data="tableData" :border="parentBorder" style="width: 100%" size="small">
            <el-table-column type="expand">
                <template #default="props">
                    <div>
                        <p>State: {{ props.row.state }}</p>
                        <p>City: {{ props.row.city }}</p>
                        <p>Address: {{ props.row.address }}</p>
                        <p>Zip: {{ props.row.zip }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Date" prop="date"/>
            <el-table-column label="Name" prop="name"/>
        </el-table>
    </el-card>
</template>

<script setup>
import {ref} from 'vue'

const parentBorder = ref(false)
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-08',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-06',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        state: 'California',
        city: 'San Francisco',
        address: '3650 21st St, San Francisco',
        zip: 'CA 94114',
        family: [
            {
                name: 'Jerry',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Spike',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
            {
                name: 'Tyke',
                state: 'California',
                city: 'San Francisco',
                address: '3650 21st St, San Francisco',
                zip: 'CA 94114',
            },
        ],
    },
]
</script>

<style scoped>

</style>