import axios from "@/utils/request";
let { get, post } = axios;
import request from 'axios'

// 导入Mock API
import {
    GetBaseStatistics as MockGetBaseStatistics,
    GetAllBigType as MockGetAllBigType,
    GetAllSmallType as MockGetAllSmallType,
    GetCaseInfoForHotline as MockGetCaseInfoForHotline
} from '@/mock/api.js'

// 是否使用Mock数据
const USE_MOCK = true;

// 左上方数据内容
const GetBaseStatistics = (url, data) => {
    if (USE_MOCK) {
        return MockGetBaseStatistics(url, data);
    }
    return post(url, data);
}

//左中数据内容
const GetAllBigType = (url, data) => {
    if (USE_MOCK) {
        return MockGetAllBigType(url, data);
    }
    return post(url, data);
}

//左中数据一级展开内容
const GetAllSmallType = (url, data) => {
    if (USE_MOCK) {
        return MockGetAllSmallType(url, data);
    }
    return post(url, data);
}

//左下数据内容
const GetCaseInfoForHotline = (url, data) => {
    if (USE_MOCK) {
        return MockGetCaseInfoForHotline(url, data);
    }
    return post(url, data);
}

export {
    GetBaseStatistics,
    GetAllBigType,
    GetAllSmallType,
    GetCaseInfoForHotline
}