<template>
    <div v-show="props.showPageOne" style="width: 100%">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-input
                        v-model="notificationDes"
                        placeholder="Please input a content about notification "
                        :prefix-icon="Check"
                        maxlength="80"
                        :rows="3"
                        type="textarea"
                        show-word-limit
                />
            </el-col>
        </el-row>
        <br/><br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
                    <span style="font-weight: bolder">请选择事项的基本配置项</span><br/><br/>
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <el-date-picker
                                        v-model="startTime"
                                        type="datetime"
                                        format="YYYY-MM-DD HH:mm"
                                        value-format="YYYY-MM-DD HH:mm"
                                        placeholder="通知时间"
                                        style="width: 100%"
                                />
                            </el-card>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <span>是否邮件提醒</span><br/><br/>
                                <el-switch
                                    v-model="notice"
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                />
                            </el-card>
                        </el-col>
                    </el-row><br/>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <el-card shadow="never" style="border: none;border-radius: 8px;">
                                <span>选择通知人员</span><br/><br/>
                                <el-select v-model="scheduleMembers"
                                           placeholder="Select"
                                           multiple
                                           filterable
                                           @change="handleChange">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <br/>
    </div>
</template>

<script setup>
import {Check} from "@element-plus/icons-vue";
import {defineEmits, ref, watch, defineProps, onMounted, computed} from "vue";
import * as card from "@/api/cloud/card";
import * as data from "@/api/server/data"

const props = defineProps({
    showPageOne: Boolean,
    nid:String
})

const startTime = ref('')
const notice = ref(true)
const notificationDes = ref('')
const scheduleMembers = ref([])
const opUsers = ref([])
const notice_id = computed(()=>props.nid)

//  组件被挂载时远程获取人员列表
onMounted(()=>{
    //  如果存在事项id则为修改事件，应该预先填充部分数据
    if (notice_id.value){
        data.getNotificationByNid(notice_id.value).then(res=>{
            const obj = res.data.notificationData[0]
            notice.value = Boolean(obj.is_push_mail)
            notificationDes.value = obj.content
            JSON.parse(obj.members).forEach(member => {
                scheduleMembers.value.push(member.uid)
            })
        })
    }
    card.getPersonList().then(res=>{
        let users = res.data.data.userList
        opUsers.value = users
            .map(user => ({ value: user.userId, label: user.name }))
            .filter((user, index, arr) => (
                arr.findIndex(u => u.value === user.value && u.label === user.label) === index
            ));
        options.value = opUsers.value
    })
})
const options = ref([])
let mem = []

//获取选择用户的uid及name值
const handleChange = (selectedValues) => {
    mem = []
    const selectedOptions = selectedValues.map((value) => {
        const option = options.value.find((item) => item.value === value);
        return { value: value, label: option ? option.label : '' };
    });
    // 检查是否已经存在相同的对象数组
    const isDuplicate = mem.some((arr) => {
        if (arr.length !== selectedOptions.length) {
            return false;
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value !== selectedOptions[i].value || arr[i].label !== selectedOptions[i].label) {
                return false;
            }
        }
        return true;
    });
    // 如果不存在相同的对象数组，则将新的对象数组添加到mem.value属性中
    if (!isDuplicate) {
        mem.push(selectedOptions);
    }
}

//向父组件发送该页数据，以辅助其进行表单检验
const emit = defineEmits(["getPageOneData"])
const sendPageOneData = () => {
    emit('getPageOneData', notificationDes.value, startTime.value, notice.value, mem)
}

watch([scheduleMembers], (newMem) => {
    if (newMem){
        sendPageOneData()
    }
})


</script>

<style scoped>

</style>