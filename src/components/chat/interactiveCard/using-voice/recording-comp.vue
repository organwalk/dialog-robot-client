<template>
    <el-card shadow="never" style="border: none">
        <div class="box" ref="box"></div>
    </el-card>
</template>

<script setup>

import {onMounted, ref} from "vue";

const box = ref(null);
onMounted(() => {
    const count = 40;
    const mid = count / 2
    for (let i = 0; i < count; i++) {
        const hr = document.createElement("hr");
        hr.classList.add("animate")
        let scale = Math.random();
        const distanceFromMiddle = Math.abs(i - mid);
        if (distanceFromMiddle < mid / 2) {
            scale = scale < 0.3 ? scale + 0.3 : scale;
        }
        scale *= (1 - distanceFromMiddle / mid) * 20;
        hr.style.setProperty("--scale", scale);
        hr.style.animationDelay = Math.random() > 0.5 ? "180ms" : "100ms";
        box.value.appendChild(hr); // 确保box.value是一个DOM元素
    }
})
</script>

<style>
hr {
    background-color: #333;
    width: 2px;
    height: 5px;
    margin: 0 3px;
    display: inline-block;
    border: none;
}
.animate {
    animation: note 180ms ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

@keyframes note {
    0% {
        transform: scaleY(1);
    }

    100% {
        transform: scaleY(var(--scale));
    }
}

.box {
    margin: auto;
    height: 200px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    --scale: 1;
} </style>