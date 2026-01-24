<script setup>
import {nextTick, onMounted, ref} from "vue";
import videoService from "@/ViewModel/ws-video/VideoService.js";
import DeviceModel from "@/Model/device/deviceModel.js";
import DeviceService from "@/ViewModel/device/deviceService.js";
import messageService from "@/ViewModel/ws-video/messageService.js";

const messages = ref([]);
const contentContainer = ref(null);
const hasPerson = ref(false); // 新增响应式状态

onMounted(async () => {
  DeviceModel.DeviceList.value = await DeviceService.GetDeviceList(localStorage.getItem("nowUser"))
  // console.log(DeviceModel.DeviceList.value)
})

onMounted(() => {

  // videoService.getMessage({
  //   onMessage: (newMessages) => {
  //     messages.value = newMessages;
  //     const lastMessage = newMessages[newMessages.length - 1];
  //     // 关键修复：判断新消息数组是否有内容
  //     if (newMessages && newMessages.length > 0) {
  //       hasPerson.value = true;
  //       // 清除上一次的定时器，避免多次消息导致状态提前关闭
  //       clearTimeout(window.emergencyTimer);
  //       window.emergencyTimer = setTimeout(() => {
  //         hasPerson.value = false;
  //       }, 10000); // 10秒后恢复
  //     }
  //
  //     // 自动滚动到底部
  //     nextTick(() => {
  //       if (contentContainer.value) {
  //         contentContainer.value.scrollTop = contentContainer.value.scrollHeight;
  //       }
  //     })
  //   }
  //
  // });
   videoService.getMessageList(({
     onMessage: (newMessages,topic) => {
       messages.value = newMessages;
       console.log('收到最新消息列表：', messages);
       console.log(topic);

           const lastMessage = newMessages[newMessages.length - 1];

       // 1. 定义正则表达式
         const hasUrgentReg = /urgent/; // 匹配包含urgent的topic（区分大小写）
         // 若需不区分大小写，用 /urgent/i
         // const hasUrgentReg = /urgent/i;

         const excludeTopicReg = /^\/topic\/image2\/message/; // 匹配/topic/image2/message开头的路径

         // 2. 条件判断：有新消息 + 包含urgent + 不是排除的topic
         const isNeedTrigger = newMessages && newMessages.length > 0
                   && hasUrgentReg.test(topic)
                   // 关键修复：判断新消息数组是否有内容
           if (isNeedTrigger) {
             hasPerson.value = true;
             // 清除上一次的定时器，避免多次消息导致状态提前关闭
             clearTimeout(window.emergencyTimer);
             window.emergencyTimer = setTimeout(() => {
               hasPerson.value = false;
             }, 10000); // 10秒后恢复
           }else {
             hasPerson.value = false;
           }
           nextTick(() => {
             if (contentContainer.value) {
               contentContainer.value.scrollTop = contentContainer.value.scrollHeight;
             }
           })

     }
   }))
})
</script>

<template>
<div class="cat-message-container">
    <div class="cat-message-show-top">
        <div class="title">
            <h3>实时消息</h3>
        </div>
        <div class="option-bar">
          <select>
            <option value="1">设备列表</option>
            <option v-for="item in DeviceModel.DeviceList.value" :value="item.deviceId">{{item.deviceName}}</option>
          </select>
          <button class="search-btn">查询</button>
        </div>

    </div>
    <div class="line"></div>
  <div class="cat-message-show-body">
    <div class="log-container" ref="contentContainer">
        <pre
            class="stream-text"
            v-for="(msg, index) in messages"
            :key="index"
        >{{ msg }}</pre>
    </div>
  </div>

  <div class="message-wrong">
    <div class="left" :style="{ background: hasPerson ? '#ff4d4f' : 'blue' }">
      <span v-if="hasPerson">当前检测到人 👤</span>
      <span v-else>当前无人 🚫</span>
    </div>
    <div class="right">

    </div>
  </div>
</div>
</template>

<style scoped>
.cat-message-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 15px;
    .title{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .option-bar{
      margin-top: 10px;
      margin-left: -10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
    .line{
      margin-top: 10px;
      width: 600px;
      height: 1px;
      background: #ccc;
    }
    .cat-message-show-body{
      width: 600px;
      height: 300px;
      border-radius: 8px;
      border:  1px solid #ccc;
      margin-top: 10px;
      .log-container {
        height: 100%;
        overflow-y: auto;
        padding: 8px;
        scroll-behavior: smooth;
      }

      .stream-text {
        margin: 4px 0;
        font-size: 12px;
      }
    }
   .message-wrong{
     display: flex;
     margin-top: 5px;
     flex-direction: row;
     width: 600px;
     height: 100px;
     .left{
      width: 50%;
      height: 100px;
       border-radius: 8px;
       border: 1px solid #ccc;
       transition: background-color 0.3s; /* 添加过渡效果 */
     }
     .right{
      width: 50%;
       height: 100px;
       border-radius: 8px;
       border: 1px solid #ccc;
     }
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
</style>