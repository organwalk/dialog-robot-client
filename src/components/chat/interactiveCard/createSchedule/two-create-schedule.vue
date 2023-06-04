<template>
    <div v-show="showPageTwo" style="width: 100%">
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
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
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
                <el-input v-model="location"
                          maxlength="15"
                          show-word-limit
                          :prefix-icon="LocationInformation"
                          placeholder="Please input location about schedule"/>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
                <el-card shadow="never" style="border: none;background-color: #f5f9fa" align="center">
                    <span style="font-weight: bolder">添加日程成员</span><br/><br/>
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
import {LocationInformation} from '@element-plus/icons-vue'
import {defineEmits, ref, watch, defineProps, onMounted} from "vue"
import * as card from '@/api/cloud/card'

defineProps({
    showPageTwo: Boolean
})

const scheduleDes = ref('')
const location = ref('')

const opUsers = ref([])
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
const mem = ref([])
const handleChange = (selectedValues)=> {
    mem.value = selectedValues.map(() => {
        const selectedMember = options.value.find(item => selectedValues.includes(item.value));
        return {
            uid: selectedMember.value,
            name: selectedMember.label,
        };
    });
}

const emit = defineEmits(["getPageTwoData"])
const sendPageTwoData = () => {
    emit('getPageTwoData', scheduleDes.value, location.value,mem.value)
}

watch(
    [scheduleMembers],
    () => {
        sendPageTwoData()
    }
)

</script>

<style scoped>

</style>