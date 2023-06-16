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
                                :before-upload="beforeUpload"
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
                                clearable
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
import {dataURLtoFile} from "image-conversion";
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
    if (newUrl !== "" && newRec.length > 0){
       uploadContinue.value = true
        emit('sendFileStatus',newUrl,newRec,'rec')
    }
})
watch([url,groupId],([newUrl,newGroup]) => {
    if (newUrl !== "" && newGroup !== ''){
        uploadContinue.value = true
        emit('sendFileStatus',newUrl,newGroup,'group')
    }
})

const handleRemove = () => {
    fileList.value=[]
}
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
    }
}

const checkType = ref('部门群')



</script>

<style scoped>

</style>