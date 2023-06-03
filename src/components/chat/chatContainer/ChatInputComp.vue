<template>
    <el-card shadow="never" style="border: none; background-color: #f7f7f7">
        <el-row :gutter="10">
            <el-col :xs="4" :sm="6" :md="8" :lg="22" :xl="11">
                <el-input
                    v-model="orderContent"
                    placeholder="Talk to Xeno-Loader"
                    size="large"
                    clearable
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
import {ref, defineEmits,defineProps} from "vue";
import sendOrderToServer from "@/api/server/order";
import msg from "@/api/cloud/message"
import {useStore} from "vuex";

const orderContent = ref('')
const store= useStore()
const emit = defineEmits(["user-input","res-orderType","send-emptyKeysList"])
const props = defineProps({
    missingValue:String
})

// 向聊天容器发送聊天内容
// 发送内容至自然语言处理服务
const sendOrder = () =>{
    emit('user-input',orderContent.value)
    let missingValueObj = store.state.chat.missingKeyObj
    //判断是否存有上次对话记录的空缺值对象，如果不存在，则表明本轮对话为新一轮对话
    if (Object.keys(missingValueObj).length === 0){
        sendOrderToServer(orderContent.value).then(res=>{
            let ot = '' //指令类型
            let obj = {} //参数对象
            //判断指令类型是否为空
            if (res.data.orderRes.orderType !== '' ){
                ot = res.data.orderRes.orderType
                obj = res.data.orderRes
                //然后判断指令体对象中是否存在空值
                if (filterEmptyKeys(obj).length > 0){
                    //将空缺值列表发送给父组件
                    sendMissingValues(filterEmptyKeys(obj))
                    //保存空缺的响应参数对象至状态管理
                    store.dispatch('updataMissingKeyObj',obj)
                    emit('res-orderType',ot)
                }else {
                    //如果不存在空缺值，则可以直接调用赛方接口
                    msg(ot,getOrderResObject(obj))
                }
            }else {
                //若为空，则将空指令类型发送至父组件,以表意图不明
                emit('res-orderType',ot)
            }
        })
    }else {
        console.log("------"+filterEmptyKeys(userInputAoubtMissingValues(props.missingValue,orderContent.value)).length)
        userInputAoubtMissingValues(props.missingValue,orderContent.value)
        if (filterEmptyKeys(userInputAoubtMissingValues(props.missingValue,orderContent.value)).length > 0){
            sendMissingValues(filterEmptyKeys(userInputAoubtMissingValues(props.missingValue,orderContent.value)))
            emit('res-orderType',userInputAoubtMissingValues(props.missingValue,orderContent.value).orderType)
        }else if (filterEmptyKeys(userInputAoubtMissingValues(props.missingValue,orderContent.value)).length === 0){
            let orderType = store.state.chat.missingKeyObj.orderType
            sendMissingValues([])
            msg(orderType,getOrderResObject(store.state.chat.missingKeyObj))
            emit('res-orderType',orderType)
        }

    }
    orderContent.value = ''
}

//提取orderRes中除orderType外的字段
const  getOrderResObject = (obj) => {
    const result = {};
    for (const key in obj) {
        if (key !== "orderType") {
            result[key] = obj[key];
        }
    }
    return result;
}

//检索orderRes中的空值
const filterEmptyKeys = (obj) => {
    let emptyObjList = []
    for (const key in obj) {
        const value = obj[key];
        if (value === null || value === undefined || value === '' || Array.isArray(value) && value.length === 0) {
            emptyObjList.push(key)
        }
    }
    return emptyObjList //返回key的value为空的列表
}

//将空缺值数组发送给父组件
const sendMissingValues = (emptyKeysList) => {
    emit('send-emptyKeysList',emptyKeysList)
}

//将用户对空缺值的补充填补进空缺对象中
const userInputAoubtMissingValues = (type,val) => {
    let oldObj = store.state.chat.missingKeyObj
    let newObj = {}
    //type就是要补充字段的key，val就是要填补的值
    if (type in oldObj){
        newObj = {...oldObj,[type]:val}
    }
    //返回新的对象
    store.dispatch('updataMissingKeyObj',newObj)
    return newObj
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