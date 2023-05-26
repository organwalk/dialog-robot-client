<template>
    <el-card shadow="never" style="border: none; background-color: #f7f7f7">
        <el-row :gutter="10">
            <el-col :xs="4" :sm="6" :md="8" :lg="22" :xl="11">
                <el-input
                    v-model="orderContent"
                    placeholder="Talk to Xeno-Loader"
                    size="large"
                >
                    <template #append >
                        <el-button color="white"  :icon="Link" />
                    </template>
                </el-input>
            </el-col>
            <el-col :xs="4" :sm="6" :md="8" :lg="2" :xl="11" align="center">
                <el-button :icon="Promotion" style="border-radius: 10px;" size="large" color="#2C6AE3"
                @click="sendOrder()"/>
            </el-col>
        </el-row>

    </el-card>
</template>

<script setup>
import {Link,Promotion} from '@element-plus/icons-vue'
import {ref,defineEmits} from "vue";

const orderContent = ref('')
const emit = defineEmits(["user-input"])

const sendOrder = () =>{
    emit('user-input',orderContent.value)
    orderContent.value = ''
}
</script>

<style scoped>
/deep/ .el-input-group__append{
    background-color: white;
    border-radius: 0 10px 10px 0;
}
/deep/ .el-input-group--append>.el-input__wrapper{
    border-radius: 10px 0 0 10px;
}


</style>