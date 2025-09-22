<script setup>
import { ref, onMounted } from 'vue';
import UserService from "@/ViewModel/user/UserService.js";



// const nowUser = ref('');
const UserDetails = ref({
  nickName: '',
  uid: '',
  createdAt: ''
});
const imgUrl = ref('');
// onMounted(() => {
//   nowUser.value = localStorage.getItem('nowUser') || '';
// });
onMounted(  async () => {
  try {
    UserDetails.value =  await UserService.GetUserInfo();
    imgUrl.value =  await UserService.GetUserAvatar(UserDetails.value.uid);
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
             <h4>
               在线设备数
             </h4>
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
        <div class="body-col">

        </div>
        <div class="body-col">

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
      height: 150px;
      border:  1px solid rgba(204, 204, 204);
      border-radius: 8px;
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
</style>