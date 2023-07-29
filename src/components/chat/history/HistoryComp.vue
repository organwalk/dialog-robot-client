<template>
    <el-card shadow="never" class="history" style="border-top: none;border-bottom: none;border-radius: 0">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card shadow="never" style="border-radius: 10px">
                    <el-row>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" align="center"
                                style="display:flex;justify-content: center">
                            <el-card shadow="never" style="display: flex;align-items: center;border: none">
                                <span style="font-size: 20px;font-weight: bolder;user-select: none;font-family: 微软雅黑,serif">Working</span>
                            </el-card>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                            <el-card shadow="never" style="border: none">
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <el-button size="large" :icon="ChatDotRound" circle :color="chat"
                                                   @click="onChat" v-btn></el-button>
                                    </el-col>
                                </el-row>
                                <br/>
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <el-button size="large" :icon="Monitor" circle :color="work" @click="onWork"
                                                   v-btn></el-button>
                                    </el-col>
                                </el-row>
                                <br/>
                                <el-row>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <el-button size="large" :icon="Setting" circle @click="onSetting"
                                                   v-btn></el-button>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
    <el-dialog
            v-model="visible"
            width="30%"
            :show-close="false"
            top="35vh"
    >
        <el-card v-loading="loading">
            <el-row>
                <h3 style="margin: 0">修改当前所处部门</h3>
            </el-row>
            <br/>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-select style="width:100%" class="edit" v-model="defaultDept" value-key="id" size="large"
                               :disabled="read">
                        <el-option
                                v-for="dept in deptList"
                                :key="dept.value"
                                :label="dept.label"
                                :value="dept.value"
                        />
                    </el-select>
                </el-col>
            </el-row>
            <br/>
            <el-row>
                <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                    <h4 style="margin: 0">当前所处部门：{{ nowDept }}</h4>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" align="right">
                    <el-button :icon="Close" @click="visible = false" circle size="small"/>
                    <el-button type="primary" :icon="Check" circle size="small" @click="changeNowDeptName()"/>
                </el-col>
            </el-row>
        </el-card>
    </el-dialog>
</template>

<script setup>
import {ChatDotRound, Check, Close, Monitor, Setting} from '@element-plus/icons-vue'
import {ref, defineEmits, onMounted} from "vue";
import * as mp from "@/api/cloud/manage-person";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

const chat = ref('#2C6AE3')
const work = ref('')
const emit = defineEmits(['getTabStatus'])
const visible = ref(false)
const defaultDept = ref('')
const deptList = ref([])
const loading = ref(false)
const nowDept = ref()
const store = useStore()
const onSetting = () => {
    visible.value = true
    loading.value = true
    let status = getDeptList()
    if (status){
        loading.value = false
    }else {
        loading.value = false
    }
}

onMounted(()=>{
    getDeptList()
})

const getDeptList = () =>{
    deptList.value = []
    mp.getDeptList().then(res => {
        if (res.data.code === 200) {
            res.data.data.departments.forEach((dept) => {
                deptList.value.push({
                    label: dept.name,
                    value: dept.deptId
                })
            })
            if (store.state.chat.nowDept === ""){
                store.dispatch('updataNowDept', deptList.value[1].label)
                    .then(() => {
                        nowDept.value = store.state.chat.nowDept
                    })
                defaultDept.value = deptList.value.find(item => item.label === deptList.value[1].label)?.value || '';
                return true
            }else {
                nowDept.value = store.state.chat.nowDept
                defaultDept.value = deptList.value.find(item => item.label === store.state.chat.nowDept)?.value || '';
                return true
            }
        } else {
            ElMessage.error(res.data.msg)
            return false
        }
    })
}
const changeNowDeptName = () => {
    store.dispatch('updataNowDept', deptList.value.find(item => item.value === defaultDept.value).label)
        .then(() => {
            visible.value = false
            ElMessage.success("已成功切换当前部门至 " + store.state.chat.nowDept)
        })

}

const onChat = () => {
    chat.value = '#2C6AE3'
    work.value = ''
    emit('getTabStatus', 'chat')
}

const onWork = () => {
    chat.value = ''
    work.value = '#2C6AE3'
    emit('getTabStatus', 'work')
}
</script>

<style scoped>

</style>