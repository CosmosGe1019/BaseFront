import { defineStore } from 'pinia'
import { Assistant } from './assistant'

export interface user {
  uuid: string
  name: string
  email: string
  Assistants?: Assistant[] // 可选属性，用户的会话列表
}

export const useUserStore = defineStore('user', {
  state: (): {
    user: user
    users: user[]
    isLogin: boolean
  } => ({
    user: {
      uuid: '',
      name: '',
      email: '',
      Assistants: [],
    },
    users: [],
    isLogin: false,
  }),
  getters: {
    getUser(state) {
      return state.user
    },
    getUsers(state) {
      return state.users
    },
    getIsLogin(state) {
      return state.isLogin
    },
    getAssistants(state): Assistant[] {
      return state.user.Assistants || []
    },
  },
  actions: {
    setUser(user: user) {
      this.user = user
    },
    setUsers(users: user[]) {
      this.users = users
    },
    setIsLogin(isLogin: boolean) {
      this.isLogin = isLogin
    },
    logout() {
      this.user = { uuid: '', name: '', email: '' }
      this.isLogin = false
    },
    setAssistants(assistants: Assistant[]) {
      this.user.Assistants = assistants
    },
  },
})
