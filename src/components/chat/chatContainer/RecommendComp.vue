<template>
    <el-row style="margin-top: 5%">
        <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1"/>
        <el-col :xs="8" :sm="6" :md="4" :lg="10" :xl="1" align="center">
            <el-card shadow="never" style="background-color: #f7f7f7;border: none">
                <el-icon size="25px"><Sunny /></el-icon><br/>
                <span>Examples</span><br/><br/>
                <el-card  shadow="never"  v-for = "(recommend,index) in recommendList"
                          :key="index"
                          class="rec-card">
                    <span v-html="recommend"/>
                    <el-button  @click="sendRecommendText(recommend)"
                        style="border: none;float: right"
                        size="small"
                        :icon="ArrowRightBold" circle />
                </el-card>
            </el-card>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="10" :xl="1" align="center">
            <el-card shadow="never" style="background-color: #f7f7f7;border: none">
                <el-icon size="25px"><Sunrise /></el-icon><br/>
                <span>Limitations</span><br/><br/>
                <el-card shadow="never"  v-for = "(item,index) in limitationsList"
                          :key="index"
                          class="rec-card">
                    <span style="line-height: 2;" v-html="item.limitation"/>
                </el-card>
            </el-card>

        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1"/>
    </el-row>
</template>

<script setup>
import {
    Sunny,
    ArrowRightBold,
    Sunrise
} from '@element-plus/icons-vue'
import {onMounted, ref,defineEmits} from "vue";
import recommendsData from "@/optionConfig/recommendText.json"

const recommendList = ref([])
const randomIndexes = new Set();
const limitationsList = ref([])
const emit = defineEmits(['send-recommend-text'])

const sendRecommendText = (recommend) => {
   emit('send-recommend-text',recommend)
}

onMounted(()=>{
    while (randomIndexes.size < 3) {
        randomIndexes.add(Math.floor(Math.random() * recommendsData.length));
    }
    for (const index of randomIndexes) {
        recommendList.value.push(recommendsData[index].recommend);
    }

    limitationsList.value.push(
        {
            limitation: "本对话机器人基于自然语言处理模型与移动云云空间完成办公功能",
        },
        {
            limitation: "本对话机器人无法对超出内部所定义的办公功能作出有效回应",
        },
    )

})

</script>

<style scoped>
.rec-card{
    animation-name: card-bounce;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;

    border-radius: 10px;
    margin-bottom: 10px;
}
@keyframes card-bounce {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    60% {
        transform: scale(1.1);
        opacity: 1;
    }
    80% {
        transform: scale(0.95);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>