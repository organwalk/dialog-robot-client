<template>
    <el-card style="border-radius: 10px">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <el-card shadow="never" style="border-radius: 10px">
                    <img style="width: 80%;user-select: none" src="@/assets/xeno-loader-logo.png" alt="404">
                </el-card>
            </el-col>
        </el-row><br/>
        <el-row :gutter="10">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center">
                <el-card shadow="never" style="border-radius: 10px;user-select: none">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 15px;font-weight: bolder">版本</span>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 10px">V 2.4</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center">
                <el-card shadow="never" style="border-radius: 10px;user-select: none">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 15px;font-weight: bolder">运行</span>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 10px">正常</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" align="center">
                <el-card shadow="never" style="border-radius: 10px;user-select: none">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 15px;font-weight: bolder">模型</span>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                            <span style="font-size: 10px">rasa</span>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row><br/>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" align="center">
                <span style="font-size: 10px;color:#909399">© Copyright 2023, Xeno-onloaded Team</span>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
</script>

<style scoped>

</style>