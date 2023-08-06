<template>
    <el-row style="margin-top: 5%">
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="1"/>
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" align="center">
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
                <el-row justify="center" class="carousel-indicators">
                    <li v-for="(n, index) in 5" :key="n" :class="{ active: index === indexActive}" :data-index="index"  @mouseover="hoverTheActive"></li>
                </el-row>
            </el-card>
        </el-col>
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" align="center">
            <el-card shadow="never" style="background-color: #f7f7f7;border: none">
                <el-icon size="25px"><Sunrise /></el-icon><br/>
                <span>Limitations</span><br/><br/>
                <el-card shadow="never"  v-for = "(item,index) in limitationsList"
                          :key="index"
                         style="height: 150px;line-height: 100px"
                          class="rec-card">
                    <p style="line-height: 2;" v-html="item"/>
                </el-card>
            </el-card>

        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"/>
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
const limitationsList = ref([])
const emit = defineEmits(['send-recommend-text'])

const sendRecommendText = (recommend) => {
   emit('send-recommend-text',recommend)
}
const indexActive = ref(0)
const hoverTheActive = (event) => {
    indexActive.value = Number(event.target.dataset.index)
    recommendList.value = printSlice(indexActive.value)
}

onMounted(()=>{
   recommendList.value = printSlice(1)
   limitationsList.value = recommendsData.limitation
})

function printSlice(index) {
    const shuffledRecommend = shuffle(recommendsData.recommend);
    const start = index * 3;
    const end = start + 3;
    return shuffledRecommend.slice(start, end)
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
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
.carousel-indicators li{
    list-style-type: none;
    width: 10px; height: 10px;
    border-radius: 50%;
    background-color: lightgray;
    margin: 5px;
}
.carousel-indicators li.active{
    background-color: gray;
}
.carousel-indicators li:hover{
    background-color: gray;
}
</style>