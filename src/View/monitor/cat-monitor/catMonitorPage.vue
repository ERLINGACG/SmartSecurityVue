<script setup>
import videoService from "@/ViewModel/ws-video/VideoService.js";
// import {onMounted} from "vue";
import {ref, onMounted, onUnmounted} from "vue";

const fps = ref(0);
let frameCount = 0;
let timerId = null;
onMounted(() => {

  // 启动帧率计时器
  timerId = setInterval(() => {
    fps.value = frameCount;
    frameCount = 0;
  }, 1000);

  videoService.connect(
      {
        onMessage(base64Image) {
          frameCount++; // 每收到一帧就计数

          document.getElementById('video-frame').src = `data:image/jpeg;base64,${base64Image}`;
        }
      }
  );
  videoService.fpsChart(document.getElementById('fpsChart'), fps);
  // 清理定时器
  onUnmounted(() => {
    clearInterval(timerId);
  })
})
</script>

<template>
  <div class="cat-monitor-page-container">
    <div class="cat-monitor-page-show-top">
      <div class="cat-monitor-page-show-img">
        <img id="video-frame" src="" alt="">
        <!-- 新增帧率显示 -->
        <div class="fps-counter">FPS: {{ fps }}</div>
      </div>
      <div class="cat-monitor-page-show-do-right">
        <div class="fps-counter">FPS: {{ fps }}</div>
        <div class="option-bar">

          <button class="search-btn">停止</button>
          <button class="search-btn">开始</button>
          <button class="search-btn">暂停</button>
        </div>
        <div class="fps-chart">
          <div id="fpsChart" style="width: 100%; height: 300px"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

.cat-monitor-page-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 500px;
  width: 60vw;
}
.cat-monitor-page-show-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.cat-monitor-page-show-img {

  width: 500px;
  height:500px;

  border-radius: 10px;
  border: 1px solid #ccc;
  overflow: hidden; /* 隐藏溢出内容 */
  img{
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保持比例填充容器 */

  }
}
.cat-monitor-page-show-do-right {

  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: calc(60vw - 500px);
  height: 500px;

  border-radius: 10px;
  border: 1px solid #ccc;
  .option-bar{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    button{
      margin-right: 10px;
    }
  }
  .fps-chart{
    margin-top: 120px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}
.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 32px;
  background: #1890ff;
  color: white;
  border: none;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
}
</style>