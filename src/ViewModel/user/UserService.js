import axios from "axios";
import request from "@/ViewModel/utils/httpUtils.js";

axios.defaults.withCredentials = true
class UserService {
   UrlList={
         GetUserInfo:'http://localhost:8080/user/api/getUserDetail',
     }
   static async Login(userModel) {

       console.log(userModel)
           const res = await request.post('http://localhost:8080/user/api/login', {
               email:userModel.UserLogin.email,
               passwordHash:userModel.UserLogin.passwordHash
           })
           console.log(res.data.data)
           alert(res.data.message)
           localStorage.setItem('jwt_token',res.data.data)
           return res.data.code

    }
    static async Register(userModel,code) {
            const res = await request.post(`http://localhost:8080/user/api/register?code=${code}`, {
                email:userModel.UserRegister.email,
                passwordHash:userModel.UserRegister.passwordHash,
            })
            alert(res.data.message)
            return res.data

    }

    static async PutAvatar(id,file) {
        try{
            const formData = new FormData();
            formData.append('file', file);
            const res = await request.put(`http://localhost:8080/user/api/updateAvatar/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res)
            return res.data
        }catch(error){
            console.log(error)
            return error.response.data.code
        }
    }
   static async GetUserInfo() {

       const token = localStorage.getItem('jwt_token');
           try{
               const res = await axios.get("http://localhost:8080/user/api/getUserDetail/"+
                   localStorage.getItem('nowUser'),
                   {headers: {Authorization: `Bearer ${token}`}}

               )
               console.log(res)
               return res.data.data
           }catch(error){
               console.log(error)
               return error.response.data.data
           }
   }
   static async GetUserAvatar(uid) {
       const res = await request.get(
               `http://localhost:8080/user/api/getAvatar/${uid}`,
               {  responseType: 'blob' } // 指定响应类型为二进制数据
       );
       console.log(res)
           // 将Blob转换为本地URL
       return URL.createObjectURL(res.data);
   }

}
export default UserService;