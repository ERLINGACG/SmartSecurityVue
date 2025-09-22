<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import detectHistoryService from "@/ViewModel/detectHistory/detectHistroyService.js";
import DetectHistoryModel from "@/Model/detectHistory/detectHistoryModel.js";
// const data=reactive({})

const totalPages = computed(() => {
  return Math.ceil(DetectHistoryModel.getALLDataList.value.length / pageSize.value)
})

const currentPage = ref(1); // 当前页
const pageSize = ref(5);  // 每页显示的条数

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return DetectHistoryModel.getALLDataList.value.slice(start, start + pageSize.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


onMounted(async () => {
  DetectHistoryModel.getALLDataList.value = await detectHistoryService.getHistory("/topic/image2")
})
</script>

<template>
  <div class="log-list-header-container">
    <div class="log-list-header">
        <div class="log-list-header-title">
          <h3>关键帧列表</h3>
        </div>
        <div class="log-list-header-search">
          <input type="text" placeholder="搜索">
          <button class="search-btn">搜索</button>
          <select>
            <option value="1">按日期筛选</option>

          </select>
        </div>

    </div>
    <div class="log-list-header-line"></div>
    <div class="log-list-body">
        <div class="list-item-title">
          <h4>日志id</h4>
          <h4>绑定主题</h4>
          <h4 style="margin-left: 80px">图片路径</h4>
          <h4 style="margin-left: 80px">更改时间</h4>
        </div>
        <div class="list-item-title-line"></div>
        <div class="list-item">
          <div v-for="item in paginatedData" :key="item.id">
            <div class="item-box">
              <h4>{{item.id}}</h4>
              <h4>{{item.topic}}</h4>
              <h4>{{item.path}}</h4>
              <h4 style="margin-left: -40px">{{item.date}}</h4>
            </div>
            <div class="item-line"></div>

          </div>
        </div>
      <div class="body-bottom">
        <button @click="prevPage">上一页</button>
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
        <button @click="nextPage">下一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-list-header-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  padding: 10px;
}
.log-list-header {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
}
.log-list-header-search {
  display: flex;
  flex-direction: row;

  input {
    padding: 8px 12px;
    margin-right: 6px;
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
}
.log-list-header-line {
  width:90%;
  height: 2px;
  background-color: #ccc;
  margin-top: 10px;
}
.list-item{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  .item-box{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 8px 0;
    h4{
      margin-right: 90px;

      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .item-line {
    width: 90%;
    height: 2px;
    background-color: #ccc;
    margin-top: 10px;
  }
}
.log-list-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  .list-item-title{
    width: 100%;
    height: 25px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    h4 {
      margin-right: 10%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .list-item-title-line {
    width:  90%;
    height: 2px;
    background-color: #ccc;
    margin-top: 10px;
  }
  .body-bottom {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items:flex-start;
    p{
      margin-left: 10px;
      margin-right: 5px;
    }
    button{
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
  }
}
</style>