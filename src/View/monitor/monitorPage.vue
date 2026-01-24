<script setup>





</script>

<template>
  <div class="monitor-container">
     <div class="monitor-page-header">
       <div class="monitor-page-header-title">
         <h3>监控页面</h3>
       </div>
       <div class="monitor-page-header-bar">
         <router-link to="/home/monitorPage/cat-monitorPage" class="bar-item">
           查看监控
         </router-link>
         <router-link to="/home/monitorPage/cat-message" class="bar-item">
           查看实时消息
         </router-link>
         <router-link to="/home/monitorPage/cat-report" class="bar-item">
           生成报告
         </router-link>
         <router-link to="/home/monitorPage/cat-log" class="bar-item">
           查看日志
         </router-link>
         <router-link to="/home/monitorPage/log-list" class="bar-item" >
           关键帧列表
         </router-link>
         <router-link to="/home/monitorPage/set-follows" class="bar-item">
           设置关注列表
         </router-link>
       </div>
       <div class="monitor-page-header-line"></div>
     </div>
     <div class="monitor-page-body">
       <router-view></router-view>
     </div>
  </div>
</template>

<style scoped>
.monitor-container {
  position: relative;
  margin-left: 200px;
  margin-top: 300px;
  display: flex;
  flex-direction: column;
  height: 800px;
  width: 100%;

}
.monitor-page-header {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content:flex-start;


}
.monitor-page-header-title {
  line-height: 60px;
  font-size: 24px;
  font-weight: bold;
}
.monitor-page-header-line {
  height: 2px;
  width: 60vw;
  background-color: #ffffff;
  justify-self: center;
}
.monitor-page-header-bar {
  display: flex;
  justify-content: left;
  height: 30px;
  gap: 10px;
  .bar-item {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 5px;
    &:hover {
      color: #409eff;
    }
    &.router-link-active {
      background: #1890ff;
      color: white;
    }

  }
}
.monitor-page-body {
  display: flex;
  justify-content: flex-start;
  height: auto;
  width: 60vw;
  border-radius: 8px;
  border: 1px solid rgba(204, 204, 204);
}
</style>