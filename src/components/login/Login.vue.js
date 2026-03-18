/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import router from '@/router';
import { onMounted, ref } from 'vue';
import FetchUtil from '@/api/http';
import { useUserStore } from '@/stores/user';
const loginEmail = ref('');
const loginPassword = ref('');
const registerName = ref('');
const registerEmail = ref('');
const registerCode = ref('');
const registerPassword = ref('');
const container = ref(null);
const registerBtn = ref(null);
const loginBtn = ref(null);
const isSendDisabled = ref(false);
const sendCountdown = ref(60);
const user = useUserStore();
onMounted(() => {
    // 查询DOM元素并添加类型守卫
    const containerEl = document.querySelector('.container');
    const registerBtnEl = document.querySelector('.btn.register-btn');
    const loginBtnEl = document.querySelector('.btn.login-btn');
    // 安全赋值：仅当元素存在时赋值
    if (containerEl)
        container.value = containerEl;
    if (registerBtnEl)
        registerBtn.value = registerBtnEl;
    if (loginBtnEl)
        loginBtn.value = loginBtnEl;
    // 添加事件监听（带类型守卫）
    if (registerBtn.value && container.value) {
        registerBtn.value.addEventListener('click', () => {
            container.value?.classList.add('active');
        });
    }
    if (loginBtn.value && container.value) {
        loginBtn.value.addEventListener('click', () => {
            container.value?.classList.remove('active');
        });
    }
    // 添加密码可见性切换功能
    setupPasswordVisibilityToggles();
});
function sendEmail() {
    if (isSendDisabled.value)
        return;
    // 禁用按钮并开始倒计时
    isSendDisabled.value = true;
    let countdown = 60;
    const timer = setInterval(() => {
        sendCountdown.value = countdown;
        if (countdown === 0) {
            clearInterval(timer);
            isSendDisabled.value = false;
            sendCountdown.value = 60;
        }
        countdown--;
    }, 1000);
    FetchUtil.sendEmailVerifyCode(registerEmail.value)
        .then((res) => {
        console.log(res);
    })
        .catch((err) => {
        console.error('发送验证码失败', err);
        // 若发送失败，提前结束倒计时
        clearInterval(timer);
        isSendDisabled.value = false;
        sendCountdown.value = 60;
    });
}
// 密码可见性切换函数
function setupPasswordVisibilityToggles() {
    // 查询所有密码输入框和对应的图标
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
        // 查找对应的图标（假设图标紧跟在input后面）
        const parent = input.parentElement;
        const icon = parent?.querySelector('i.bxs-lock-alt');
        if (icon) {
            // 为图标添加点击事件
            icon.addEventListener('click', () => {
                // 切换密码可见性
                const isVisible = input.type === 'text';
                // 修改input类型
                input.type = isVisible ? 'password' : 'text';
                // 切换图标样式
                if (isVisible) {
                    icon.classList.remove('bxs-lock-open-alt');
                    icon.classList.add('bxs-lock-alt');
                }
                else {
                    icon.classList.remove('bxs-lock-alt');
                    icon.classList.add('bxs-lock-open-alt');
                }
            });
            // 使图标可点击（添加光标样式）
            icon.style.cursor = 'pointer';
        }
    });
}
// 处理登录表单提交
async function handleLogin() {
    try {
        const res = await FetchUtil.login({
            email: loginEmail.value,
            password: loginPassword.value,
        });
        await FetchUtil.getUserInfo().then((ref) => {
            user.setUser({
                uuid: ref.uuid,
                name: ref.name,
                email: ref.email,
            });
        });
        await user.setIsLogin(true);
        router.push('/AI');
    }
    catch (err) {
        alert('登录失败，请检查账号和密码');
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
            console.log(res);
        });
        alert('注册成功，请登录');
        // 可自动切换到登录表单
        container.value?.classList.remove('active');
    }
    catch (err) {
        console.log(err);
        alert('注册失败，请检查信息');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['register']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['register']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['register']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['code-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['social-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-left']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-right']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-box']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-left']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-left']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-right']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-right']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pre-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-box login" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Email",
    required: true,
    value: (__VLS_ctx.loginEmail),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "bx bxs-user" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "password",
    placeholder: "Password",
    required: true,
});
(__VLS_ctx.loginPassword);
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "bx bxs-lock-alt" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-box register" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleRegister) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "email",
    placeholder: "Email",
    required: true,
});
(__VLS_ctx.registerEmail);
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "bx bxs-envelope" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box input-code" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Code",
    required: true,
    value: (__VLS_ctx.registerCode),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.sendEmail) },
    type: "button",
    ...{ class: "code-btn" },
    disabled: (__VLS_ctx.isSendDisabled),
});
(__VLS_ctx.isSendDisabled ? `${__VLS_ctx.sendCountdown}s` : 'send');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "password",
    placeholder: "Password",
    required: true,
});
(__VLS_ctx.registerPassword);
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "bx bxs-lock-alt" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "input-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Nickname",
    required: true,
    value: (__VLS_ctx.registerName),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "bx bxs-user" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toggle-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toggle-panel toggle-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "btn register-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toggle-panel toggle-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "btn login-btn" },
});
/** @type {__VLS_StyleScopedClasses['pre-container']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bx']} */ ;
/** @type {__VLS_StyleScopedClasses['bxs-user']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bx']} */ ;
/** @type {__VLS_StyleScopedClasses['bxs-lock-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-box']} */ ;
/** @type {__VLS_StyleScopedClasses['register']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bx']} */ ;
/** @type {__VLS_StyleScopedClasses['bxs-envelope']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['input-code']} */ ;
/** @type {__VLS_StyleScopedClasses['code-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bx']} */ ;
/** @type {__VLS_StyleScopedClasses['bxs-lock-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['input-box']} */ ;
/** @type {__VLS_StyleScopedClasses['bx']} */ ;
/** @type {__VLS_StyleScopedClasses['bxs-user']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-box']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-left']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-right']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loginEmail: loginEmail,
            loginPassword: loginPassword,
            registerName: registerName,
            registerEmail: registerEmail,
            registerCode: registerCode,
            registerPassword: registerPassword,
            isSendDisabled: isSendDisabled,
            sendCountdown: sendCountdown,
            sendEmail: sendEmail,
            handleLogin: handleLogin,
            handleRegister: handleRegister,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
