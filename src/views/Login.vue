<template>
	<div>
		<transition appear enter-active-class="animate__animated animate__slideInDown animate__slow">
			<div class="Login-container" v-if="show">
				<div class="Title-Text-Content">
					<span class="header-title-font title">巡查管理平台</span>
				</div>
				<div class="Login-Panel-Content" v-if="LoginPanelSHow">
					<transition appear enter-active-class="animate__animated animate__zoomIn animate__slow">
						<div class="Login-Panel">
							<div class="Login-Panel-Title">
								<span>系统登录</span>
							</div>
							<div class="Login-Panel-Main">
								<div class="PhoneNum-Input">
									<el-input v-model="username" placeholder="请输入账号" autocomplete="off"></el-input>
								</div>
								<div class="Password-Input">
									<el-input v-model="password" type="password" show-password
										placeholder="请输入密码" autocomplete="off"></el-input>
								</div>
								<div class="Verification-Code-Input">
									<div class="input-with-button">
										<el-input v-model="code" placeholder="请输入验证码" maxlength="4" autocomplete="off"></el-input>
										<div class="code-display" @click="setCaptchaCode">
											{{ displayedCode }}
										</div>
									</div>
									<div class="refresh-code" @click="fetchCaptcha">
										
									</div>
								</div>
							</div>
							<div class="Login-Panel-Footer">
								<div class="button" @click="LoginEnter">
									<span>
										登录
									</span>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { GetCapTCHAPicture,GoLogin } from '@/api/login/index'
import EncryptedData from '@/utils/Encipher/ToolsCm';

const router = useRouter();  // 路由实例

const show = ref(false);  // 背景动画显示
const LoginPanelSHow = ref(false);  // 登录框动画显示

const LoginKey = ref(''); // 存储验证码的 Key
const captchaImage = ref(''); // 存储验证码的 Base64 图片数据

const username = ref('');  // 用户名
const password = ref('');  // 密码
const code = ref('');      // 验证码
const displayedCode = ref('1234'); // 显示的验证码

// 获取验证码
const fetchCaptcha = async () => {
  try {
    let res = await GetCapTCHAPicture('/api/Authentication/GetCaptcha','');
	if(res.Key && res.Image){
		LoginKey.value = res.Key; // 保存 Key，用于后续验证
		captchaImage.value = `data:image/png;base64,${res.Image}`; // 转为可直接渲染的 Base64 URL
	}
  } catch (error) {
    console.error('获取验证码失败:', error);
  }
};

// 设置验证码
const setCaptchaCode = () => {
  code.value = displayedCode.value;
};

// 点击登录
const LoginEnter = async () => {
	  try {
	    // 验证输入
	    if (!username.value) {
	      ElMessage.error('请输入账号！');
	      return;
	    }
	    if (!password.value) {
	      ElMessage.error('请输入密码！');
	      return;
	    }
	    if (!code.value) {
	      ElMessage.error('请输入验证码！');
	      return;
	    }
	
	    // 构造登录数据
	    const loginData = {
	      "Username": username.value,
	      "Password": EncryptedData(password.value), // 使用加密后的密码
	      "VerificationCode": code.value,
	      "VerificationCodeKey": LoginKey.value
	    };
	
	    // 调用登录接口
	    const res = await GoLogin('/api/Authentication/Login', JSON.stringify(loginData));
	
	    // 检查返回结果
	    if (res.Token) {
	      ElMessage.success('登录成功'); // 使用 success 提示
	      sessionStorage.setItem('Token', JSON.stringify(res.Token)); // 存储 Token
	      router.replace('/home'); // 跳转到首页
	    } else {
	      ElMessage.error('登录失败，请检查账号或密码'); // 登录失败提示
	    }
	  } catch (error) {
	    ElMessage.error('登录失败，请稍后重试'); // 向用户显示友好提示
	  }
};

// 页面初始化时
onMounted(() => {
	show.value = true;
	setTimeout(() => {
		LoginPanelSHow.value = true;
	}, 500);
	sessionStorage.setItem('Token', null); // 如果是重新登陆清空token
	fetchCaptcha();
});

</script>

<style lang="less" scoped>
.Login-container {
	background-image: url("/img/login/Base-Map.png");
	background-size: 100% 100%;
	width: 1920px;
	height: 1080px;
	position: relative;

	.Title-Text-Content {
		text-align: center;

		span {
			display: inline-block;
			margin-top: 18px;
			font-size: 46px;
			font-style: italic;
			color: #fff;
			letter-spacing: 10px;
			text-shadow: 0 0 18px rgba(44, 214, 223, 0.7);
		}
	}

	.Login-Panel-Content {
		width: 30%;
		height: 40%;
		position: absolute;
		top: 47%;
		left: 50%;
		transform: translate(-50%, -50%);

		.Login-Panel {
			width: 100%;
			height: 100%;
			background-image: url("/img/login/Login-Panel.png");
			background-size: 100% 100%;

			.Login-Panel-Title {
				height: 20%;
				position: relative;

				span {
					position: absolute;
					top: 63%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #f0d78c;
					font-size: 25px;
					letter-spacing: 6px;
					font-family: "font-header-title";
					text-shadow: 0 0 8px rgba(240, 215, 140, 0.45);
				}
			}

			.Login-Panel-Main {
				height: 55%;
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;

				.PhoneNum-Input,
				.Password-Input,
				.Verification-Code-Input {
					display: flex;
					align-items: center;
					height: 18%;
					width: 60%;
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}

				.PhoneNum-Input {
					background-image: url("/img/login/PhoneNum-Input.png");
				}

				.Password-Input {
					background-image: url("/img/login/Password-Input.png");
				}

				.Verification-Code-Input {
					background-image: url("/img/login/Verification-Code-Input.png");
				}

				:deep(.el-input) {
					height: 70%;
					width: calc(100% - 72px);
					margin-left: 58px;
					--el-input-bg-color: transparent;
					--el-input-border-color: transparent;
					--el-input-hover-border-color: transparent;
					--el-input-focus-border-color: transparent;
					--el-input-text-color: #fff;
					--el-fill-color-blank: transparent;
				}

				:deep(.el-input__wrapper) {
					background: transparent !important;
					box-shadow: none !important;
					padding: 0 8px;
					height: 100%;
				}

				:deep(.el-input__inner) {
					height: 100%;
					line-height: 1;
					margin-top: 0 !important;
					font-size: 16px !important;
					letter-spacing: 2px !important;
					font-family: "font-header-title", sans-serif !important;
					-webkit-text-fill-color: #fff !important;
					color: #fff !important;
					background-color: transparent !important;
				}

				:deep(.el-input__inner::placeholder) {
					color: rgba(255, 255, 255, 0.55) !important;
					-webkit-text-fill-color: rgba(255, 255, 255, 0.55) !important;
				}

				:deep(.el-input__suffix),
				:deep(.el-input__prefix) {
					display: flex;
					align-items: center;
				}

				:deep(.el-input__password) {
					color: #9ad7ea;
				}

				:deep(input:-webkit-autofill),
				:deep(input:-webkit-autofill:hover),
				:deep(input:-webkit-autofill:focus) {
					-webkit-text-fill-color: #fff !important;
					caret-color: #fff;
					transition: background-color 9999s ease-out 0s;
				}
			}

			.Login-Panel-Footer {
				height: 25%;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.button {
					margin-bottom: 25px;
					background-image: linear-gradient(to right, #1d88df 0%, #a6c1ee 100%);
					width: 230px;
					height: 40px;
					display: flex;
					justify-content: center;
					align-items: center;
					transform: skewX(-25deg);
					cursor: pointer;
				}

				.button>span {
					display: block;
					color: white;
					transform: skewX(25deg);
					font-family: "font-header-title";
					letter-spacing: 5px;
					font-size: 20px;
					line-height: 1;
				}

				.button:hover {
					background-image: linear-gradient(to right, #a6c1ee 0%, #1259d3 100%);
				}
			}
		}
	}
}

.input-with-button {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;

	:deep(.el-input) {
		flex: 1;
		width: auto !important;
		height: 70%;
		margin-left: 58px;
		margin-right: 6px;
	}
}

.code-display {
	flex-shrink: 0;
	width: 88px;
	height: 70%;
	margin-right: 10px;
	background: rgba(2, 213, 223, 0.18);
	border: 1px solid rgba(2, 213, 223, 0.7);
	border-radius: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: 4px;
	font-family: "font-header-title";
	cursor: pointer;
}

.refresh-code {
	display: none;
}
</style>