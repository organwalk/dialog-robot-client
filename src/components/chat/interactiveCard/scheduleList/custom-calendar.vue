<template>
    <el-row justify="center">
        <el-col :xs="4" :sm="6" :md="8" :lg="24" :xl="11" align="center">
            <div style="width: 50%;text-align: center;margin-bottom: 10px;">
                <el-popover
                        placement="bottom"
                        title="选择年份"
                        :width="200"
                        trigger="click"
                >
                    <template #reference>
                        <span class="year" @click="dialogYearVisible = true">{{ yearValue }}</span>
                    </template>
                    <el-date-picker
                            v-model="yearValue"
                            type="year"
                            placeholder="Pick a year"
                            style="width: 100%;"
                            value-format="YYYY"
                            :editable="false"
                            :clearable="false"
                    />
                </el-popover>
                <el-popover
                        placement="bottom"
                        title="选择月份"
                        :width="200"
                        trigger="click"
                >
                    <template #reference>
                        <span class="month" @click="dialogYearVisible = true">{{ monthName }}</span>
                    </template>
                    <el-date-picker
                            v-model="monthValue"
                            type="month"
                            placeholder="Pick a month"
                            style="width: 100%;"
                            value-format="M"
                            :editable="false"
                            :clearable="false"
                    />
                </el-popover>
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
                    <template #default="{ row }">
                        <!-- 显示对应的日期 -->
                        <el-popover
                            placement="bottom"
                            :width="50"
                            trigger="hover"
                        >
                            <template #reference>
                                <div :class="{'choose-bg': row[index] === chooseDateValue }"
                                     @mouseover="getScheduleNum(row[index])"
                                     @click="getScheduleListByDay(row[index])"
                                     style="user-select: none;">{{ row[index] }}
                                </div>
                            </template>
                            <span>该日期有 {{ scheduleNum }} 条记录</span>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch,defineEmits} from "vue";
import * as data from "@/api/server/data";

//  获取点击的日程单元格
const handleClick = (row, column) => {
    chooseDate.value = row[column.rawColumnKey]
}

//  日历组件的基本组成单位
const weekList = ref(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
const dateList = ref([])
const today = new Date()
const chooseDateValue = computed(() => chooseDate.value)
const dialogYearVisible = ref(false)
const yearValue = ref(today.getFullYear())
const monthValue = ref(today.getMonth()+1)
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = computed(()=> monthNames[parseInt(monthValue.value)-1])
const firstDay = computed(()=>new Date(parseInt(yearValue.value.toString()), parseInt(monthValue.value.toString())-1, 1))
const lastDay = computed(()=>new Date(parseInt(yearValue.value.toString()),parseInt(monthValue.value.toString()) , 0))

const chooseDate = ref(today.getDate())
const emit = defineEmits(["sendClickDay"])
const scheduleNum = ref('0')
const hoverData = ref('')
const countList = reactive([])

watch([firstDay,lastDay,monthValue],([newFirst,newLast]) => {
    buildCalendar(newFirst,newLast)
})

onMounted(()=>{
    buildCalendar(firstDay.value,lastDay.value)
    //组件加载时获取记录数列表
    data.getScheduleCount().then(res=>{
        countList.value = res.data.scheduleData
    })
})

const getScheduleNum = (val)=>{
    hoverData.value = yearValue.value + "-" + monthValue.value + '-' +val
    const dateParts = hoverData.value.split('-');
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, '0');
    const day = dateParts[2].padStart(2, '0');
    hoverData.value = `${year}-${month}-${day}`
    const result = countList.value.find(item => item.date === hoverData.value)
    scheduleNum.value = result ? result.count : 0
}

const clickDay = ref('')
const getScheduleListByDay = (val)=>{
    clickDay.value = val
    hoverData.value = yearValue.value + "-" + monthValue.value + '-' + val
    const dateParts = hoverData.value.split('-');
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, '0');
    const day = dateParts[2].padStart(2, '0');
    hoverData.value = `${year}-${month}-${day}`
    emit('sendClickDay',hoverData.value)
}

watch([yearValue,monthValue],([newYear,newMonth])=>{
    if (newYear && newMonth){
        hoverData.value = newYear + "-" + newMonth + '-' + clickDay.value
        const dateParts = hoverData.value.split('-');
        const year = dateParts[0];
        const month = dateParts[1].padStart(2, '0');
        const day = dateParts[2].padStart(2, '0');
        hoverData.value = `${year}-${month}-${day}`
        emit('sendClickDay',hoverData.value)
    }
})

// 填充日期列表
const buildCalendar = (firstDay,lastDay) => {
    dateList.value.splice(0,dateList.value.length)
    // 获取第一天和最后一天对应的星期索引
    const firstDayIndex = ref(firstDay.getDay())
    // 创建一个二维数组，每一行代表一周，每一列代表一天
    let week = []
    let date = 1
    // 填充第一周
    for (let i = 0; i < 7; i++) {
        if (i < firstDayIndex.value) {
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
}
</script>

<style scoped>
.year {
    font-size: 30px;
    font-weight: bolder;
    color: #E5E5E5;
    user-select: none;
}

.month {
    font-size: 15px;
    font-weight: bold;
    user-select: none;
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
    --el-table-border-color: white;
}
</style>