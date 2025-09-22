import axios from "axios";

axios.defaults.withCredentials = true
class UserService {
   UrlList={
         GetUserInfo:'http://localhost:8080/user/api/getUserDetail',
     }
   static async Login(userModel) {



       console.log(userModel)
       try{
           const res = await axios.post('http://api.smartsecurity.local/api/user/api/login', {
               email:userModel.UserLogin.email,
               passwordHash:userModel.UserLogin.passwordHash
           })
           console.log(res)
           alert(res.data.message)

           return res.data.code
       }catch(error){
            console.log(error)
            return error.response.data.code
       }
    }
    static async Register(userModel,code) {

        console.log("Email: ", userModel.UserRegister.email)
        console.log("Password: ", userModel.UserRegister.passwordHash)
        try{
            const res = await axios.post(`http://localhost:8080/user/api/register?code=${code}`, {
                email:userModel.UserRegister.email,
                passwordHash:userModel.UserRegister.passwordHash,
            })
            alert(res.data.message)
            return res.data
        }catch(error){
            console.log(error)
            return error.response.data.code
        }

    }
   static async GetUserInfo() {
           try{
               const res = await axios.get("http://localhost:8080/user/api/getUserDetail/"+
                   localStorage.getItem('nowUser'))
               console.log(res)
               return res.data.data
           }catch(error){
               console.log(error)
               return error.response.data.data
           }
   }
   static async GetUserAvatar(uid) {
       try{
           const res = await axios.get(
               `http://localhost:8080/user/api/getAvatar/${uid}`,
               { responseType: 'blob' } // 指定响应类型为二进制数据
           );
           console.log(res)
           // 将Blob转换为本地URL
           return URL.createObjectURL(res.data);
       }catch(error){
           console.log(error)
           return error.response.data.data
       }
   }

}
export default UserService;