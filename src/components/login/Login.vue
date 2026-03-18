<template>
  <div class="combined-container">
    <!-- Aurora 背景 -->
    <Aurora
        :color-stops="['#6699FF', '#171D22', '#6699FF']"
        :amplitude="1.0"
        :blend="0.5"
        :speed="1.0"
        :intensity="1.0"
        class="w-full h-full absolute top-0 left-0 z-0"
    />

    <div class="pre-container">
      <!--淡入淡出-->
      <FadeContent
          :blur="true"
          :duration="1000"
          :delay="200"
          :threshold="0.1"
          :initial-opacity="0"
          easing="ease-out"
          class-name="my-fade-content"
      >

        <div class="container">
          <div class="form-box login">
            <form @submit.prevent="handleLogin">
              <h1>Login</h1>
              <div class="input-box">
                <input type="text" placeholder="Email" required v-model="loginEmail" />
                <i class="bx bxs-user"></i>
              </div>
              <div class="input-box">
                <input type="password" placeholder="Password" required v-model="loginPassword" />
                <i class="bx bxs-lock-alt"></i>
              </div>
              <div class="agreement-box" style="margin: 24px 0 8px 0; text-align: left;">
                <label style="font-size: 14px; cursor: pointer;">
                  <input type="checkbox" v-model="agree" style="vertical-align: middle; margin-right: 6px;" />
                  我已阅读并同意
                  <a href="/privacy" target="_blank" style="color: #7494ec; text-decoration: underline;">《隐私协议》</a>
                  和
                  <a href="/terms" target="_blank" style="color: #7494ec; text-decoration: underline;">《用户使用协议》</a>
                </label>
                <div v-if="showAgreeTip" style="color: #e74c3c; font-size: 13px; margin-top: 4px;">请先阅读并同意隐私协议和用户使用协议</div>
              </div>
              <button type="submit" class="btn cursor-target" style="margin-top: 12px;">Login</button>
            </form>
          </div>

          <div class="form-box register">
            <form @submit.prevent="handleRegister">
              <h1>Registration</h1>
              <div class="input-box">
                <input type="email" placeholder="Email" required v-model="registerEmail" />
                <i class="bx bxs-envelope"></i>
              </div>
              <div class="input-box input-code">
                <input type="text" placeholder="Code" required v-model="registerCode" />
                <button type="button" class="code-btn cursor-target" @click="sendEmail" :disabled="isSendDisabled">
                  {{ isSendDisabled ? `${sendCountdown}s` : 'send' }}
                </button>
              </div>
              <div class="input-box">
                <input type="password" placeholder="Password" required v-model="registerPassword" />
                <i class="bx bxs-lock-alt"></i>
              </div>
              <div class="input-box">
                <input type="text" placeholder="Nickname" required v-model="registerName" />
                <i class="bx bxs-user"></i>
              </div>
              <button type="submit" class="btn cursor-target">Register</button>
            </form>
          </div>

          <div class="toggle-box">
            <div class="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Don's have an account?</p>
              <button class="btn register-btn cursor-target">Register</button>
            </div>

            <div class="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button class="btn login-btn cursor-target">Login</button>
            </div>
          </div>
        </div>
      </FadeContent>
    </div>
  </div>
</template>

<script lang="ts" setup name="Login">

import router from '@/router'
import { onMounted, ref } from 'vue'
import FetchUtil from '@/api/http'
import { useUserStore } from '@/stores/user'
import Aurora from '@/color/Aurora.vue';
import FadeContent from "@/color/FadeContent.vue";


const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerCode = ref('')
const registerPassword = ref('')
const container = ref<HTMLDivElement | null>(null)
const registerBtn = ref<HTMLButtonElement | null>(null)
const loginBtn = ref<HTMLButtonElement | null>(null)
const isSendDisabled = ref(false)
const sendCountdown = ref(60)
const user = useUserStore()

// 协议勾选状态
const agree = ref(false)

onMounted(() => {
  // 查询DOM元素并添加类型守卫
  const containerEl = document.querySelector<HTMLDivElement>('.container')
  const registerBtnEl = document.querySelector<HTMLButtonElement>('.btn.register-btn')
  const loginBtnEl = document.querySelector<HTMLButtonElement>('.btn.login-btn')

  // 安全赋值：仅当元素存在时赋值
  if (containerEl) container.value = containerEl
  if (registerBtnEl) registerBtn.value = registerBtnEl
  if (loginBtnEl) loginBtn.value = loginBtnEl

  // 添加事件监听（带类型守卫）
  if (registerBtn.value && container.value) {
    registerBtn.value.addEventListener('click', () => {
      container.value?.classList.add('active')
    })
  }

  if (loginBtn.value && container.value) {
    loginBtn.value.addEventListener('click', () => {
      container.value?.classList.remove('active')
    })
  }
  // 添加密码可见性切换功能
  setupPasswordVisibilityToggles()
})

function sendEmail() {
  if (isSendDisabled.value) return
  // 禁用按钮并开始倒计时
  isSendDisabled.value = true
  let countdown = 60
  const timer = setInterval(() => {
    sendCountdown.value = countdown
    if (countdown === 0) {
      clearInterval(timer)
      isSendDisabled.value = false
      sendCountdown.value = 60
    }
    countdown--
  }, 1000)

  FetchUtil.sendEmailVerifyCode(registerEmail.value)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error('发送验证码失败', err)
        // 若发送失败，提前结束倒计时
        clearInterval(timer)
        isSendDisabled.value = false
        sendCountdown.value = 60
      })
}

// 密码可见性切换函数
function setupPasswordVisibilityToggles() {
  // 查询所有密码输入框和对应的图标
  const passwordInputs = document.querySelectorAll<HTMLInputElement>('input[type="password"]')

  passwordInputs.forEach((input) => {
    // 查找对应的图标（假设图标紧跟在input后面）
    const parent = input.parentElement
    const icon = parent?.querySelector<HTMLElement>('i.bxs-lock-alt')

    if (icon) {
      // 为图标添加点击事件
      icon.addEventListener('click', () => {
        // 切换密码可见性
        const isVisible = input.type === 'text'

        // 修改input类型
        input.type = isVisible ? 'password' : 'text'

        // 切换图标样式
        if (isVisible) {
          icon.classList.remove('bxs-lock-open-alt')
          icon.classList.add('bxs-lock-alt')
        } else {
          icon.classList.remove('bxs-lock-alt')
          icon.classList.add('bxs-lock-open-alt')
        }
      })

      // 使图标可点击（添加光标样式）
      icon.style.cursor = 'pointer'
    }
  })
}

// 处理登录表单提交
const showAgreeTip = ref(false)

async function handleLogin() {
  if (!agree.value) {
    showAgreeTip.value = true
    return
  }
  showAgreeTip.value = false
  try {
    const res = await FetchUtil.login({
      email: loginEmail.value,
      password: loginPassword.value,
    })
    if (res?.token) sessionStorage.setItem('auth_token', res.token)
    await FetchUtil.getUserInfo().then((ref) => {
      user.setUser({
        uuid: ref.uuid,
        name: ref.name,
        email: ref.email,
      })
    })
    await user.setIsLogin(true)
    sessionStorage.setItem('chat_just_logged_in', '1')
    localStorage.removeItem('chat_current_conversation_uuid')
    await router.push('/AI')
  } catch (err) {
    alert('登录失败，请检查账号和密码')
  }
}

// 处理注册表单提交
async function handleRegister() {
  try {
    const res = await FetchUtil.register({
      name: registerName.value,
      code: registerCode.value,
      email: registerEmail.value,
      password: registerPassword.value,
    }).then((res) => {
      console.log(res)
    })

    alert('注册成功，请登录')
    // 可自动切换到登录表单
    container.value?.classList.remove('active')
  } catch (err) {
    console.log(err)
    alert('注册失败，请检查信息')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
/*import './google-fonts.css';*/
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

/* 添加加载状态样式 */
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 确保成功消息不影响动画 */
.success-message {
  pointer-events: none; /* 防止遮挡按钮点击 */
}

/* 添加解锁图标的样式 */
.bxs-lock-open-alt {
  color: #7494ec !important; /* 使用与主题相同的颜色 */
}

/* 初始状态：显示登录表单，隐藏注册表单 */
.form-box.register {
  padding-top: 5%;
  display: none;
}

/* 激活状态：显示注册表单，隐藏登录表单 */
.container.active .form-box.login {
  display: none;
}

.container.active .form-box.register {
  display: block;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.pre-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

.container {
  position: relative;
  width: 850px;
  height: 550px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  margin: 20px;
  overflow: hidden;
}

.container.active .toggle-box::before {
  left: 50%;
}

.form-box {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  color: #333;
  text-align: center;
  padding: 40px;
  z-index: 1;
  transition:
      0.6s ease-in-out 1.2s,
      visibility 0s 1s;
}

.container.active .form-box {
  right: 50%;
}

.form-box.register {
  visibility: hidden;
}

.container.active .form-box.register {
  visibility: visible;
}

.form-box form {
  width: 100%;
}

.container h1 {
  font-size: 36px;
  margin: -10px 0;
}

.input-box {
  position: relative;
  margin: 30px 0;
}

.input-box.input-code {
  display: flex;
  align-items: center;
}

.code-btn {
  background: #dfdfdf;
  border-radius: 8px;
  margin-left: 10px;
  padding: 10px 12px;
}

.code-btn:hover {
  background: #818181;
}

.input-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #333;
  outline: none;
}

.input-box label {
  position: absolute;
  top: 0;
}

.input-box input {
  width: 100%;
  padding: 13px;
  background-color: #eee;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 8px;
  color: #333;
  font-weight: 500;
}

.input-box input::placeholder {
  color: #888;
  font-weight: 400;
}

.input-box i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #888;
}

.forgot-link {
  margin: -15px 0 15px;
}

.forgot-link a {
  font-size: 14.5px;
  color: #333;
  text-decoration: none;
}

.btn {
  width: 100%;
  height: 48px;
  background-color: #7494ec;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.container p {
  font-size: 14.5px;
  margin: 15px 0;
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons a {
  display: inline-flex;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 24px;
  color: #333;
  text-decoration: none;
  margin: 0 8px;
}

.toggle-box {
  position: absolute;
  width: 100%;
  height: 100%;
}

.toggle-box::before {
  content: '';
  position: absolute;
  left: -250%;
  width: 300%;
  height: 100%;
  background-color: #7494ec;
  z-index: 2;
  border-radius: 150px;
  transition: 1.8s ease-in-out;
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: 0.6s ease-in-out;
}

.toggle-panel.toggle-left {
  left: 0;
  transition-delay: 1.2s;
}

.container.active .toggle-panel.toggle-left {
  left: -50%;
  transition-delay: 0.6s;
}

.toggle-panel.toggle-right {
  right: -50%;
  transition-delay: 0.6s;
}

.container.active .toggle-panel.toggle-right {
  right: 0;
  transition-delay: 1.2s;
}

.toggle-panel p {
  margin-bottom: 20px;
}

.toggle-panel .btn {
  width: 160px;
  height: 46px;
  background-color: transparent;
  border: 2px solid #fff;
  box-shadow: none;
}

@media screen and (max-width: 650px) {
  .container {
    height: calc(100vh - 40px);
  }

  .form-box {
    bottom: 0;
    width: 100%;
    height: 70%;
  }

  .container.active .form-box {
    right: 0;
    bottom: 30%;
  }

  .toggle-box::before {
    left: 0;
    width: 100%;
    top: -270%;
    height: 300%;
    border-radius: 20vw;
  }

  .container.active .toggle-box::before {
    left: 0;
    top: 70%;
  }

  .toggle-panel {
    width: 100%;
    height: 30%;
  }

  .toggle-panel.toggle-left {
    top: 0;
  }

  .container.active .toggle-panel.toggle-left {
    left: 0;
    top: -30%;
  }

  .toggle-panel.toggle-right {
    right: 0;
    bottom: -30%;
  }

  .container.active .toggle-panel.toggle-right {
    bottom: 0;
  }
}

@media screen and (max-width: 400px) {
  .form-box {
    padding: 20px;
  }

  .toggle-panel h1 {
    font-size: 30px;
  }
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLDz8Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLDz8Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/src/assets/fonts/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/src/assets/fonts/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLCz7Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLDD4Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLDD4Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* latin-ext */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLBT5Z1JlFc-K.woff2) format('woff2');
  unicode-range:
      U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
      U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
      U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(/src/assets/fonts/pxiByp8kv8JHgFVrLBT5Z1xlFQ.woff2) format('woff2');
  unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
</style>
