import axios from "@/utils/request";
let { get, post } = axios;
import request from 'axios'

// 导入Mock API
import {
    GetSourceRatio as MockGetSourceRatio,
    GetCaseCountByArea as MockGetCaseCountByArea,
    GetCaseStatsWithFullDateRange as MockGetCaseStatsWithFullDateRange
} from '@/mock/api.js'

// 是否使用Mock数据
const USE_MOCK = true;

// 右上方数据内容
const GetSourceRatio = (url, data) => {
    if (USE_MOCK) {
        return MockGetSourceRatio(url, data);
    }
    return post(url, data);
}

//右中数据内容
const GetCaseCountByArea = (url, data) => {
    if (USE_MOCK) {
        return MockGetCaseCountByArea(url, data);
    }
    return post(url, data);
}

//右下数据内容
const GetCaseStatsWithFullDateRange = (url, data) => {
    if (USE_MOCK) {
        return MockGetCaseStatsWithFullDateRange(url, data);
    }
    return post(url, data);
}

export {
    GetSourceRatio,
    GetCaseCountByArea,
    GetCaseStatsWithFullDateRange
}