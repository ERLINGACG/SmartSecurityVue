<script setup>

</script>

<template>
  <div class="log-list-header-container">
    <div class="log-list-header">
        <div class="log-list-header-title">
          <h3>日志列表</h3>
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
          <h4>日志类型</h4>
          <h4>日志内容</h4>
          <h4>更改时间</h4>
        </div>
        <div class="list-item-title-line"></div>
        <div class="list-item">
        </div>
      <div class="body-bottom">
        <button>上一页</button>
        <p>1-10条/共100条</p>
        <button>下一页</button>
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