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
                </el-row>
            </el-card>
        </el-col>
    </el-row><br/>
</template>

<script setup>
import {defineProps, ref, watch,defineEmits} from 'vue'
import {Plus} from '@element-plus/icons-vue'
defineProps({
    showPageTwo:Boolean
})

const emit = defineEmits(['sendFileStatus'])

let photoRef = ref()
const fileList = ref([])
const uploadContinue = ref(false)
watch(fileList,(newFile) => {
    console.log(fileList.value[0])
    if (newFile.length === 1){
       uploadContinue.value = true
        emit('sendFileStatus',fileList.value[0])
    }
})

const handleRemove = () => {
    fileList.value=[]
}



</script>

<style scoped>

</style>