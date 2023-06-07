<template>
    <div v-show="props.showPageTwo" style="width: 100%">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-input
                        v-model="scheduleDes"
                        :rows="3"
                        type="textarea"
                        placeholder="Please input describe about schedule"
                        maxlength="50"
                        show-word-limit
                />
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-input v-model="location"
                          maxlength="15"
                          show-word-limit
                          :prefix-icon="LocationInformation"
                          placeholder="Please input location about schedule"/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card shadow="never" style="border: none;background-color: #f5f9fa" align="center">
                    <span style="font-weight: bolder">添加日程成员</span>
                    <el-tooltip
                    effect="dark"
                    content="需要重新修改日程成员以继续"
                    placement="right-start"
                    v-if="sid"
                >
                        <el-button color="#f5f9fa" :icon="WarningFilled"  circle />
                </el-tooltip><br/><br/>
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
        <br/>
    </div>
</template>

<script setup>
import {LocationInformation,WarningFilled} from '@element-plus/icons-vue'
import {defineEmits, ref, watch, defineProps, onMounted, computed} from "vue"
import * as card from '@/api/cloud/card'
import * as data from "@/api/server/data";

const props = defineProps({
    showPageTwo: Boolean,
    sid:String
})

const scheduleDes = ref('')
const location = ref('')

const opUsers = ref([])

//  组件被挂载时远程获取人员列表
onMounted(()=>{
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
const scheduleMembers = ref([])
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

//传递该页的数据值
const emit = defineEmits(["getPageTwoData"])
const sendPageTwoData = () => {
    emit('getPageTwoData', scheduleDes.value, location.value,mem)
}

watch(
    [scheduleMembers],
    () => {
        sendPageTwoData()
    }
)

//监听父组件传递的sid值，如果存在sid，说明本次组件调用行为是修改，而非创建
const sid = computed(()=>props.sid)
if (sid.value){
    data.getScheduleBySid(sid.value).then(res=>{
        const obj = res.data.scheduleData[0]
        scheduleDes.value = obj.strdescrip
        const jsonObject = JSON.parse(obj.straddr)
        location.value = jsonObject.address
        JSON.parse(obj.members).forEach(member => {
            scheduleMembers.value.push(member.uid)
        })
    })
}
</script>

<style scoped>

</style>