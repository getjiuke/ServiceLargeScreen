import axios from "@/utils/request";
let { get, post } = axios;
import request from 'axios'

// 导入Mock API
import {
    GetCapTCHAPicture as MockGetCapTCHAPicture,
    GoLogin as MockGoLogin,
    VerifyJWT as MockVerifyJWT,
    RefreshToken as MockRefreshToken
} from '@/mock/api.js'

// 是否使用Mock数据
const USE_MOCK = true;

/** 获取验证码图片 */
const GetCapTCHAPicture = (url, data) => {
    if (USE_MOCK) {
        return MockGetCapTCHAPicture(url, data);
    }
    return get(url, data);
}

/** 登录 */
const GoLogin=(url, data)=>{
    if (USE_MOCK) {
        return MockGoLogin(url, data);
    }
    return post(url, data);
}

/** 点单登录验证jwt */
const VerifyJWT = (url, data)=>{
    if (USE_MOCK) {
        return MockVerifyJWT(url, data);
    }
    return post(url, data);
}

/** 刷新Token */
const RefreshToken = () => {
    if (USE_MOCK) {
        return MockRefreshToken();
    }
    // 从sessionStorage获取当前Token
    const currentToken = JSON.parse(sessionStorage.getItem('Token'));
    // 确保请求头携带Authorization
    return post('/api/SSOUser/RefreshToken', '', {
        headers: {
            Authorization: currentToken
        }
    });
}

export {
    GetCapTCHAPicture,
    GoLogin,
    VerifyJWT,
    RefreshToken
}