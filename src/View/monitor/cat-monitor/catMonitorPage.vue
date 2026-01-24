<script setup>
import videoService from "@/ViewModel/ws-video/VideoService.js";
// import {onMounted} from "vue";
import {ref, onMounted, onUnmounted} from "vue";
import deviceService from "@/ViewModel/device/deviceService.js";
import request from "@/ViewModel/utils/httpUtils.js";

const fps = ref(0);
let frameCount = 0;
let timerId = null;


const value = ref(0); // 滑块值（必须定义，v-model绑定）
const resolutionText = ref('低'); // 分辨率文本
const showTooltip = ref(false); // 提示框显示状态
let tooltipDom = null; // 提示框DOM元素

// 滑块值改变事件
const handleChange = (e) => {
  value.value = Number(e.target.value);
  updateResolutionText(value.value); // 同步更新分辨率文本
};

// 修复后的悬浮事件：核心是「每次hover都重新获取DOM + 改用transform定位」
const handleSliderHover = (e) => {
  const currentValue = Number(e.target.value);
  updateResolutionText(currentValue);
  showTooltip.value = true;

  // 修复1：每次hover都重新获取DOM（兜底，避免初始null）
  tooltipDom = tooltipDom || document.querySelector('.slider-tooltip');
  if (!tooltipDom) return;

  const slider = e.target;
  // 修复2：固定滑块宽度基准（避免auto导致width为0）
  const sliderWidth = slider.offsetWidth || 150; // 200是CSS中滑块的固定宽度
  // 计算滑块按钮的百分比位置（0-100%）
  const percent = currentValue / 90;
  // 按钮中心位置 = 滑块宽度 * 百分比 - 按钮宽度/2（按钮宽度20px）
  const thumbCenter = (sliderWidth * percent);
  // 提示框居中 = 按钮中心 - 提示框宽度/2
  const tooltipOffset = thumbCenter - (tooltipDom.offsetWidth / 2);

  // 修复3：改用transform定位（流畅+兼容），放弃left
  tooltipDom.style.transform = `translateX(${tooltipOffset}px)`;
  // 兜底：重置left，避免之前的错误值干扰
  tooltipDom.style.left = '0';
};

const hideTooltip = () => {
  showTooltip.value = false;
};

const updateResolutionText = (val) => {
  switch (val) {
    case 0:
      resolutionText.value = '低';
      break;
    case 30:
      resolutionText.value = '中';
      break;
    case 60:
      resolutionText.value = '高';
      break;
    case 90:
      resolutionText.value = '超高';
      break;
    default:
      resolutionText.value = '低';
  }
};

// 滑块值改变事件
const deviceModel = ref([]);
const selectedDevice = ref(localStorage.getItem('cat-selectedDevice') || '');
// selectedDevice.value = await deviceService.GetDeviceList(localStorage.getItem("nowUser"))
const UpdateLocalDevice = (e) => {
  console.log(e.target.value)
  localStorage.setItem('cat-selectedDevice', e.target.value);
}


const postService=async (cmd_)=>{
  const res=await request.get(' http://localhost:8080/mqtt/sendCmd',{
    params:{
      topic:localStorage.getItem('cat-selectedDevice'),
      cmd:cmd_
    }
  })
}
const postCmd = async () => {
  // value.value
  console.log(value.value)
  switch (value.value) {
    case 0:
      await postService("LOW_RESOLUTION")
      break;
    case 30:
      await postService("MEDIUM_RESOLUTION")
      break;
    case 60:
      await postService("HIGH_RESOLUTION")
      break;
    case 90:
      await postService("ULTRA_HIGH_RESOLUTION")
      break;
  }
}

onMounted(async () => {

  deviceModel.value = await deviceService.GetDeviceList(localStorage.getItem("nowUser"))
  console.log(deviceModel.value)
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

        <div class="option-bar" style="margin-top: 50px;">

          <div class="button-bar">
            <button class="search-btn">停止</button>
            <button class="search-btn">开始</button>
            <button class="search-btn">暂停</button>
          </div>

          <div class="span-bar" style="margin-top: 10px; position: relative;">
            <input
                type="range"
                v-model.number="value"
                min="0"
                max="90"
                step="30"
                @mousemove="handleSliderHover"
                @mouseleave="hideTooltip"
                @input="handleChange"
                class="custom-range-slider"
            >
            <!-- 悬浮提示框 -->
            <div class="slider-tooltip" v-show="showTooltip">
              {{ resolutionText }}
            </div>
            <button class="search-btn" style="margin-left: 5px;" @click="postCmd">设置分辨率</button>
            <!-- <span>{{ value }}</span> -->
          </div>

          <div class="select-device" style="margin-left: 5px;">
            <select @change="UpdateLocalDevice" v-model="selectedDevice">
              <option v-for="topic in deviceModel" :value="topic.deviceTopic">{{topic.deviceTopic}}</option>
            </select>
            <button class="search-btn" style="margin-left: 10px; height: 30px;width: 130px;">连接设备</button>
          </div>
        </div>
        <div class="fps-chart" style="margin-top: 50px">
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
  .fps-counter {
    position: absolute;
    top: 120px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
      .button-bar{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        button{
        margin-right: 10px;
        }
      }
    .span-bar{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      input{
        margin-right: 10px;
      }
      .custom-range-slider {
        /* 重置默认样式 */
        -webkit-appearance: none;
        appearance: none;
        width: 150px; /* 固定宽度，提升可控性 */
        height: 6px;

        border-radius: 3px;
        outline: none;
        cursor: pointer;
        transition: all 0.2s ease;
        margin: 0; /* 清除默认margin */
        /* 核心：添加刻度背景 */
        background:
          /* 轨道底色 */
            linear-gradient(#e5e7eb, #e5e7eb) center/100% 6px no-repeat,
              /* 刻度线：每15px一条（对应0-100共10个刻度） */
            repeating-linear-gradient(
                to right,
                #9ca3af, /* 刻度颜色 */
                #9ca3af 1px, /* 刻度宽度 */
                transparent 1px,
                transparent 15px /* 刻度间距（根据宽度/刻度数调整） */
            ) center/100% 12px no-repeat; /* 12px是刻度高度（超出轨道部分） */
      }
      .custom-range-slider::-moz-range-track {
        width: 200px;
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        border: none;
      }
      .custom-range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 40px;
        height: 20px;
        background: #3b82f6; /* 蓝色主色调 */
        border-radius: 4px; /* 圆角方形，数值越小越方，越大越圆 */
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }

      /* 滑块交互状态 */
      .custom-range-slider:hover {
        background: #d1d5db;
      }

      .custom-range-slider:hover::-webkit-slider-thumb {
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
      }

      .custom-range-slider:hover::-moz-range-thumb {
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
      }
      /* 悬浮提示框样式 */
      .slider-tooltip {
        position: absolute;
        top: -35px; /* 提示框在滑块上方 */
        left: 0; /* 动态计算定位 */
        background: #1f2937;
        color: #fff;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: none; /* 避免遮挡鼠标事件 */
        z-index: 99;
        transition: opacity 0.2s ease;
      }
      .slider-tooltip::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #1f2937;
      }

    }

  }
  .select-device{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    height: 50px;
    select {


      padding: 8px 12px;
      border: 1px solid #304156;
      border-radius: 4px;
      background: #2d3a4b url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2390a3bf'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
      color: #fff;
      appearance: none;
      transition: all 0.3s;
      width: 150px;
      height: 30px;
      margin-left: -10px;
      &:hover {
        border-color: #409eff;
        cursor: pointer;
      }

      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
        outline: none;
      }

      option {
        background: #1f2d3d;
        color: #fff;
      }
    }
  }
  .fps-chart{
    margin-top: 100px;
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