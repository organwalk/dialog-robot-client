<template>
    <el-row :gutter="10">
        <el-col :xs="1" :sm="2" :md="8" :lg="8" :xl="8" />
        <el-col :xs="22" :sm="20" :md="8" :lg="8" :xl="8">
            <el-card shadow="never" style="border-radius: 15px;margin-top: 15%" align="center">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                       <img src="@/assets/auth.png" style="width: 40%">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <span style="font-weight: bolder;font-size: 30px;font-family: 微软雅黑">Xeno-loader</span>
                    </el-col>
                </el-row><br/>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <span style="font-weight: bolder;font-size: 20px;font-family: 微软雅黑">登录</span>
                    </el-col>
                </el-row><br/>
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
                                      size="large" />
                        </el-col>
                    </el-row><br/>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="left" >
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
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" align="right" >
                            <el-button type="primary" color="#2C6AE3" >登录</el-button>
                        </el-col>
                    </el-row>
                </el-card>

            </el-card>
        </el-col>
        <el-col :xs="1" :sm="2" :md="8" :lg="8" :xl="8" />
    </el-row>
</template>

<script setup>
import {ref} from "vue";
import { Iphone } from '@element-plus/icons-vue'
const mobile = ref('')
</script>

<style scoped>
</style>