<script setup>

import {nextTick, onMounted, ref} from "vue";
import detectHistoryService from "@/ViewModel/detectHistory/detectHistroyService.js";
import DeviceModel from "@/Model/device/deviceModel.js";
// 用于存储流式返回的文本内容
const streamContent = ref("");
// 用于自动滚动的容器引用
const contentContainer = ref(null);

const  endTime=ref(null);
const  subTime=ref(null);
const  selectTopic=ref(null);
// const  startTime=ref(null);
const parseDateTime = (datetimeStr) => {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = datetimeStr?.match(regex);
  if (!match) return null;

  const [_, year, month, day, hour, minute, second] = match;
  return new Date(year, month-1, day, hour, minute, second).getTime();
};
const Test=()=>{
   console.log(parseDateTime(endTime.value));
   console.log(parseDateTime(endTime.value)-subTime.value);
   console.log(selectTopic.value)
}
const getSSELog = async () => {
  // 每次请求前清空内容
  streamContent.value = "";

  // 构建查询参数
  const params = new URLSearchParams();
  params.append('topic', selectTopic.value);
  params.append('start', parseDateTime(endTime.value)-subTime.value);
  params.append('end', parseDateTime(endTime.value));

  // 拼接完整URL
  const url = `http://localhost:8080/ai/deepseek/ai/chat/historyTest2?${params.toString()}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    console.log(event.data);
    // 排除结束标记，只拼接有效内容
    if (event.data !== '[STREAM_END]') {
      streamContent.value += event.data;

      // 自动滚动到最新内容
      nextTick(() => {
        if (contentContainer.value) {
          contentContainer.value.scrollTop = contentContainer.value.scrollHeight;
        }
      });
    } else {
      eventSource.close();
      console.log('stream end');
    }
  };

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();  // 出错时关闭连接
  };

  // 添加连接关闭处理
  eventSource.onclose = () => {
    console.log('EventSource connection closed');
  };
};
</script>

<template>
  <div class="report-container">
    <div class="report-title">
      <div class="title-text">
        <h3>生成报告</h3>
      </div>
      <div class="title-box">
        <input type="text" placeholder="输入起始时间 (年-月-日 时:分:秒)" v-model="endTime">
        <select v-model="subTime">
          <option :value="0">按时间筛选</option>
          <option :value="60000*15">15分钟内</option>
          <option :value="60000*30">半小时内</option>
          <option :value="60000*60">1小时内</option>
        </select>
        <select v-model="selectTopic">
          <option>选择设备</option>
          <option v-for="item in DeviceModel.DeviceList.value" :value="item.deviceTopic">{{item.deviceTopic}}</option>
        </select>
        <button class="search-btn" @click="getSSELog" style="margin-left: 10px">生成报告</button>
        <button class="search-btn" @click="Test">测试</button>
      </div>

    </div>
    <div class="title-line" ></div>
    <!-- 流式内容展示区域 -->
    <div class="report-content" ref="contentContainer">
      <pre class="stream-text">{{ streamContent }}</pre>  <!-- 使用pre标签保留格式 -->
    </div>
  </div>
</template>

<style scoped>

.report-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 15px;
  .report-title{
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    .title-box{
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
    }

  }
  .title-line{
    margin-top: 30px;
    width: 90%;
    height: 1px;
    background: white;
  }
  .report-content{
    margin-top: 30px;
    width: 800px;
    height:500px;
    overflow: auto;  /* 添加上下滚动条 */
    padding: 15px;   /* 增加内边距 */
    border-radius: 10px;
    border: 1px solid #ccc;
    display: flex;
    text-align: left;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    .stream-text {
      margin: 0;
      white-space: pre-wrap;  /* 自动换行 */
      word-break: break-all;  /* 长单词换行 */
      color: #fff;            /* 文本颜色 */
      font-family: monospace; /* 等宽字体，适合日志/代码显示 */
      line-height: 1.6;       /* 行高优化 */
    }
  }

}
input {
  padding: 8px 12px;
  margin-right: 6px;
  width: 200px;
  border: 1px solid #304156;
  border-radius: 4px;
  height: 28px;
  background: #2d3a4b;
  color: #fff;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
  }

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
  }
}
select {
  margin-left: 5px;
  padding: 0 12px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content:center;
  border: 1px solid #304156;
  border-radius: 4px;
  background: #2d3a4b url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2390a3bf'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
  color: #fff;
  appearance: none;
  transition: all 0.3s;
  width: 100px;

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
    margin-left: 5px;
    background: #1f2d3d;
    color: #fff;
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