<script setup>


import {onMounted, ref} from "vue";
import userService from "@/ViewModel/user/UserService.js";
import userModel from "@/Model/user/UserModel.js";
import memberModel from "@/Model/group/memberModel.js";

const imgUrl = ref('');
const fileInput = ref(null);
// 打开文件选择器
const openFilePicker = () => {
  fileInput.value?.click();
};
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // 检查文件类型
    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      alert('仅支持 JPG/PNG/GIF 格式的图片');
      return;
    }

    // 检查文件大小（限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      imgUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // 这里可以添加实际上传到服务器的代码
    // 例如：await userService.uploadAvatar(file);

    console.log('选择的文件:', file);
    alert('头像选择成功！点击保存按钮上传到服务器');

  } catch (error) {
    console.error('处理文件时出错:', error);
    alert('处理文件时出错，请重试');
  }
};
const saveAvatar = async () => {
  if (!fileInput.value?.files[0]) {
    alert('请先选择头像图片');
    return;
  }

  try {
    // 调用上传服务
    const result = await userService.PutAvatar(userModel.UserInfo.uid, fileInput.value.files[0])
    console.log('上传结果:', result);

    alert('头像上传成功！');
  } catch (error) {
    console.error('上传失败:', error);
    alert('头像上传失败，请重试');
  }
};

onMounted(async () => {
  userModel.UserInfo=await userService.GetUserInfo()
  imgUrl.value = await userService.GetUserAvatar(userModel.UserInfo.uid);
})
</script>

<template>
  <div class="personal-center">
    <div class="personal-center-title">
        <h1>个人中心</h1>
       <div class="line"></div>
    </div>
    <div class="personal-center-content">
      <h2>用户信息</h2>
        <div class="user-info">

          <div class="user-info-item">
            <img
                :src="imgUrl"
                alt="用户头像"
                style="width: 100px; height: 100px; border-radius: 50%;"
            >

          </div>
          <div class="user-info-item">
            <div class="user-name" style="display: flex;flex-direction:row;">
              <p>用户名：</p>
              <input v-model="userModel.UserInfo.nickName" placeholder="请输入昵称">
            </div>
            <div class="line" style="margin-top: 5px;width: 100%;"></div>
            <p>邮箱：{{ userModel.UserInfo.email }}</p>
            <div class="line" style="margin-top: 5px;width: 100%;"></div>
            <p>注册时间：{{ userModel.UserInfo.createdAt }}</p>
            <div class="line" style="margin-top: 5px;width: 100%;"></div>
          </div>
          <div class="line" style="width:1px;height: 100%"></div>
          <div class="user-info-btn">
            <button style="margin-right: 20px;" @click="saveAvatar">上传头像</button>
            <button style="margin-right: 20px;">修改昵称</button>
            <button style="margin-right: 20px;" @click="openFilePicker">更改头像</button>
            <button>更新头像</button>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;">
          </div>
        </div>

      <div class="user-for" >
         <h3>前往群组管理</h3>
      </div>
      <div class="user-for">
         <h3>前往设备管理</h3>
      </div>
      <div class="user-for">
         <h3>前往监控管理</h3>
      </div>
    </div>

  </div>
</template>

<style scoped>

.user-for{
  margin-top: 20px;
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #2c3e50;
  }
}
.user-for h3{
  font-size: 18px;
  font-weight: bold;
}

.personal-center {
  margin-top: 50px;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.personal-center-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 20px;

}
.line {
  width: 800px;
  height: 1px;
  background-color: #ccc;
  margin-top: 10px;
}
.personal-center-content {
  width: 800px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;

  .user-info {
    padding: 30px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    border: 1px solid #ccc;
    width: 100%;
    border-radius: 5px;
    .user-info-item {
       margin-right: 30px;
       display: flex;
       flex-direction: column;
       align-items: flex-start;
       justify-content: center;
    }
  }
}
.user-info-btn{
  margin-left: 30px;
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
}
input {
  height: 30px;
  padding: 8px 12px;
  border: 1px solid #304156;
  border-radius: 4px;
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
</style>