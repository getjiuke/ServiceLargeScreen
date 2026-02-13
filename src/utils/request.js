import axios from 'axios'
import qs from "qs";
import { ElLoading,ElMessage } from 'element-plus'

/** 路由 */
import router from '@/router/index'

// 使用 Vite 的环境变量机制
axios.defaults.baseURL = import.meta.env.VITE_APP_URL  //默认请求接口头部

//post请求头
axios.defaults.headers.post["Content-Type"] = "application/json";

//允许跨域携带cookie信息
axios.defaults.withCredentials = false; 
//设置超时
axios.defaults.timeout = 15000;

//取消所有请求
const CancelToken = axios.CancelToken;
var source = CancelToken.source();

// source.cancel()  取消方法
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
		console.log("请求错误拦截：",error);
		if (error.response) {
			// 401状态码表示Token过期
			if (error.response.status === 401) {
				ElMessage.error('登录已过期，请重新登录');
				sessionStorage.clear();
				router.push('/');
			} else if(error.response.data.Message) {
				ElMessage.error(error.response.data.Message);
			} else {
				ElMessage.error(error.response.data);
			}
		}
		return Promise.reject(error);
    }
);

export default {
    post(url, data) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(0,0,0,0)',
        })

        let Token = JSON.parse(sessionStorage.getItem('Token'));
        if(Token){
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url,
                    data: data,
                    cancelToken: source.token,
                    headers:{
                        Authorization:Token
                    }
                }).then(res => {
                    if(res){
                        loading.close();
                        if(res.data.state == 2){
                            source.cancel();
                            ElMessage.error('身份验证已过期，请重新登录！')
                            router.push('/');
                            source = CancelToken.source();
                        }else{
                            resolve(res.data)
                        }
                    }else{
                        loading.close();
                        // ElMessage.error('访问失败！')
                    }
                }).catch(err => {
                    reject(err)
                    loading.close()
                });
            })
        }else{
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url,
                    data: data,
					redirect: 'follow',
                    cancelToken: source.token
                }).then(res => {
                    if(res){
                        loading.close();
                        resolve(res.data)
                    }else{
                        loading.close();
                        // ElMessage.error('访问失败！')
                    }
                }).catch(err => {
                    reject(err)
                    loading.close()
                });
            })
        }

    },

    get(url, data) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(0,0,0,0)',
        })
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: data,
                cancelToken: source.token
            }).then(res => {
                if(res){
                    loading.close();
                    resolve(res.data)
                }else{
                    loading.close();
                    ElMessage.error('访问失败！')
                }
            }).catch(err => {
                loading.close()
                reject(err)
            });
        })
    }
};