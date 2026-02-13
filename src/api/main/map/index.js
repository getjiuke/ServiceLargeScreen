import axios from "@/utils/request";
let { get, post } = axios;
import request from 'axios'

// 导入Mock API
import {
    GetMapData as MockGetMapData
} from '@/mock/api.js'

// 是否使用Mock数据
const USE_MOCK = true;

/** 获取底图聚合点 */
const GetMapData = (url, data) => {
    if (USE_MOCK) {
        return MockGetMapData(url, data);
    }
    return post(url, data);
}

export {
    GetMapData
}