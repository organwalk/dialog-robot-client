<template>
    <el-row v-show="showPageTwo">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-card shadow="never" style="border-radius: 10px">
                <el-alert v-if="uploadContinue" title="仅支持上传一张图片" type="success" center show-icon :closable="false"/><br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-upload
                                v-model:file-list="fileList"
                                :auto-upload="false"
                                list-type="picture-card"
                                :limit="1"
                                ref="photoRef"
                                :on-remove="handleRemove"
                                :http-request="uploadPic"
                        >
                            <el-icon ><Plus /></el-icon>
                        </el-upload>
                    </el-col>
                </el-row><br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-card shadow="never" style="border: none;background-color: #f5f9fa" align="center">
                            <span style="font-weight: bolder">接收对象</span><br/><br/>
                            <el-select-v2
                                v-model="receivers"
                                filterable
                                :options="options"
                                placeholder="Please select receivers"
                                style="width: 80%"
                                multiple
                            />
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {defineProps, ref, watch, defineEmits, onMounted} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import * as card from '@/api/cloud/card'
import * as auth from '@/api/cloud/auth'
defineProps({
    showPageTwo:Boolean
})

const emit = defineEmits(['sendFileStatus'])

let photoRef = ref()
const fileList = ref([])
const uploadContinue = ref(false)
const receivers = ref([])
const options = ref([])
onMounted(()=>{
    auth.getDeptList().then(res=>{
        let dept = res.data.data.departments
        let opDept = dept.map(d => {
            return {
                value: d.deptId,
                label: d.name
            }
        })
        options.value.push({
            label:'部门群',
            options:opDept
        })
    })
    card.getPersonList().then(res=>{
        let users = res.data.data.userList
        let opUsers = users
            .map(user => ({ value: user.userId, label: user.name }))
            .filter((user, index, arr) => (
                arr.findIndex(u => u.value === user.value && u.label === user.label) === index
            ));
        options.value.push({
            label: '人员',
            options:opUsers
        })
    })
})
watch([fileList,receivers],([newFile,newRec]) => {
    if (newFile.length === 1){
       uploadContinue.value = true
        emit('sendFileStatus',fileList.value[0],newRec)
    }
})

const handleRemove = () => {
    fileList.value=[]
}





</script>

<style scoped>

</style>