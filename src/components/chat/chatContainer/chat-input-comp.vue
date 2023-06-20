<template>
    <el-card :body-style="{padding:'10px'}" shadow="never" style="border: none; background-color: #f7f7f7;">
        <el-row :gutter="15">
            <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" align="left">
                <el-button :icon="MagicStick" size="large" circle color="#E6E8EB"
                           :disabled="resOver"
                           @click="clear()"/>
            </el-col>
            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21">
                <el-input
                        class="chat-input"
                        v-model="orderContent"
                        placeholder="Talk to Xeno-Loader"
                        autofocus
                        size="large"
                        clearable
                        @keyup.enter="sendOrder()"
                >
                    <template #append>
                        <el-popover
                                placement="bottom"
                                trigger="hover"
                        >
                            <template #reference>
                                <el-button color="white" :icon="Plus"/>
                            </template>
                            <el-row>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="center">
                                    <el-upload
                                            v-model:file-list="fileList"
                                            action="https://organwalk.ink/api/image"
                                            name="image"
                                            method="post"
                                            :auto-upload="true"
                                            :limit="1"
                                            ref="photoRef"
                                            :show-file-list="false"
                                            :before-upload="beforeUpload"
                                            @change="handleChange"
                                    >
                                        <el-button :icon="Link" circle/>
                                    </el-upload>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="center">
                                    <el-button :icon="Microphone" circle @click="voice()" />
                                </el-col>
                            </el-row>
                        </el-popover>
                    </template>
                </el-input>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="left">
                <el-button :icon="Promotion" style="border-radius: 10px;" size="large" color="#2C6AE3"
                           :disabled="resOver"
                           @click="sendOrder()"/>
            </el-col>
        </el-row>
    </el-card>
    <el-dialog
        v-model="showVoice"
        width="30%"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
        <el-card v-loading="getVoiceUrl" shadow="never" style="border-radius: 10px;border: none;min-height: 400px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                    <recording-comp style="width: 100%"/>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                    <el-button :icon="VideoPause" round
                               size="large"
                               color="#333"
                               style="font-weight: bolder;font-family: 微软雅黑,serif"
                               @click="stopVoice()">停止录音</el-button>
                </el-col>
            </el-row>
        </el-card>
    </el-dialog>
</template>

<script setup>
import {Promotion, MagicStick, Plus, Link, Microphone,VideoPause} from '@element-plus/icons-vue'
import {ref, defineEmits, defineProps, computed, watch} from "vue";
import * as order from "@/api/server/order";
import msg from "@/api/cloud/message"
import {useStore} from "vuex";
import * as mp from "@/api/cloud/manage-person";
import * as md from "@/api/cloud/manage-dept"
import * as card from "@/api/cloud/card"
import {dataURLtoFile} from "image-conversion";
import { usingVoice} from "@/optionConfig/voice-function";
import RecordingComp from "@/components/chat/interactiveCard/using-voice/recording-comp.vue";

const orderContent = ref('')
const store = useStore()
const emit = defineEmits(["user-input", //  传递用户输入文本事件
    "res-orderType",    //  传递指令
    "send-emptyKeysList",   // 传递空缺值
    "send-cardStatus",  //  唤醒卡片回复
    "send-status",  //  不同事件下的消息状态
    "reply-robot",  //  唤醒机器人回复
    "clear-chat",   //  清除聊天
    "image-url", //  图片url
    "voice-info"    //语音数据
])   //  发送姓名
const props = defineProps({
    missingValue: String,
    recommend: String,
    resOver: Boolean
})

const resOver = computed(() => props.resOver)
//  动态获取推荐提示语句
const rcd = computed(() => props.recommend)
watch(rcd, (val) => {
    orderContent.value = val
    sendOrder()
})

//  结束本轮对话
const clear = () => {
    let clear = true
    emit('clear-chat', clear)
}

//  发送图片
let photoRef = ref()
const fileList = ref([])
const url = ref('')
const beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; // 设置canvas宽高为图片原始尺寸
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.scale(canvas.width / img.width, canvas.height / img.height); // 缩放
                ctx.drawImage(img, 0, 0);
                const max_size = 100 * 1024; // 将图片压缩到100kb
                let quality = 0.9;
                let base64 = canvas.toDataURL('image/jpeg', quality);
                while (base64.length > max_size && quality > 0) {
                    quality -= 0.05;
                    base64 = canvas.toDataURL('image/jpeg', quality);
                }
                const compressedFile = dataURLtoFile(base64, file.name);
                resolve(compressedFile);
            };
            img.onerror = (error) => {
                reject(error);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

const handleChange = (res) => {
    if (res.status === "success") {
        url.value = res.response
        emit('image-url', url.value)
        orderContent.value = 'https://organwalk.ink/api/images/' + url.value
        sendOrder()
    }
}

// 打开录音面板
const showVoice = ref(false)
const getVoiceUrl = ref(false)
const voice = () => {
    getVoiceUrl.value = false
    showVoice.value = true
    usingVoice('start')
}
const stopVoice = async () => {
    getVoiceUrl.value = true
    usingVoice('stop')
    const url = computed(()=>store.state.chat.voiceObj.voiceUrl)
    const duration = computed(()=> store.state.chat.voiceObj.duration)
    const status = ref(false)
    watch([url,duration],() =>{
        status.value = true
    })
    watch(status,(newVal) => {
        if (newVal){
            emit("voice-info", store.state.chat.voiceObj);
            orderContent.value = store.state.chat.voiceObj;
            sendOrder();
            showVoice.value = false;
        }
    })

}

// 向聊天容器发送聊天内容
// 发送内容至自然语言处理服务
const sendOrder = () => {
    resOver.value = true
    let refresh = ''
    emit('user-input', orderContent.value)
    emit('send-cardStatus', refresh)
    emit('send-status', refresh)
    let missingValueObj = store.state.chat.missingKeyObj
    //判断是否存有上次对话记录的空缺值对象，如果不存在，则表明本轮对话为新一轮对话
    if (orderContent.value !== '') {
        if (Object.keys(missingValueObj).length === 0) {
            //  处于新一轮对话
            inNewConversation(orderContent.value)
        } else {
            //  如果不是新一轮对话则表明具有空缺值
            //  如果空缺值为object，则需要进行人名或群组的确认
            if (props.missingValue === 'object') {
                let content = orderContent.value
                objectIsMissingKey(content)
            } else {
                //  如果空缺值不为object则进行空缺值填充
                let missingValue = props.missingValue
                let content = orderContent.value
                fillMissingValueFromContent(missingValue, content)
            }
        }
    }
    orderContent.value = ''
    url.value = ''
    fileList.value = []
}

//  处于新的对话中
const inNewConversation = (content) => {
    order.sendOrderToServer(content).then(res => {
        let ot = '' //指令类型
        let obj = {} //参数对象
        let reply = true //回复状态
        emit('reply-robot', reply)
        //判断对话指令响应体中的意图是否为空
        if (res.data.orderRes.orderType !== '') {
            //  若存在意图，则继续
            ot = res.data.orderRes.orderType
            obj = res.data.orderRes
            intentionIsNotNull(ot, obj)
        } else {
            //  若不存在意图，则视为无效指令，要求用户重新输入
            intentionIsNull(ot)
        }
    })
}

//  如果意图不为空
const intentionIsNotNull = (ot, obj) => {
    //  发送当前意图
    emit("res-orderType", ot)
    //然后判断指令体对象中是否存在空值
    if (filterEmptyKeys(obj).length > 0) {
        //  如果存在空值则处理空值
        missingKeyIsExist(ot, obj)
    } else {
        //  如果不存在空值则直接调用接口
        useApiAboutByDirect(ot, obj)
    }
}

//  如果意图为空
const intentionIsNull = (ot) => {
    //若为空，则将空指令类型发送至父组件,以表意图不明
    emit('send-status', 'initial')
    emit('res-orderType', ot)
}

//  如果存在空缺值，则发送空缺值
const missingKeyIsExist = (ot, obj) => {
    //将空缺值列表发送给父组件
    sendMissingValues(filterEmptyKeys(obj))
    //保存空缺的响应参数对象至状态管理
    store.dispatch('updataMissingKeyObj', obj)
    emit('send-status', 'missValue')
    emit('res-orderType', ot)
}

//  如果不存在空缺值，则可以调用赛方接口
const useApiAboutByDirect = (ot, obj) => {
    //在此应该进行类别划分
    const msgType = /Msg/
    const manType = /Man/
    const deptType = /Dept/
    if (msgType.test(ot)) {
        msg(ot, getOrderResObject(obj))
        if (ot === 'OAMsg') {
            emit('send-cardStatus', ot)
            emit('send-status', 'cardInteraction')
        } else {
            emit('send-status', 'orderType')
        }
    } else if (manType.test(ot) && ot !== 'GetPlanByMan') {
        if (ot === 'ModMan') {
            emit("send-cardStatus", ot)
            emit('send-status', 'cardInteraction')
        } else if (ot === 'GetMan') {
            //  这里采取了折中的方案，将完整的值填入缺失值，以便于回复组件填充回复模板
            let newObj = {
                name: {
                    uid: obj.uid
                },
                dept: obj.dept
            }
            store.dispatch('updataMissingKeyObj', newObj)
            emit('send-status', 'orderType')
        } else if (ot === 'GetManDept') {
            let newObj = {
                uid: obj.uid,
                name: obj.name
            }
            store.dispatch('updataSearchUid', newObj)
            emit('send-status', 'orderType')
        }
        emit('send-status', 'orderType')
        mp.man(ot, getOrderResObject(obj))
    } else if (deptType.test(ot) && ot !== 'GetManDept') {
        emit('send-status', 'orderType')
        md.dept(ot, getOrderResObject(obj))
    } else {
        emit("send-cardStatus", ot)
        emit('send-status', 'cardInteraction')
    }
}

//  如果缺失值是object
const objectIsMissingKey = (content) => {
    const regex = /^部门(?:群)?$/
    if (regex.test(content)) {
        const newObject = {
            ...store.state.chat.missingKeyObj,
            groupId: []
        }
        delete newObject.object
        sendMissingValues(filterEmptyKeys(newObject))
        store.dispatch('updataMissingKeyObj', newObject)
        emit('send-status', 'missValue')
        emit('reply-robot', newObject)
    } else if (content === '人') {
        const newObject = {
            ...store.state.chat.missingKeyObj,
            receivers: []
        }
        delete newObject.object
        store.dispatch('updataMissingKeyObj', newObject)
        sendMissingValues(filterEmptyKeys(newObject))
        emit('send-status', 'missValue')
        emit('reply-robot', newObject)
    }
}

//  从对话中提取信息填补缺失值
const fillMissingValueFromContent = (msv, oc) => {
    // 当指令为AddMan时，此时用户提供的姓名作为Value，而无需转换为uid，因此可直接写入空缺值状态管理
    let ot = store.state.chat.missingKeyObj.orderType
    if (ot === 'AddMan' && store.state.chat.missingKeyObj.name === '') {
        const newObj = {
            ...store.state.chat.missingKeyObj,
            name: oc
        }
        store.dispatch('updataMissingKeyObj', newObj)    //  更新空缺值状态
        sendMissingValues(filterEmptyKeys(newObj))  //  对空缺值进行过滤
        emit('send-status', 'missValue') //  发送当前状态为“空缺值”供回复组件状态机响应
        emit('reply-robot', newObj)  //  发送当前对象值，供聊天容器组件唤醒回复
    }
    //  当指令为AddDept时，此时用户提供的部门名作为Value，而无需转换为deptId，因此可直接写入空缺值状态管理
    else if (ot === 'AddDept') {
        let obj = {
            dept: oc
        }
        md.dept(ot, obj)
        emit('send-status', 'orderType')
        emit('res-orderType', ot)
        emit('reply-robot', true)
    } else if (ot === 'DelDept') {
        order.getDeptIdByName(oc).then(res => {
            let deptId = res.data.data[0]
            md.dept(ot, deptId)
        })
        emit('send-status', 'orderType')
        emit('res-orderType', ot)
        emit('reply-robot', true)
    } else {
        //  获取空缺值属性处理结果
        userInputAoubtMissingValues(msv, oc).then(newObj => {
            //  如果过滤后的空缺值数组存在，则表明仍存在空缺值，应继续过滤
            if (filterEmptyKeys(newObj).length > 0) {
                sendMissingValues(filterEmptyKeys(newObj))
                emit('send-status', 'missValue') //  发送当前状态为“空缺值”供回复组件状态机响应
                emit('res-orderType', newObj.orderType) //发送当前指令类型，供回复组件状态机调用响应缺失值问询
                emit('reply-robot', newObj)//  发送当前对象值，供聊天容器组件唤醒回复
            }
            //  如果过滤后不存在空缺值数组，则可以调用接口
            else if (filterEmptyKeys(newObj).length === 0) {
                let orderType = store.state.chat.missingKeyObj.orderType
                sendMissingValues([])
                msg(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                const mType = /Man/
                if (mType.test(orderType)) {
                    mp.man(orderType, getOrderResObject(store.state.chat.missingKeyObj))
                }
                emit('send-status', 'orderType')
                emit('res-orderType', orderType)
                emit('reply-robot', newObj)
            }
        })
    }
}


/*------------以下为工具方法，非必要不修改维护-----------------------*/

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
                    name: val,
                    dept: data.deptList,
                    uid: data.uid
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
                newObj = {...oldObj, [type]: Array(val)}
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
            if (res.data.code === 200) {
                res.data.data.map(dept => {
                    deptList.push(dept.name)
                })
            }
            return {
                uid: uidId,
                deptList: deptList
            }
        } else if (type === 'dept') {
            const res = await order.getGroupIdByName(val);
            const groupId = res.data.data;
            return groupId.map((item) => item[0])[0];
        }
    } catch (err) {
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