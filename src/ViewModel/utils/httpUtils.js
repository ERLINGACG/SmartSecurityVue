// utils/request.js

// 创建 axios 实例
import axios from 'axios';
import router from "@/router/Router.js";

// 1. 创建 Axios 实例（可配置基础路径、超时时间等）
const request = axios.create({
    timeout: 5000, // 超时时间（毫秒）
});

request.interceptors.request.use(
    (config) => {
        // 从 localStorage 中获取 token
        const token = localStorage.getItem('jwt_token');

        // 如果 token 存在，添加到请求头的 Authorization 字段
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 返回处理后的配置（必须返回，否则请求会被阻塞）
        return config;
    },
    (error) => {
        // 处理请求拦截器的错误（例如：配置错误）
        // 可以添加日志记录或其他处理
        alert(error.response.data.message);
        console.error('Request error:', error.response.data);
        return Promise.reject(error);
    }
);
request.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
        if (error.response.status === 401) {
            alert('登录已过期，请重新登录');
            router.push('/user/login').then(r => {
                console.log(r);
            })
            return Promise.reject(error);
        }else{
            alert(error.response.data.message);
            console.error('Response error:', error.response.data);
            return Promise.reject(error);
        }


    }
)
export default request;
