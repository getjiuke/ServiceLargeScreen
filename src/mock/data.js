/**
 * 本地Mock数据文件
 * 包含所有API接口的模拟数据
 */

// ==================== 登录相关 ====================

// 验证码数据 - 使用一个简单的base64图片（1x1像素的透明png）
export const mockCaptcha = {
    Key: "captcha_key_123456",
    Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
};

// 登录验证 - 允许的账号
export const validCredentials = {
    username: "dqc_user",
    password: "dqc_user"
};

// 登录成功返回的Token
export const mockToken = {
    Token: "mock_jwt_token_1234567890abcdefghijklmnopqrstuvwxyz"
};

// ==================== 左上方 - 基础统计数据 ====================
export const mockBaseStatistics = {
    AreaSize: 125.856,
    GridCount: 368,
    CaseCount: 12580,
    InspectorCount: 156
};

// ==================== 左中 - 大类数据 ====================
export const mockAllBigType = {
    areaCounts: [
        { ClassBigID: 1, Name: "市容环境", Description: 3256, Proportion: "25.9" },
        { ClassBigID: 2, Name: "宣传广告", Description: 2845, Proportion: "22.6" },
        { ClassBigID: 3, Name: "施工管理", Description: 2156, Proportion: "17.1" },
        { ClassBigID: 4, Name: "突发事件", Description: 1875, Proportion: "14.9" },
        { ClassBigID: 5, Name: "街面秩序", Description: 1458, Proportion: "11.6" },
        { ClassBigID: 6, Name: "市政公用设施", Description: 628, Proportion: "5.0" },
        { ClassBigID: 7, Name: "园林绿化", Description: 312, Proportion: "2.5" },
        { ClassBigID: 8, Name: "房屋土地", Description: 50, Proportion: "0.4" }
    ]
};

// ==================== 左中 - 小类数据（根据大类ID） ====================
export const mockAllSmallType = {
    // 市容环境 - ClassBigID: 1
    1: {
        smallCounts: [
            { Name: "乱堆物堆料", Description: 856, Proportion: "26.3" },
            { Name: "暴露垃圾", Description: 745, Proportion: "22.9" },
            { Name: "积存垃圾渣土", Description: 523, Proportion: "16.1" },
            { Name: "道路破损", Description: 412, Proportion: "12.7" },
            { Name: "道路不洁", Description: 356, Proportion: "10.9" },
            { Name: "绿地脏乱", Description: 234, Proportion: "7.2" },
            { Name: "废弃车辆", Description: 89, Proportion: "2.7" },
            { Name: "乱设灯杆", Description: 41, Proportion: "1.3" }
        ]
    },
    // 宣传广告 - ClassBigID: 2
    2: {
        smallCounts: [
            { Name: "非法小广告", Description: 1256, Proportion: "44.1" },
            { Name: "街头散发广告", Description: 678, Proportion: "23.8" },
            { Name: "违规户外广告", Description: 456, Proportion: "16.0" },
            { Name: "广告语言文字不规范", Description: 234, Proportion: "8.2" },
            { Name: "违规牌匾标识", Description: 156, Proportion: "5.5" },
            { Name: "户外广告设置位置不合理", Description: 65, Proportion: "2.3" }
        ]
    },
    // 施工管理 - ClassBigID: 3
    3: {
        smallCounts: [
            { Name: "施工占道", Description: 856, Proportion: "39.7" },
            { Name: "工地扬尘", Description: 623, Proportion: "28.9" },
            { Name: "施工扰民", Description: 345, Proportion: "16.0" },
            { Name: "施工围挡不规范", Description: 234, Proportion: "10.9" },
            { Name: "工地物料乱堆放", Description: 98, Proportion: "4.5" }
        ]
    },
    // 突发事件 - ClassBigID: 4
    4: {
        smallCounts: [
            { Name: "路面塌陷", Description: 523, Proportion: "27.9" },
            { Name: "自来水管破裂", Description: 456, Proportion: "24.3" },
            { Name: "燃气管道泄漏", Description: 345, Proportion: "18.4" },
            { Name: "排水管道堵塞", Description: 267, Proportion: "14.2" },
            { Name: "热力管道破裂", Description: 156, Proportion: "8.3" },
            { Name: "电力设施故障", Description: 89, Proportion: "4.7" },
            { Name: "通信设施故障", Description: 39, Proportion: "2.1" }
        ]
    },
    // 街面秩序 - ClassBigID: 5
    5: {
        smallCounts: [
            { Name: "店外经营", Description: 567, Proportion: "38.9" },
            { Name: "占道经营", Description: 456, Proportion: "31.3" },
            { Name: "无证经营游商", Description: 234, Proportion: "16.1" },
            { Name: "乱搭乱建", Description: 123, Proportion: "8.4" },
            { Name: "非机动车乱停放", Description: 56, Proportion: "3.8" },
            { Name: "机动车乱停放", Description: 22, Proportion: "1.5" }
        ]
    },
    // 市政公用设施 - ClassBigID: 6
    6: {
        smallCounts: [
            { Name: "路灯故障", Description: 234, Proportion: "37.3" },
            { Name: "交通信号灯故障", Description: 156, Proportion: "24.8" },
            { Name: "公交站台破损", Description: 89, Proportion: "14.2" },
            { Name: "交通标志破损", Description: 67, Proportion: "10.7" },
            { Name: "交通护栏破损", Description: 45, Proportion: "7.2" },
            { Name: "路名牌破损", Description: 23, Proportion: "3.7" },
            { Name: "消防栓损坏", Description: 14, Proportion: "2.2" }
        ]
    },
    // 园林绿化 - ClassBigID: 7
    7: {
        smallCounts: [
            { Name: "行道树", Description: 123, Proportion: "39.4" },
            { Name: "绿地", Description: 89, Proportion: "28.5" },
            { Name: "绿化护栏", Description: 45, Proportion: "14.4" },
            { Name: "雕塑", Description: 34, Proportion: "10.9" },
            { Name: "街头座椅", Description: 21, Proportion: "6.7" }
        ]
    },
    // 房屋土地 - ClassBigID: 8
    8: {
        smallCounts: [
            { Name: "违法建设", Description: 23, Proportion: "46.0" },
            { Name: "危险房屋", Description: 15, Proportion: "30.0" },
            { Name: "房屋外立面破损", Description: 8, Proportion: "16.0" },
            { Name: "土地闲置", Description: 4, Proportion: "8.0" }
        ]
    }
};

// ==================== 左下 - 12345热线案件数据 ====================
export const mockCaseInfoForHotline = {
    caseInfos: [
        {
            CaseMainID: 10001,
            CASE_TITLE: "小区垃圾堆积严重，影响居民生活",
            CASE_SERIAL: "RX202502070001",
            CASE_CONTENT: "和平区某小区垃圾已经堆积一周未清理，气味难闻，严重影响居民正常生活，请尽快处理。",
            OpTime: "2025-02-07T09:30:00"
        },
        {
            CaseMainID: 10002,
            CASE_TITLE: "道路坑洼导致车辆受损",
            CASE_SERIAL: "RX202502070002",
            CASE_CONTENT: "河西区某路段路面出现多处坑洼，多辆汽车经过时轮胎被扎破，存在严重安全隐患。",
            OpTime: "2025-02-07T10:15:00"
        },
        {
            CaseMainID: 10003,
            CASE_TITLE: "施工噪音扰民",
            CASE_SERIAL: "RX202502070003",
            CASE_CONTENT: "南开区某工地夜间施工至凌晨，噪音极大，严重影响周边居民休息，请协调处理。",
            OpTime: "2025-02-07T11:20:00"
        },
        {
            CaseMainID: 10004,
            CASE_TITLE: "非法小广告泛滥",
            CASE_SERIAL: "RX202502070004",
            CASE_CONTENT: "河北区某街道电线杆和墙壁上贴满了非法小广告，严重影响市容市貌，希望清理整治。",
            OpTime: "2025-02-07T13:45:00"
        },
        {
            CaseMainID: 10005,
            CASE_TITLE: "路灯不亮影响出行",
            CASE_SERIAL: "RX202502070005",
            CASE_CONTENT: "河东区某路段路灯连续多日不亮，晚上出行非常不便且不安全，请尽快维修。",
            OpTime: "2025-02-07T14:30:00"
        },
        {
            CaseMainID: 10006,
            CASE_TITLE: "占道经营影响交通",
            CASE_SERIAL: "RX202502070006",
            CASE_CONTENT: "红桥区某路段商贩占道经营严重，导致交通拥堵，行人通行困难，希望加强管理。",
            OpTime: "2025-02-07T15:10:00"
        },
        {
            CaseMainID: 10007,
            CASE_TITLE: "下水道堵塞污水外溢",
            CASE_SERIAL: "RX202502070007",
            CASE_CONTENT: "东丽区某街道下水道堵塞，污水外溢到路面，气味难闻，影响环境卫生。",
            OpTime: "2025-02-07T16:25:00"
        },
        {
            CaseMainID: 10008,
            CASE_TITLE: "绿化带被破坏",
            CASE_SERIAL: "RX202502070008",
            CASE_CONTENT: "西青区某路段绿化带被人为破坏，植被死亡，希望尽快修复并加强管理。",
            OpTime: "2025-02-07T17:00:00"
        },
        {
            CaseMainID: 10009,
            CASE_TITLE: "违规搭建棚亭",
            CASE_SERIAL: "RX202502060009",
            CASE_CONTENT: "津南区某小区有人违规搭建棚亭，占用公共空间，请相关部门核查处理。",
            OpTime: "2025-02-06T09:15:00"
        },
        {
            CaseMainID: 10010,
            CASE_TITLE: "消防通道被占用",
            CASE_SERIAL: "RX202502060010",
            CASE_CONTENT: "北辰区某小区消防通道长期被私家车占用，存在严重消防安全隐患。",
            OpTime: "2025-02-06T10:30:00"
        },
        {
            CaseMainID: 10011,
            CASE_TITLE: "公交站台设施损坏",
            CASE_SERIAL: "RX202502060011",
            CASE_CONTENT: "武清区某公交站台座椅和遮雨棚损坏，给候车乘客带来不便，请维修。",
            OpTime: "2025-02-06T14:20:00"
        },
        {
            CaseMainID: 10012,
            CASE_TITLE: "路面塌陷危险",
            CASE_SERIAL: "RX202502060012",
            CASE_CONTENT: "宝坻区某路段出现路面塌陷，深度约30厘米，存在严重安全隐患，请紧急处理。",
            OpTime: "2025-02-06T15:45:00"
        }
    ]
};

// ==================== 右上 - 来源占比数据 ====================
export const mockSourceRatio = {
    sourceRatio: [
        { Name: "市容委平台转", Count: 4256 },
        { Name: "便民服务热线", Count: 3845 },
        { Name: "巡查员发现", Count: 2156 },
        { Name: "区采集员上报", Count: 1258 },
        { Name: "市巡查员上报", Count: 678 },
        { Name: "微信举报", Count: 387 }
    ]
};

// ==================== 右中 - 各区结案数量数据 ====================
export const mockCaseCountByArea = {
    areaCounts: [
        { Name: "和平区", Count: 2156, Percentage: 17.14 },
        { Name: "河西区", Count: 1987, Percentage: 15.80 },
        { Name: "南开区", Count: 1856, Percentage: 14.76 },
        { Name: "河东区", Count: 1623, Percentage: 12.91 },
        { Name: "河北区", Count: 1456, Percentage: 11.58 },
        { Name: "红桥区", Count: 1234, Percentage: 9.81 },
        { Name: "东丽区", Count: 987, Percentage: 7.85 },
        { Name: "西青区", Count: 856, Percentage: 6.81 },
        { Name: "津南区", Count: 623, Percentage: 4.95 },
        { Name: "北辰区", Count: 198, Percentage: 1.57 }
    ]
};

// ==================== 右下 - 结案趋势数据 ====================
export const generateMockCaseStatsWithFullDateRange = (days = 31) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        // 生成随机但合理的案件数量（100-500之间）
        const caseCount = Math.floor(Math.random() * 400) + 100;
        data.push({
            StatDate: dateStr,
            StatDateStr: dateStr,
            CaseCount: caseCount
        });
    }
    return { statsWithCounts: data };
};

// 默认使用31天数据
export const mockCaseStatsWithFullDateRange = generateMockCaseStatsWithFullDateRange(31);

// ==================== 地图 - 案件点位数据 ====================
export const mockMapData = {
    caseInfos: (() => {
        const points = [];
        // 市中心区域坐标范围
        const baseLng = 117.195968;
        const baseLat = 39.125582;
        
        // 生成150个随机点位
        for (let i = 1; i <= 150; i++) {
            // 在中心点周围随机偏移（约±0.05度，约5公里范围）
            const lng = baseLng + (Math.random() - 0.5) * 0.1;
            const lat = baseLat + (Math.random() - 0.5) * 0.1;
            
            points.push({
                CaseMainID: 20000 + i,
                Longitude: lng.toFixed(6),
                Latitude: lat.toFixed(6),
                PositionCode: `TJ${String(i).padStart(5, '0')}`
            });
        }
        return points;
    })()
};

// ==================== 刷新Token ====================
export const mockRefreshToken = {
    Token: "mock_refreshed_jwt_token_0987654321zyxwvutsrqponmlkjihgfedcba"
};
