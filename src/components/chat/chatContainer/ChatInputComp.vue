<template>
    <el-card shadow="never" style="border: none; background-color: #f7f7f7">
        <el-row :gutter="10">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
                <el-input
                        class="chat-input"
                        v-model="orderContent"
                        placeholder="Talk to Xeno-Loader"
                        size="large"
                        clearable
                        @keyup.enter="sendOrder()"
                >
                    <template #append>
                        <el-button color="white" :icon="Link"/>
                    </template>
                </el-input>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="center">
                <el-button :icon="Promotion" style="border-radius: 10px;" size="large" color="#2C6AE3"
                           @click="sendOrder()"/>
            </el-col>
        </el-row>

    </el-card>
</template>

<script setup>
import {Link, Promotion} from '@element-plus/icons-vue'
import {ref, defineEmits, defineProps} from "vue";
import * as order from "@/api/server/order";
import msg from "@/api/cloud/message"
import {useStore} from "vuex";
import * as mp from "@/api/cloud/manage-person";
import * as md from "@/api/cloud/manage-dept"
import * as card from "@/api/cloud/card"

const orderContent = ref('')
const store = useStore()
const emit = defineEmits(["user-input",
    "res-orderType",
    "send-emptyKeysList",
    "send-cardStatus",
    "send-status",  //不同事件下的消息状态
    "reply-robot",
    "send-name"])
const props = defineProps({
    missingValue: String
})

// 向聊天容器发送聊天内容
// 发送内容至自然语言处理服务
const sendOrder = () => {
    let refresh = ''
    emit('user-input', orderContent.value)
    emit('send-cardStatus', refresh)
    emit('send-status',refresh)
    let missingValueObj = store.state.chat.missingKeyObj
    //判断是否存有上次对话记录的空缺值对象，如果不存在，则表明本轮对话为新一轮对话
    if (Object.keys(missingValueObj).length === 0) {
        order.sendOrderToServer(orderContent.value).then(res => {
            let ot = '' //指令类型
            let obj = {} //参数对象
            let reply = true
            emit('reply-robot',reply)
            //判断指令是否为空
            if (res.data.orderRes.orderType !== '') {
                ot = res.data.orderRes.orderType
                obj = res.data.orderRes
                emit("res-orderType",ot)
                //然后判断指令体对象中是否存在空值
                if (filterEmptyKeys(obj).length > 0) {
                    //将空缺值列表发送给父组件
                    sendMissingValues(filterEmptyKeys(obj))
                    //保存空缺的响应参数对象至状态管理
                    store.dispatch('updataMissingKeyObj', obj)
                    emit('send-status','missValue')
                    emit('res-orderType',ot)
                } else {
                    //如果不存在空缺值，则可以调用赛方接口
                    //在此应该进行类别划分
                    const msgType = /Msg/
                    const manType = /Man/
                    const deptType = /Dept/
                    if (msgType.test(ot)) {
                        msg(ot, getOrderResObject(obj))
                        if (ot === 'OAMsg'){
                            emit('send-cardStatus', ot)
                        }
                    } else if (manType.test(ot)) {
                        if (ot === 'ModMan') {
                            emit("send-cardStatus", ot)
                        }
                        emit('send-status','orderType')
                        mp.man(ot, getOrderResObject(obj))
                    } else if (deptType.test(ot)) {
                        emit('send-status','orderType')
                        md.dept(ot, getOrderResObject(obj))
                    } else {
                        emit("send-cardStatus", ot)
                    }
                }
            } else {
                //若为空，则将空指令类型发送至父组件,以表意图不明
                emit('send-status','initial')
                emit('res-orderType', ot)
            }
        })
    } else {
        if (props.missingValue === 'object'){
            const regex = /^部门(?:群)?$/
            if (regex.test(orderContent.value)){
                const newObject = {
                    ...store.state.chat.missingKeyObj,
                    groupId:[]
                }
                delete newObject.object
                sendMissingValues(filterEmptyKeys(newObject))
                store.dispatch('updataMissingKeyObj', newObject)
                emit('send-status','missValue')
                emit('reply-robot',newObject)
            }else if (orderContent.value === '人'){
                const newObject = {
                    ...store.state.chat.missingKeyObj,
                    receivers:[]
                }
                delete newObject.object
                store.dispatch('updataMissingKeyObj', newObject)
                sendMissingValues(filterEmptyKeys(newObject))
                emit('send-status','missValue')
                emit('reply-robot',newObject)
            }
        }else {
            userInputAoubtMissingValues(props.missingValue, orderContent.value).then(newObj => {
                if (filterEmptyKeys(newObj).length > 0) {
                    sendMissingValues(filterEmptyKeys(newObj))
                    emit('send-status','missValue')
                    emit('res-orderType', newObj.orderType)
                } else if (filterEmptyKeys(newObj).length === 0) {
                    let orderType = store.state.chat.missingKeyObj.orderType
                    sendMissingValues([])
                    msg(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                    const mType = /Man/
                    if (mType.test(orderType)) {
                        mp.man(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                    }
                    emit('send-status','orderType')
                    emit('res-orderType', orderType)
                }
            })
        }
    }
    orderContent.value = ''
}

//提取orderRes中除orderType外的字段
const getOrderResObject = (obj) => {
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


//将空缺值数组发送给父组件中转给回复组件处理
const sendMissingValues = (emptyKeysList) => {
    console.log(emptyKeysList)
    emit('send-emptyKeysList', emptyKeysList)
}


//将用户对空缺值的补充填补进空缺对象中
const userInputAoubtMissingValues = async (type, val) => {
    let oldObj = store.state.chat.missingKeyObj
    let newObj = {}
    let userinfo = {}
    let data
    //type就是要补充字段的key，val就是要填补的值
    if (type in oldObj) {
        //此处应该判断Type的类型
        switch (type) {
            case 'receivers':
            case 'groupId':
                data = await objectIdByName(type, val)
                newObj = {...oldObj, [type]: data}
                break
            case 'name':
                data = await objectIdByName(type, val)
                //如果数据具有长度，则表明为数组，此时插值部门数组
                userinfo = {
                    name:val,
                    dept:data.deptList,
                    uid:data.uid
                }
                await store.dispatch('updataSearchUid', userinfo)
                // else {
                //     //如果数据不具有长度，则考虑为一般情况
                //     userinfo = {
                //         name: val,
                //         uid: Number(data)
                //     }
                //     await store.dispatch('updataSearchUid', userinfo)
                // }
                newObj = {...oldObj, [type]: data};
                break;
            case 'dept':
                data = await objectIdByName(type, val)
                if (data) {
                    const user = store.state.chat.searchUid
                    let newUser = {
                        ...user,
                        deptId: Number(data)
                    }
                    await store.dispatch('updataSearchUid', newUser)
                }
                newObj = {...oldObj, [type]: data};
                break;
            case 'userName':
                newObj = {...oldObj,[type]:Array(val)}
                break
            default:
                newObj = {...oldObj, [type]: val};
        }
    }
    //返回新的对象
    await store.dispatch('updataMissingKeyObj', newObj)
    return newObj
}


//获取缺失主体的id属性
const objectIdByName = async (type, val) => {
    try {
        if (type === 'receivers') {
            const namePattern = /[\u4e00-\u9fa5]{2,}(?:·[\u4e00-\u9fa5]{2,})*/g;
            let res
            if (val.length > 1) {
                const matches = val.match(namePattern);
                res = await order.getUserIdByName(matches)
            } else {
                let nameList = []
                res = await order.getUserIdByName(nameList.push(val))
            }
            const dataArray = res.data.data
            dataArray.forEach((item) => {
                item[0] = item[0] || '';
            });
            return dataArray.map((item) => item[0]);
        } else if (type === 'groupId') {
            const res = await order.getGroupIdByName(val);
            const groupId = res.data.data;
            return groupId.map((item) => item[1])[0];
        } else if (type === 'name') {
            let nameList = []
            nameList.push(val)
            // //  尝试从本部门的redis缓存中查找   ---- 仅适用于对本部门的uid获取
            // const res = await order.getUserIdByName(nameList)
            // const dataArray = res.data.data;
            //  若结果为空则表明为外部部门人员，通过通讯录导入并处理数组
            const resAll = await card.getPersonList()
            const uidId = resAll.data.data.userList.find(user => user.name === val).userId
            const res = await mp.getUserDept(uidId);
            let deptList = [];
            if (res.data.code === 200){
                res.data.data.map(dept =>{
                    deptList.push(dept.name)
                })
            }
            return {
                uid:uidId,
                deptList:deptList
            }
        } else if (type === 'dept') {
            const res = await order.getGroupIdByName(val);
            const groupId = res.data.data;
            return groupId.map((item) => item[0])[0];
        }
        // } else if (type === 'object'){
        //     const regex = /^(?:部门)?群(?:组)?$/
        //     if (regex.test(val)){
        //         const newObject = {
        //             ...store.state.chat.missingKeyObj,
        //             groupId:''
        //         }
        //         delete newObject.object
        //         await store.dispatch('updataMissingKeyObj', newObject)
        //         emit('sendMissingValues',filterEmptyKeys(newObject))
        //     }
        // }
    } catch (err) {
        // Handle 500 error
        if (err.response && err.response.status === 500) {
            return [];  // 返回空数组
        } else {
            throw err;
        }
    }
};
</script>

<style scoped>
/deep/ .el-input-group__append {
    background-color: white;
    border-radius: 0 10px 10px 0;
}

/deep/ .el-input-group--append > .el-input__wrapper {
    border-radius: 10px 0 0 10px;
}

/deep/ .el-input {
    --el-input-focus-border-color: #dcdfe6;
}
</style>