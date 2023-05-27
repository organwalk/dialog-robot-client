<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <div style="width: 50%;text-align: center;margin-bottom: 10px;">
                <span class="year">{{ year }}</span>
                <span class="month">{{ today.toLocaleString('en',{ month: 'long' }) }}</span>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <el-table :data="dateList"
                      :cell-style="{'text-align':'center'}"
                      :header-cell-style="{'text-align':'center'}"
                      @cell-click="handleClick">
                <!-- 使用v-for指令遍历星期列表 -->
                <el-table-column v-for="(week, index) in weekList"
                                 :key="index"
                                 :label="week"
                                 :prop="index"
                                 :min-width="`${100 / 7}%`">
                    <!-- 使用作用域插槽自定义单元格内容 -->
                    <template #default="{ row }" >
                        <!-- 显示对应的日期 -->
                        <div :class="{'choose-bg': row[index] === chooseDateValue }"
                            style="user-select: none;" >{{ row[index] }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";

const weekList = ref(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
// 定义日期列表
const dateList = ref([])
// 获取当前月份的第一天和最后一天
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const firstDay = new Date(year, month, 1)
const lastDay = new Date(year, month + 1, 0)
// 填充日期列表
onMounted(()=>{
    // 获取第一天和最后一天对应的星期索引
    const firstDayIndex = firstDay.getDay()
    // 创建一个二维数组，每一行代表一周，每一列代表一天
    let week = []
    let date = 1
    // 填充第一周
    for (let i = 0; i < 7; i++) {
        if (i < firstDayIndex) {
            // 填充空字符串
            week.push('')
        } else {
            // 填充日期
            week.push(date)
            date++
        }
    }
    // 将第一周添加到日期列表中
    dateList.value.push(week)
    // 填充剩余的周数
    while (date <= lastDay.getDate()) {
        week = []
        for (let i = 0; i < 7; i++) {
            if (date > lastDay.getDate()) {
                // 填充空字符串
                week.push('')
            } else {
                // 填充日期
                week.push(date)
                date++
            }
        }
        // 将每一周添加到日期列表中
        dateList.value.push(week)
    }

})
const chooseDate = ref(today.getDate())
const handleClick = (row, column) => {
    chooseDate.value = row[column.rawColumnKey]
}
const chooseDateValue = computed(() => chooseDate.value)

</script>

<style scoped>
.year {
    font-size: 30px;
    font-weight: bolder;
    color: #E5E5E5;
}

.month {
    font-size: 15px;
    font-weight: bold;
}

.choose-bg {
    background-color: #2C6AE3;
    border-radius: 5px;
    width: 50%;
    display: inline-block;
    text-align: center;
    color: white;
}
/deep/ .el-table {
    --el-table-border-color:white;
}
</style>