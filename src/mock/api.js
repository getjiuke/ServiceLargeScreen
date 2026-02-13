/**
 * Mock API接口文件
 * 模拟后端接口，返回本地数据
 */

import {
    mockCaptcha,
    validCredentials,
    mockToken,
    mockBaseStatistics,
    mockAllBigType,
    mockAllSmallType,
    mockCaseInfoForHotline,
    mockSourceRatio,
    mockCaseCountByArea,
    mockCaseStatsWithFullDateRange,
    generateMockCaseStatsWithFullDateRange,
    mockMapData,
    mockRefreshToken
} from './data.js';

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== 登录相关接口 ====================

/**
 * 获取验证码
 */
export const GetCapTCHAPicture = async (url, data) => {
    await delay(200);
    return { ...mockCaptcha };
};

/**
 * 登录验证
 */
export const GoLogin = async (url, data) => {
    await delay(500);
    try {
        const loginData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // 验证账号和验证码
        if (loginData.Username === validCredentials.username && 
            loginData.VerificationCode === '1234') {
            // 对于演示目的，我们只验证账号和验证码
            // 在实际系统中还会验证加密后的密码
            return { ...mockToken };
        } else {
            // 返回登录失败
            return { Token: null, Message: "账号或密码错误" };
        }
    } catch (error) {
        console.error("登录验证错误:", error);
        return { Token: null, Message: "登录失败" };
    }
};

/**
 * 验证JWT
 */
export const VerifyJWT = async (url, data) => {
    await delay(200);
    return { state: 1, valid: true };
};

/**
 * 刷新Token
 */
export const RefreshToken = async () => {
    await delay(300);
    return { ...mockRefreshToken };
};

// ==================== 左侧数据接口 ====================

/**
 * 获取基础统计数据（左上方）
 */
export const GetBaseStatistics = async (url, data) => {
    await delay(400);
    return { ...mockBaseStatistics };
};

/**
 * 获取大类数据（左中）
 */
export const GetAllBigType = async (url, data) => {
    await delay(400);
    return { ...mockAllBigType };
};

/**
 * 获取小类数据（左中展开）
 */
export const GetAllSmallType = async (url, data) => {
    await delay(300);
    try {
        const requestData = typeof data === 'string' ? JSON.parse(data) : data;
        const classBigId = requestData.ClassBigID;
        
        // 根据大类ID返回对应的小类数据
        const smallTypeData = mockAllSmallType[classBigId];
        if (smallTypeData) {
            return { ...smallTypeData };
        } else {
            return { smallCounts: [] };
        }
    } catch (error) {
        console.error("获取小类数据错误:", error);
        return { smallCounts: [] };
    }
};

/**
 * 获取12345热线案件数据（左下）
 */
export const GetCaseInfoForHotline = async (url, data) => {
    await delay(500);
    return { ...mockCaseInfoForHotline };
};

// ==================== 右侧数据接口 ====================

/**
 * 获取来源占比数据（右上）
 */
export const GetSourceRatio = async (url, data) => {
    await delay(400);
    return { ...mockSourceRatio };
};

/**
 * 获取各区结案数量数据（右中）
 */
export const GetCaseCountByArea = async (url, data) => {
    await delay(400);
    return { ...mockCaseCountByArea };
};

/**
 * 获取结案趋势数据（右下）
 */
export const GetCaseStatsWithFullDateRange = async (url, data) => {
    await delay(500);
    try {
        const requestData = typeof data === 'string' ? JSON.parse(data) : data;
        const queryDays = requestData.QueryDays || 31;
        
        // 根据请求的天数生成相应数据
        const mockData = generateMockCaseStatsWithFullDateRange(queryDays);
        return { ...mockData };
    } catch (error) {
        console.error("获取结案趋势数据错误:", error);
        return { ...mockCaseStatsWithFullDateRange };
    }
};

// ==================== 地图数据接口 ====================

/**
 * 获取地图点位数据
 */
export const GetMapData = async (url, data) => {
    await delay(600);
    return { ...mockMapData };
};
