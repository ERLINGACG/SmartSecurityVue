<script setup>

import request from "@/ViewModel/utils/httpUtils.js";
import {onMounted, ref} from "vue";
import deviceService from "@/ViewModel/device/deviceService.js";
import UpdateDevice from "@/View/device/update/updateDevice.vue";

const get_url='http://localhost:8080/follow/get'
const set_url='http://localhost:8080/follow'
const getFollowList= async ()=>{
  const response=await request.get(get_url,{
    params:{
      topic:localStorage.getItem('cat-selectedDevice') || ''
    }
  })
  console.log(response)
  return response.data;
}

const followlist =ref('')
const deviceModel = ref([]);
const selectedDevice = ref('');

const changeDevice = (e)=>{
  console.log(e.target.value)
  localStorage.setItem('cat-selectedDevice', e.target.value);
}

const postFollow = async () => {
  const res = await request.get(set_url, {
    params: {
      topic: localStorage.getItem('cat-selectedDevice') || '',
      follows: followlist.value
    }
  })
  console.log(res)
  alert(res.data.message)
}

onMounted(async () => {
    deviceModel.value = await deviceService.GetDeviceList(localStorage.getItem("nowUser"))
    const data = await getFollowList()
    followlist.value = data.data
    console.log("fl",data)
})
</script>

<template>
<div class="follows-container">
  <select @change="changeDevice" v-model="selectedDevice">
    <option v-for="topic in deviceModel" :value="topic.deviceTopic">{{topic.deviceTopic}}</option>
  </select>
  <textarea placeholder="" v-model="followlist"></textarea>
  <button @click="postFollow">提交</button>
</div>
</template>

<style scoped>
.follows-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px;

}
textarea {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 12px;
  height: 110px;
  width: 300px;
  border: 1px solid #304156;
  border-radius: 4px;
  background: #2d3a4b;
  color: #fff;
  resize: vertical;
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
  padding: 8px 12px;
  border: 1px solid #304156;
  border-radius: 4px;
  background: #2d3a4b url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2390a3bf'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
  color: #fff;
  appearance: none;
  transition: all 0.3s;
  width: 150px;
  height: 30px;
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
button {
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