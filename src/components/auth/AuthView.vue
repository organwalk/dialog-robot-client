<template>
    <el-row :gutter="10">
        <el-col :xs="1" :sm="2" :md="8" :lg="8" :xl="8"/>
        <el-col :xs="22" :sm="20" :md="8" :lg="8" :xl="8">
            <el-card shadow="never" style="border-radius: 15px;margin-top: 15%" align="center" v-loading="loading">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <img src="@/assets/auth.png" style="width: 40%" alt="not photo">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <span style="font-weight: bolder;font-size: 30px;font-family: 微软雅黑,system-ui">Xeno-loader</span>
                    </el-col>
                </el-row>
                <br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <span style="font-weight: bolder;font-size: 20px;font-family: 微软雅黑,system-ui">登录</span>
                    </el-col>
                </el-row>
                <br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <span>请使用您的移动云空间账号登录</span>
                    </el-col>
                </el-row>
                <el-card shadow="never" style="border: none">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" center>
                            <el-input maxlength="11"
                                      show-word-limit
                                      autofocus
                                      v-model="mobile"
                                      placeholder="电话号码"
                                      :prefix-icon="Iphone"
                                      size="large"/>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="left">
                            <el-popover
                                    placement="bottom"
                                    :width="200"
                                    trigger="click"
                            >
                                <template #reference>
                                    <el-button text style="color: #2C6AE3">了解详情</el-button>
                                </template>
                                <span>授权服务由移动云空间提供，本客户端暂不提供账号注册服务</span>
                            </el-popover>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right">
                            <el-button type="primary" color="#2C6AE3" @click="login()">登录</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-card>
        </el-col>
        <el-col :xs="1" :sm="2" :md="8" :lg="8" :xl="8"/>
    </el-row>
</template>

<script setup>
import {reactive, ref} from "vue";
import {Iphone} from "@element-plus/icons-vue"
import * as auth from '@/api/cloud/auth'
import * as save from "@/api/server/save-data";
import {ElMessage} from "element-plus";

const mobile = ref('')
const loading = ref(false)
const user = reactive({
    mobile: '',
    uid: '',
    name: '',
    deptName: ''
})

const login = () => {
    if (mobile.value === '' || mobile.value.length < 11) {
        ElMessage.error("请您重新检查电话号码填写")
    } else {
        loading.value = true
        auth.getAccessToken()
        setTimeout(() => {
            auth.getUidByAccount(mobile.value).then(res =>{
                sessionStorage.setItem("uid",res.data.data.uid)
                sessionStorage.setItem("mobile",mobile.value)
                auth.getDeptListByUid().then(res => {
                    sessionStorage.setItem("deptId",res.data.data[1].id)
                    user.deptName = res.data.data[1].name
                    auth.getUserInfoByUid().then(res => {
                        user.mobile = res.data.data.mobile
                        user.uid = res.data.data.uid
                        user.name = res.data.data.userName
                        save.saveUserInfo(user).then(res => {
                                if (!res.data.success) {
                                    redisError()
                                } else {
                                    auth.getDeptList().then(res=>{
                                        if (res.data.code === 200){
                                            const deptArray = res.data.data.departments.map(dept => {
                                                return {
                                                    deptId: dept.deptId,
                                                    parentId: dept.parentId,
                                                    name: dept.name,
                                                    order: dept.order
                                                };
                                            });
                                            save.saveDeptList(deptArray).then(res=>{
                                                if (!res.data.success){
                                                    redisError()
                                                }else {
                                                    auth.getGroupList().then(res => {
                                                        save.saveGroupList(res.data.data).then(res=>{
                                                            if (!res.data.success){
                                                                redisError()
                                                            }else {
                                                                auth.getDeptPersonList().then(res=>{
                                                                    const personList = res.data.data.users.map(person => {
                                                                        return {
                                                                            id: person.id.toString(),
                                                                            name: person.name,
                                                                            mobile: person.mobile,
                                                                            sequence: person.sequence,
                                                                            orgId: person.orgId,
                                                                            privilege: "mydeptonly"
                                                                        }
                                                                    })
                                                                    save.saveDeptPersonList(personList).then(res=>{
                                                                        if (!res.data.success){
                                                                            redisError()
                                                                        }else {
                                                                            loading.value = false
                                                                            window.location.href = '/chat'
                                                                        }
                                                                    })
                                                                })

                                                            }
                                                        })

                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        )
                    })
                })
            } )
        }, 500)
    }
}

const redisError = () => {
    loading.value = false
    ElMessage.error("缓存服务器出错，请重试")
}

</script>

<style scoped>
</style>