import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            uuid: '',
            name: '',
            email: '',
        },
        users: [],
        isLogin: false,
    }),
    getters: {
        getUser(state) {
            return state.user;
        },
        getUsers(state) {
            return state.users;
        },
        getIsLogin(state) {
            return state.isLogin;
        },
        getAssistants(state) {
            return state.user.Assistants || [];
        },
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        setUsers(users) {
            this.users = users;
        },
        setIsLogin(isLogin) {
            this.isLogin = isLogin;
        },
        logout() {
            this.user = { uuid: '', name: '', email: '' };
            this.isLogin = false;
        },
        setAssistants(assistants) {
            this.user.Assistants = assistants;
        },
    },
});
