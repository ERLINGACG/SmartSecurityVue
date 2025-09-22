<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import DeviceModel from "@/Model/device/deviceModel.js";
import DeviceService from "@/ViewModel/device/deviceService.js";
import detectHistoryService from "@/ViewModel/detectHistory/detectHistroyService.js";
import detectHistoryModel from "@/Model/detectHistory/detectHistoryModel.js";

const startTime=ref(0);
const endTime=ref(0);
const deviceTopic=ref("")

const postKeyData=ref({});
// 新增日期解析函数
const parseDateTime = (datetimeStr) => {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = datetimeStr?.match(regex);
  if (!match) return null;

  const [_, year, month, day, hour, minute, second] = match;
  return new Date(year, month-1, day, hour, minute, second).getTime();
};


const formatDateTime = (timestamp) => {
  console.log(timestamp);
  // if (!timestamp) return '';
  const date = new Date(timestamp);

  const addZero = n => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());
  const second = addZero(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
const timeTest=async () => {
  const timestamp = parseDateTime(startTime.value);
  console.log('选择设备:', deviceTopic.value);
  console.log('时间戳:', timestamp);
  console.log('结束时间戳:', endTime.value);
  detectHistoryModel.getBetweenDataList = await detectHistoryService.getHistoryBetweenDates(
      deviceTopic.value,
      formatDateTime(timestamp),
      formatDateTime(timestamp - endTime.value)
  )
  if (timestamp && endTime.value) {
    console.log('时间差:', timestamp - endTime.value);
    console.log('时间格式化:', formatDateTime(timestamp - endTime.value));
  }

}

const img=ref(null);
const postKeyData_=async () => {
  console.log(postKeyData.value);
  img.value = await detectHistoryService.getKeyImages(
      postKeyData.value.topic,
      postKeyData.value.path
  )

}
const clear=() => {

  img.value = null;
}
const save = () => {
    if (img.value) {
      const a = document.createElement('a');
      a.href = img.value;
      a.download = 'keyframe.jpg';
      a.click();
    }
}
onMounted(async () => {
  DeviceModel.DeviceList.value = await DeviceService.GetDeviceList(localStorage.getItem("nowUser"))
})
</script>

<template>
  <div class="log-container">
    <div class="title-txt">
      <h3>
        查看关键帧
      </h3>
    </div>
    <div class="title">

      <input type="text" placeholder="输入起始时间 (年-月-日 时:分:秒)" v-model="startTime">
      <select v-model="endTime">
        <option :value="0">按时间筛选</option>
        <option :value="60000*15">15分钟内</option>
        <option :value="60000*30">半小时内</option>
        <option :value="60000*60">1小时内</option>
      </select>
      <select v-model="deviceTopic">
        <option>选择设备</option>
        <option v-for="item in DeviceModel.DeviceList.value" :value="item.deviceTopic">{{item.deviceTopic}}</option>
      </select>



      <button class="search-btn" style="margin-left: 10px" @click="timeTest()">查询</button>

    </div>
    <div class="title-line"></div>
    <div class="body">
      <div class="select-box">
      <select v-model="postKeyData" style="width: 200px">
        <option>关键帧列表</option>
        <option v-for="item in detectHistoryModel.getBetweenDataList" :value="item">{{item.date}}</option>
      </select>

        <button class="search-btn" @click="postKeyData_" style="margin-left: 15px">查看</button>
        <button class="search-btn" @click="save" style="margin-left: 15px">保存</button>
        <button class="search-btn" @click="clear" style="margin-left: 15px">清空</button>
      </div>
      <div class="img-box" style="margin-left: 4px">
        <img id="key-img"
             :src="img"
             alt="" >
      </div>
    </div>


  </div>
</template>

<style scoped>
.log-container{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 600px;
  width: 60vw;
  padding: 15px;
  .title-txt{
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:flex-start;

  }
  .title{
    display: flex;
    flex-direction: row;
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

  }
  .title-line{
    width:90%;
    height: 2px;
    background-color: #ccc;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.body{

  width: 90%;
  height: 500px;
  display: flex;
  flex-direction: column;
  .select-box{
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
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
.img-box{
  margin-top:10px;
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }


}
</style>