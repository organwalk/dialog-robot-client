<template>
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
    </el-row><br/>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
            <el-input v-model="location"
                      maxlength="15"
                      show-word-limit
                      :prefix-icon="LocationInformation"
                      placeholder="Please input location about schedule"/>
        </el-col>
    </el-row><br/>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11">
            <el-card shadow="never" style="border: none;background-color: #f5f9fa" align="center">
                <span style="font-weight: bolder">添加日程成员</span><br/><br/>
                <el-select-v2
                    v-model="scheduleMembers"
                    filterable
                    :options="options"
                    placeholder="Please select schedule members"
                    style="width: 80%"
                    multiple
                />
            </el-card>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {LocationInformation} from '@element-plus/icons-vue'
import {defineEmits, ref, watch} from "vue";

const scheduleDes = ref('')
const location = ref('')

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const scheduleMembers = ref([])
const options = Array.from({ length: 10 }).map((_, idx) => {
    const label = idx + 1
    return {
        value: `Group ${label}`,
        label: `Group ${label}`,
        options: Array.from({ length: 10 }).map((_, idx) => ({
            value: `Option ${idx + 1 + 10 * label}`,
            label: `${initials[idx % 10]}${idx + 1 + 10 * label}`,
        })),
    }
})

const emit = defineEmits(["getPageTwoData"])

const sendPageTwoData = ()=>{
    emit('getPageTwoData',scheduleDes.value,location.value,scheduleMembers.value)
}

watch(
    [scheduleDes,location,scheduleMembers],
    () => {
        sendPageTwoData()
    }
)

</script>

<style scoped>

</style>