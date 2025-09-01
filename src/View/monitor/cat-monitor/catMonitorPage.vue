<script setup>

</script>

<template>
  <div class="cat-monitor-page-container">
    <div class="cat-monitor-page-show-top">
      <div class="cat-monitor-page-show-img">

      </div>
      <div class="cat-monitor-page-show-do-list">
        <button>停止</button>
        <button>开始</button>
        <button>暂停</button>
      </div>
    </div>
    <div class="cat-monitor-page-show-bottom">

    </div>
  </div>
</template>

<style scoped>
.cat-monitor-page-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 60vh;
  width: 60vw;
}
.cat-monitor-page-show-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.cat-monitor-page-show-img {
  width: 40vw;
  height: 40vh;
  background-color: #f0f0f0;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.cat-monitor-page-show-do-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 2vw;
  width: 18vw;
  height: 40vh;

  border-radius: 10px;
  border: 1px solid #ccc;
}
.cat-monitor-page-show-bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 2vh;
  width: 60vw;
  height: 30vh;
  border-radius: 10px;
  border: 1px solid #ccc;

}
</style>