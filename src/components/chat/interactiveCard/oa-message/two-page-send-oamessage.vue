<template>
    <el-row v-show="showPageTwo">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
            <el-card shadow="never" style="border-radius: 10px">
                <el-alert v-if="uploadContinue" title="仅支持上传一张图片" type="success" center show-icon :closable="false"/><br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-upload
                                v-model:file-list="fileList"
                                action="https://organwalk.ink/api/image"
                                name="image"
                                method="post"
                                :auto-upload="true"
                                list-type="picture-card"
                                :limit="1"
                                ref="photoRef"
                                :on-remove="handleRemove"
                                @change="handleChange"
                        >
                            <el-icon ><Plus /></el-icon>
                        </el-upload>
                    </el-col>
                </el-row><br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                        <el-card shadow="never" style="border: none;background-color: #f5f9fa" align="center">
                            <el-radio-group v-model="checkType" size="small">
                                <el-radio-button label="部门群" />
                                <el-radio-button label="人员" />
                            </el-radio-group><br/><br/>
                            <el-select-v2
                                v-model="groupId"
                                v-if="checkType === '部门群' "
                                filterable
                                :options="options"
                                placeholder="Please select group"
                                style="width: 80%"
                            />
                            <el-select-v2
                                v-model="receivers"
                                v-if="checkType === '人员' "
                                filterable
                                :options="groupList"
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
const groupId = ref()
const receivers = ref([])
const options = ref([])
const groupList = ref([])
const url = ref('')
onMounted(()=>{
    auth.getGroupList().then(res=>{
        let dept = res.data.data
        let opDept = dept.map(d => {
            return {
                value: d.groupId,
                label: d.groupName
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
        groupList.value.push({
            label: '人员',
            options:opUsers
        })
    })
})
watch([url,receivers],([newUrl,newRec]) => {
    if (newUrl !== ""){
       uploadContinue.value = true
        groupId.value = []
        emit('sendFileStatus',newUrl,newRec)
    }
})
watch([url,groupId],([newUrl,newGroup]) => {
    if (newUrl !== ""){
        uploadContinue.value = true
        emit('sendFileStatus',newUrl,newGroup)
    }
})

const handleRemove = () => {
    fileList.value=[]
}

const handleChange = (res) => {
    if (res.status === "success") {
        url.value = res.response
        console.log(url.value);
    }
}

const checkType = ref('部门群')



</script>

<style scoped>

</style>