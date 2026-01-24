import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/Router.js";

window.global = window;
const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.errorHandler = (err, vm, info) => {

    // if (err.message?.includes('401')) {
    //     // 处理 401 未授权错误
    //     alert('登录已过期，请重新登录');
    //     router.push('/user/login').then(r => {
    //         console.log(r);
    //     })
    //
    // }
    // if (err.message?.includes('500')) {
    //     // 处理 500 服务器错误
    //     alert(err.response.data.message);
    //
    // }
    // if (err.message?.includes('400')) {
    //     // 处理 500 服务器错误
    //     alert(err.response.data.message);
    //     console.log(err.response.data);
    // }

}