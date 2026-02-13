<template>
    <div class="popWin">
        <div class="popWinBg"></div>
        <div class="demo-progress">
            <div class="Tips-Content" v-if="!IsSuccess">
                <span class="header-title-font title Tips">{{ loadingText }}</span>
                <div class="stage">
                    <div class="dot-elastic" :show-text="true"></div>
                </div>
            </div>
            <div class="Tips-Content" v-else>
                <span class="header-title-font title Tips">身份确认！</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VerifyJWT } from '@/api/login/index'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter();
const route = useRoute();
const IsSuccess = ref(false);
const loadingText = ref('身份认证中');

// 检查URL参数
const checkUrlParams = () => {
  console.log('当前URL参数:', route.query);
  return !!route.query.token;
};

// 跳转到登录页的统一方法
const redirectToLogin = () => {
  // 清除存储
  // sessionStorage.removeItem('Token');
  // 立即跳转
  router.replace('/');
};

// 尝试通过API获取Token
const tryGetTokenFromAPI = async () => {
  try {
    loadingText.value = '正在尝试获取Token';
    
	// 构造登录数据
	const loginData = {
		"Username": "ww",
		"Password": 1, // 单点登录无需加密
	};
	
	const response = await VerifyJWT('/api/SSOUser/OSSLogin', loginData);
	console.log(response);
	
    if (response.Token) {
      return response.Token;
    }
	
    throw new Error(response.msg || '自动获取Token失败');
  } catch (error) {
    redirectToLogin();
  }
};

// 验证Token并跳转
const verifyTokenAndRedirect = async () => {
    loadingText.value = '正在验证身份...';
    
    let token = route.query.token;
    if (!token) {
      token = await tryGetTokenFromAPI();
    }
    
    if (!token) {
      throw new Error('Token无效');
    }

    // 存储Token
    sessionStorage.setItem('Token', JSON.stringify(token));
    
    IsSuccess.value = true;
    loadingText.value = '验证成功，即将跳转...';
    ElMessage.success('验证成功');
    
    // 延迟跳转（非定时器）
    setTimeout(() => {
      router.replace('/home');
    }, 1000);
    
};

onMounted(async () => {
  await verifyTokenAndRedirect();
});
</script>

<style lang="less" scoped>
.popWin {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
    position: fixed;
    z-index: 10;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    pointer-events: none;
    z-index: 99999;

    .popWinBg {
        position: fixed;
        z-index: 8;
        width: 100%;
        background-image: url("@/static/img/login/Base-Map.png");
        background-size: 100% 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: initial;
    }

    .demo-progress {
        pointer-events: initial;
        position: relative;
        overflow: hidden;
        z-index: 100;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .Tips-Content {
            display: flex;
            justify-content: center;
            width: 35%;
            margin-bottom: 10px;

            .Tips {
                font-size: 34px;
                font-weight: 600;
                background-image: linear-gradient(to bottom, rgb(255, 255, 255), rgb(255, 255, 255));
            }
        }


        .el-progress--line {
            margin-bottom: 15px;
            width: 300px;
            position: relative;

            :deep(.el-progress__text) {
                display: none;
                margin-left: 0px !important;
                position: absolute !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                color: #333 !important;

                span {
                    font-size: 14px !important;
                    display: flex !important;
                    align-items: center !important;
                }
            }
        }
    }
}

.stage {
    display: flex;
    justify-content: center;
    align-items: end;
    width: 15%;
    margin: 5px -5%;
    overflow: hidden;
}

.dot-pulse {
    position: relative;
    left: -9999px;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #ffffff;
    color: #ffffff;
    box-shadow: 9984px 0 0 0 #ffffff, 9999px 0 0 0 #ffffff,
        10014px 0 0 0 #ffffff;
    animation: dotPulse 1.5s infinite linear;
}


.dot-elastic {
    position: relative;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #ffffff;
    color: #ffffff;
    animation: dotElastic 1s infinite linear;
}

.dot-elastic::before {
    left: -15px;
    animation: dotElasticBefore 1s infinite linear;
}

.dot-elastic::after {
    left: 15px;
    animation: dotElasticAfter 1s infinite linear;
}

.dot-elastic::before,
.dot-elastic::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #ffffff;
    color: #ffffff;
}

@keyframes dotElasticAfter {
    0% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(1, 1);
    }

    50% {
        transform: scale(1, 0.67);
    }

    75% {
        transform: scale(1, 1.5);
    }

    100% {
        transform: scale(1, 1);
    }
}

@keyframes dotElasticBefore {
    0% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(1, 1.5);
    }

    50% {
        transform: scale(1, 0.67);
    }

    75% {
        transform: scale(1, 1);
    }

    100% {
        transform: scale(1, 1);
    }
}

@keyframes dotElastic {
    0% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(1, 1);
    }

    50% {
        transform: scale(1, 1.5);
    }

    75% {
        transform: scale(1, 1);
    }

    100% {
        transform: scale(1, 1);
    }
}
</style>