<template>
    <el-row>
        <el-col :xs="20" :sm="20" :md="20" :lg="15" :xl="20" align="left">
            <span style="font-weight: bolder;user-select: none">Employee Manage</span>
        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="9" :xl="2" align="right">
            <el-radio-group v-model="checkType" size="small">
                <el-radio-button label="Staff List"/>
                <el-radio-button label="Other Depts"/>
            </el-radio-group>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {ref} from "vue";

const checkType = ref('Staff List')
</script>