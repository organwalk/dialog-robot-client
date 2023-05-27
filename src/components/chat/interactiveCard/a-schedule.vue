<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
            <span style="font-weight: bolder;align-items: center">Today's schedule</span>
        </el-col>
    </el-row>
    <br/>
    <div style="width: 100%;height:480px;overflow-y: auto">
        <el-card v-for="(item,index) in scheduleList"
                 :key=index
                 shadow="never" style="border: none;background-color: #f5f9fa;border-radius: 10px;margin-bottom: 10px">
            <el-row justify="center">
                <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="left">
                    <el-collapse>
                        <el-collapse-item :title="item.time">
                            <h5>{{ item.des }}</h5>
                        </el-collapse-item>
                    </el-collapse>
                    <h4>{{ item.title }}</h4>
                    <span style="font-size: 10px;color: #808080">{{ item.releaser }} released this schedule | location: {{
                        item.location
                        }}</span>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
import {ref} from "vue";

const scheduleList = ref([])
scheduleList.value.push(
    {
        time: "08:30-09:30",
        title: "Working morning",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
        location: "P.C street"
    },
    {
        time: "08:30-09:30",
        title: "Working morning",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
        location: "P.C street"
    },
    {
        time: "08:30-09:30",
        title: "Working morning",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
        location: "P.C street"
    },
    {
        time: "08:30-09:30",
        title: "Working morning",
        des: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
        releaser: "John",
        location: "P.C street"
    },
)


</script>

<style scoped>
/deep/ .el-collapse-item__header {
    background-color: #f5f9fa;
    border: none;
}

/deep/ .el-collapse {
    --el-collapse-border-color: none;
    --el-collapse-header-height: 20px;
    --el-collapse-content-bg-color: none;
}

/deep/ .el-collapse-item__content {
    padding: 0;
}

::-webkit-scrollbar {
    display: none;
}
</style>