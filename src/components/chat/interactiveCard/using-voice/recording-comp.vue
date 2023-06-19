<template>
    <el-card shadow="never" style="border: none" class="music">
        <div class="item one"></div>
        <div class="item two"></div>
        <div class="item three"></div>
        <div class="item four"></div>
        <div class="item five"></div>
        <div class="item six"></div>
        <div class="item seven"></div>
    </el-card>
</template>

<script setup>

</script>

<style scoped>
.item {
    position: absolute;
    width: 8px;
    border-radius: 6px;
    background-color: #1f94ea;
}
.music {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}
.music .one {
    height: 18px;
    transform: translateX(-60px);
}
.music .two {
    height: 53px;
    transform: translateX(-40px);
}
.music .three {
    height: 36px;
    transform: translateX(-20px);
}
.music .four {
    height: 70px;
    transform: translateX(0);
}

.music .five {
    height: 30px;
    transform: translateX(20px);
}

.music .six {
    height: 40px;
    transform: translateX(40px);
}
.music .seven {
    height: 50px;
    transform: translateX(60px);
}
@keyframes radius-animation {
    100% {
        height: 10px;
        border-radius: 50%;
        filter: contrast(2);
    }
}
.music .one {
    animation: radius-animation .3s ease;
}
.music .two {
    animation: radius-animation .6s ease;
}
.music .three {
    animation: radius-animation .57s ease;
}
.music .four {
    animation: radius-animation .52s ease;
}
.music .five {
    animation: radius-animation .4s ease;
}
.music .six {
    animation: radius-animation .3s ease;
}
.music .seven {
    animation: radius-animation .7s ease;
}
.music .item {
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    animation-direction: alternate;
    -webkit-animation-direction: alternate;
}

</style>