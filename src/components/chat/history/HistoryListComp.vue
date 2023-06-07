<template>
    <el-card shadow="never" style="border-top:none;height: 480px;overflow-y: auto">
        <!-- 一个卡片单位 -->
        <el-card style="border-radius:10px;margin-bottom: 20px; " v-for="(card, index) in cardList" :key="index">
            <el-row justify="center">
                <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14" >
                <h5>{{ card.TypeName }}</h5>
                </el-col>
                <el-col :xs="8" :sm="6" :md="10" :lg="10" :xl="10" style="display:flex;align-items: center" >
                    <el-button type="success" :icon="Check" size="small" round style="margin: auto" v-if="card.orderStatus === 'success'">Success</el-button>
                    <el-button type="danger" :icon="CircleCloseFilled" size="small" round style="margin: auto" v-if="card.orderStatus === 'fail'">Fail</el-button>
                </el-col>
            </el-row>
            <el-row justify="center">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" >
                    <span style="font-size: 10px">{{ card.orderContentText }}</span>
                </el-col>
            </el-row><br/>
            <el-row justify="center">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="right">
                    <el-button size="small" round text bg >{{ card.orderTime }}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </el-card>
</template>

<script setup>
import {Check,CircleCloseFilled} from '@element-plus/icons-vue'

// const TypeName = ref('发送应用消息')
// // const orderStatus = ref("success")
// const orderContentText = ref('一段文字内容，该内容表示当前指令所完成的任务')
// const orderTime = ref('15:00')
// const cardList = ref([
// ]);
// const addCard = () => {
//     const orderStatus = cardList.value.length % 2 === 0 ? "success" : "fail";
//     cardList.value.unshift({
//         TypeName: TypeName.value,
//         //orderStatus:orderStatus.value,
//         orderStatus:orderStatus,
//         orderContentText: orderContentText.value,
//         orderTime: orderTime.value, });
// };

</script>

<style scoped>
::-webkit-scrollbar{ display: none; }
</style>