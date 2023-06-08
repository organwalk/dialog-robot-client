<template>
    <el-card :body-style="{padding:'10px'}" shadow="never" style="border: none; background-color: #f7f7f7;">
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
import {ref, defineEmits, defineProps, computed, watch} from "vue";
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
    missingValue: String,
    recommend:String
})

//  动态获取推荐提示语句
const rcd = computed(()=>props.recommend)
watch(rcd,(val)=>{
    orderContent.value = val
    sendOrder()
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
        //  处于新一轮对话
        inNewConversation(orderContent.value)
    } else {
        //  如果不是新一轮对话则表明具有空缺值
        //  如果空缺值为object，则需要进行人名或群组的确认
        if (props.missingValue === 'object'){
            let content = orderContent.value
            objectIsMissingKey(content)
        }else {
            //  如果空缺值不为object则进行空缺值填充
            let missingValue = props.missingValue
            let content = orderContent.value
            fillMissingValueFromContent(missingValue,content)
        }
    }
    orderContent.value = ''
}

//  处于新的对话中
const inNewConversation = (content) => {
    order.sendOrderToServer(content).then(res => {
        let ot = '' //指令类型
        let obj = {} //参数对象
        let reply = true //回复状态
        emit('reply-robot',reply)
        //判断对话指令响应体中的意图是否为空
        if (res.data.orderRes.orderType !== '') {
            //  若存在意图
            ot = res.data.orderRes.orderType
            obj = res.data.orderRes
            intentionIsNotNull(ot,obj)
        } else {
            //  若不存在意图
            intentionIsNull(ot)
        }
    })
}

//  如果意图不为空
const intentionIsNotNull = (ot,obj) => {
    //  发送当前意图
    emit("res-orderType",ot)
    //然后判断指令体对象中是否存在空值
    if (filterEmptyKeys(obj).length > 0) {
        missingKeyIsExist(ot,obj)
    } else {
        useApiAboutByDirect(ot,obj)
    }
}

//  如果意图为空
const intentionIsNull = (ot) => {
    //若为空，则将空指令类型发送至父组件,以表意图不明
    emit('send-status','initial')
    emit('res-orderType', ot)
}

//  如果存在空缺值，则发送空缺值
const missingKeyIsExist = (ot,obj) => {
    //将空缺值列表发送给父组件
    sendMissingValues(filterEmptyKeys(obj))
    //保存空缺的响应参数对象至状态管理
    store.dispatch('updataMissingKeyObj', obj)
    emit('send-status','missValue')
    emit('res-orderType',ot)
}

//  如果不存在空缺值，则可以调用赛方接口
const useApiAboutByDirect = (ot,obj) => {
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

//  如果缺失值是object
const objectIsMissingKey = (content) => {
    const regex = /^部门(?:群)?$/
    if (regex.test(content)){
        const newObject = {
            ...store.state.chat.missingKeyObj,
            groupId:[]
        }
        delete newObject.object
        sendMissingValues(filterEmptyKeys(newObject))
        store.dispatch('updataMissingKeyObj', newObject)
        emit('send-status','missValue')
        emit('reply-robot',newObject)
    }else if (content === '人'){
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
}

//  从对话中提取信息填补缺失值
const fillMissingValueFromContent = (msv,oc) => {
    console.log(msv+'---------'+oc)
    if (store.state.chat.missingKeyObj.orderType === 'AddMan' && store.state.chat.missingKeyObj.name === ''){
        const newObj = {
            ...store.state.chat.missingKeyObj,
            name:oc
        }
        store.dispatch('updataMissingKeyObj',newObj)
        sendMissingValues(filterEmptyKeys(newObj))
        emit('send-status','missValue')
        emit('reply-robot',newObj)
    }else {
        userInputAoubtMissingValues(msv, oc).then(newObj => {
            if (filterEmptyKeys(newObj).length > 0) {
                sendMissingValues(filterEmptyKeys(newObj))
                emit('send-status','missValue')
                emit('res-orderType', newObj.orderType)
                emit('reply-robot',newObj)
            }
            else if (filterEmptyKeys(newObj).length === 0) {
                let orderType = store.state.chat.missingKeyObj.orderType
                sendMissingValues([])
                msg(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                const mType = /Man/
                if (mType.test(orderType)) {
                    mp.man(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                }
                emit('send-status','orderType')
                emit('res-orderType', orderType)
                emit('reply-robot',newObj)
            }
        })
    }
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
    console.log("++++++++"+type)
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

//  调用接口获取缺失主体的id属性
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
    } catch (err) {
        // Handle 500 error
        if (err.response && err.response.status === 500) {
            return [];  // 返回空数组
        } else {
            throw err;
        }
    }
}
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