<template>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <el-input
                v-model="title"
                placeholder="Please input a title about schedule "
                :prefix-icon="Check"
                maxlength="15"
                show-word-limit
            />
        </el-col>
    </el-row>
    <br/><br/>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <el-card shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;">
                <span style="font-weight: bolder">请选择日程的基本配置项</span><br/><br/>
                <el-row :gutter="10">
                    <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                        <el-card shadow="never" style="border: none;border-radius: 8px;">
                            <el-date-picker
                                v-model="startTime"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm"
                                placeholder="开始时间"
                                style="width: 100%"
                            />
                        </el-card>
                    </el-col>
                    <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                        <el-card shadow="never" style="border: none;border-radius: 8px;">
                            <el-date-picker
                                v-model="endTime"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DD HH:mm"
                                placeholder="结束时间"
                                style="width: 100%"
                            />
                        </el-card>
                    </el-col>
                </el-row><br/>
                <el-row>
                    <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
                        <el-card shadow="never" style="border: none;border-radius: 8px;">
                            <span>是否提醒</span><br/><br/>
                            <el-switch
                                v-model="notice"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            />
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {Check} from "@element-plus/icons-vue";
import {defineEmits, ref, watch} from "vue";

const startTime = ref('')
const notice = ref(true)
const endTime = ref('')
const title = ref('')

const emit = defineEmits(["getPageOneData"])

const sendPageOneData = () => {
    emit('getPageOneData',title.value,startTime.value,endTime.value,notice.value)
}

watch([title, startTime, endTime, notice], () => {
    sendPageOneData()
});


</script>

<style scoped>

</style>