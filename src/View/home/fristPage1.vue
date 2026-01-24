<script setup>
import { ref, onMounted } from 'vue';
import UserService from "@/ViewModel/user/UserService.js";
import fristPageViewModel from "@/ViewModel/firstPage/FristPageViewModel.js";
import request from "@/ViewModel/utils/httpUtils.js";

const usualPageViewModel = ref([]);
const devicModel = ref([])
// const nowUser = ref('');
const UserDetails = ref({
  nickName: '',
  uid: '',
  createdAt: ''
});
const imgUrl = ref('');

const deviceOnlineCode = ref(0);

const selectedDevice = ref(localStorage.getItem('First_Select_device') || '');
const  UpdateLocalDevice=()=>{
     console.log(selectedDevice.value);
     localStorage.setItem('First_Select_device',selectedDevice.value);
}
const getDeviceStatus = async () => {
  const deviceStatus = await request.get("http://localhost:8080/device/info/status",{
    params:{
      email: localStorage.getItem('nowUser') || ''
    }

  })
  deviceOnlineCode.value = deviceStatus.data.data;
  console.log(deviceStatus.data);

}
onMounted(  async () => {
  try {
    UserDetails.value =  await UserService.GetUserInfo();
    imgUrl.value =  await UserService.GetUserAvatar(UserDetails.value.uid);
    usualPageViewModel.value = fristPageViewModel.getUsuallyResList();

    await getDeviceStatus();



    await fristPageViewModel.getResList(selectedDevice.value,"item-chart");
    devicModel.value = await fristPageViewModel.getDeviceList();
    console.log(devicModel.value);

  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 添加错误处理逻辑
  }
})
</script>

<template>
  <div class="first-page-1-container">
    <div class="first-page-1-title">
      <h3>系统总览</h3>
    </div>
    <div class="line"/>
    <div class="first-page-1-body">
       <div class="body-row">
           <div class="body-col">
             <h3>
               设备总览
             </h3>
             <div class="device-status-card">
               <div class="device-item online-item">
                 <p>在线设备数</p>
                 <span>{{deviceOnlineCode}}</span>
               </div>
               <!-- 右侧：总设备数量 -->
               <div class="device-item total-item">
                 <p>总设备数量</p>
                 <span>{{devicModel.length}}</span>
               </div>
             </div>
           </div>
           <div class="body-col">
             <div class="body-col-user">
                <div class="header-user-img">
                  <img
                      :src="imgUrl"
                      alt="用户头像"
                      v-if="UserDetails.uid"
                      >
                </div>
               <div class="body-col-user-info">
                 <h4>
                   {{UserDetails.nickName}}
                 </h4>
                 <p>
                   uid:{{UserDetails.uid}}
                 </p>
                 <p>
                   注册时间:{{UserDetails.createdAt}}
                 </p>
                 <p>
                   绑定邮箱:{{UserDetails.email}}
                 </p>

               </div>
             </div>
           </div>
       </div>

      <div class="body-row">
        <div class="body-col ">
          <div class ="select-box">
            <select @change="UpdateLocalDevice" v-model="selectedDevice">
              <option v-for="topic in devicModel" :value="topic.deviceTopic">{{topic.deviceTopic}}</option>
            </select>

          </div>


          <div id="item-chart" style="height: 150px;width: 100%;"></div>
        </div>
        <div class="body-col">
            <h4>
              最近访问
            </h4>
            <div class="body-col-usual">
              <div v-for="(item,index) in usualPageViewModel" :key="index" class="usual-card">
<!--                <router-link :to="{path:item.path}">{{item.path}}</router-link>-->
                <button>{{item.path}}</button>
              </div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.line{
  margin-top: 10px;
  height: 1px;
  background-color: rgba(204, 204, 204);
  width: 100%;
}
.first-page-1-container{
  position: relative;
  margin-top: 20px;
  margin-left: -100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 70vw;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(204, 204, 204);
}
.first-page-1-body{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  .body-row{
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    .body-col{
      margin-right: 20px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
      padding: 10px;
      width: 30vw;
      height: 200px;
      border:  1px solid rgba(204, 204, 204);
      border-radius: 8px;
    }
    .select-box{
      width: 100%;
      select {

        margin-left: 5px;
        padding: 8px 12px;
        border: 1px solid #304156;
        border-radius: 4px;
        background: #2d3a4b url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2390a3bf'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center;
        color: #fff;
        appearance: none;
        transition: all 0.3s;
        width: 150px;
        margin-bottom: 5px;
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
      button{
        padding: 10px 32px;
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        margin-left: 20px;
        align-items: end;
        height: 30px;
        &:hover {
          background: #40a9ff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
        }
      }
    }

  }

}
.header-user-img{
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f5f5f5;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
  }
}
.body-col-user-info{
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  h4{
    margin-top: 10px;
    margin-bottom: 5px;
  }
  p{
    margin-bottom: 10px;
  }
}
.body-col-user{

  display: flex;
  flex-direction: row;
  justify-content: flex-start;

}
.body-col-usual{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  .usual-card{
    margin-top: 10px;
    text-align: left;
    button{
      width: 100px;
      height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background: #1890ff;
      color: white;
      border: none;
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

.device-status-card{
  display: flex; /* 改为flex横向布局 */
  justify-content: space-between; /* 左右元素分散对齐 */
  align-items: center; /* 垂直居中 */
  padding: 20px 16px;

  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #334155;
  width: 100%;
  box-sizing: border-box;
  /* 设备统计项通用样式 */
  .device-item {
    text-align: center; /* 文字居中 */
    flex: 1; /* 两个盒子等分宽度 */
  }

  /* 在线设备数样式 */
  .online-item p {
    color: #94a3b8;
    font-size: 14px;
    margin: 0 0 4px 0;
  }
  .online-item span {
    color: #22c55e; /* 在线数用绿色突出 */
    font-size: 20px;
    font-weight: 600;
  }

  /* 总设备数样式 */
  .total-item p {
    color: #94a3b8;
    font-size: 14px;
    margin: 0 0 4px 0;
  }
  .total-item span {
    color: #e2e8f0;
    font-size: 20px;
    font-weight: 600;
  }
}

</style>