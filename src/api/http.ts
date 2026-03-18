import { CreateAISetting, UpdateAISetting } from '@/types/request'

const BaseURL = 'http://localhost:8888/api'
const AuthTokenKey = 'auth_token'

class FetchUtil {
  static async get<T>(url: string): Promise<T> {
    const token = sessionStorage.getItem(AuthTokenKey)
    const response = await fetch(BaseURL + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data: T = await response.json()
    return data
  }

  static async post<T>(url: string, body: any): Promise<T> {
    const token = sessionStorage.getItem(AuthTokenKey)
    const response = await fetch(BaseURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data: T = await response.json()
    return data
  }

  static async put<T>(url: string, body: any): Promise<T> {
    const token = sessionStorage.getItem(AuthTokenKey)
    const response = await fetch(BaseURL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data: T = await response.json()
    return data
  }

  static async delete<T>(url: string): Promise<T> {
    const token = sessionStorage.getItem(AuthTokenKey)
    const response = await fetch(BaseURL + url, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data: T = await response.json()
    return data
  }

  // 测试 API 接口
  static async testAPI(): Promise<{ [key: string]: string }> {
    const url = '/test'
    return this.get<{ [key: string]: string }>(url)
  }

  // AI 设定相关接口
  static async createAISetting(setting: CreateAISetting): Promise<any> {
    const url = '/ai-settings/add'
    return this.post<any>(url, setting)
  }

  static async getAISettings(page: number, pageSize: number): Promise<any> {
    const url = '/ai-settings/list?page=' + page + '&pageSize=' + pageSize
    return this.get<any>(url)
  }

  static async updateAISetting(setting: UpdateAISetting): Promise<any> {
    const url = '/ai-settings/update'
    return this.put<any>(url, setting)
  }

  static async deleteAISetting(uuid: string): Promise<any> {
    const url = `/ai-settings/delete/${uuid}`
    return this.delete<any>(url)
  }

  static async getSingleAISetting(uuid: string): Promise<any> {
    const url = `/ai-settings/view/${uuid}`
    return this.get<any>(url)
  }

  // 会话管理相关接口
  static async listConversations(page: number, pageSize: number): Promise<any> {
    const url = '/conversation/list?page=' + page + '&pageSize=' + pageSize
    return this.get<any>(url)
  }

  static async getConversationMessages(page: number, pageSize: number, uuid:string): Promise<any> {
    const url = `/conversation/messages/${uuid}?page=${page}&pageSize=${pageSize}`
    return this.get<any>(url)
  }

  static async deleteConversation(uuid: string): Promise<any> {
    const url = `/conversation/delete/${uuid}`
    return this.delete<any>(url)
  }

  static async updateConversation(data: { uuid: string; title: string }): Promise<any> {
    const url = '/conversation/update'
    return this.put<any>(url, data)
  }

  // rustpbx相关
  static async getIceUrl(): Promise<any> {
    const url = '/rustpbx/ice-url'
    return this.get<any>(url)
  }

  //用户注册接口
  static async register(data: {
    name: string
    code: string
    email: string
    password: string
  }): Promise<any> {
    const url = '/auth/register'
    return this.post<any>(url, data)
  }

  // 用户登录接口
  static async login(data: { email: string; password: string }): Promise<any> {
    const url = '/auth/login'
    const res = await this.post<any>(url, data)
    if (res?.token) sessionStorage.setItem(AuthTokenKey, res.token)
    return res
  }

  // 用户注销接口
  static async logout(): Promise<any> {
    const url = '/auth/logout'
    const res = await this.post<any>(url, {})
    sessionStorage.removeItem(AuthTokenKey)
    return res
  }

  // 验证token接口
  static async verifyToken(): Promise<any> {
    const url = '/auth/verify'
    return this.get<any>(url)
  }

  // 获取用户信息接口
  static async getUserInfo(): Promise<any> {
    const url = '/auth/profile'
    return this.get<any>(url)
  }

  static async updateUserInfo(data: { old_password: string; new_password: string }): Promise<any> {
    const url = '/auth/change-password'
    return this.put<any>(url, data)
  }

  static async sendEmailVerifyCode(email: string): Promise<any> {
    const url = `/auth/send/${email}`
    return this.get<any>(url)
  }

  // 在 class FetchUtil 里添加
  static async postForm<T>(url: string, formData: FormData): Promise<T> {
    const token = sessionStorage.getItem(AuthTokenKey)
    const response = await fetch(BaseURL + url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data: T = await response.json()
    return data
  }

  // 修改 uploadAndVectorize
  static async uploadAndVectorize(formData: FormData): Promise<any> {
    const url = '/pinecone/file/upload'
    return this.postForm<any>(url, formData)
  }

  static async listFilesByNamespace(
    page: number,
    pageSize: number,
    namespace_uuid: string,
  ): Promise<any> {
    const url = `/pinecone/file/list?page=${page}&pageSize=${pageSize}&namespace_uuid=${namespace_uuid}`
    return this.post<any>(url, {})
  }

  static async deleteFile(file_uuid: string): Promise<any> {
    const url = `/pinecone/file/delete?file_uuid=${file_uuid}`
    return this.delete<any>(url)
  }

  static async createNamespace(data: { description: string; name: string }): Promise<any> {
    const url = '/pinecone/namespace/create'
    return this.post<any>(url, data)
  }

  static async updateNamespace(data: { description: string; uuid: string }): Promise<any> {
    const url = '/pinecone/namespace/update'
    return this.post<any>(url, data)
  }

  static async deleteNamespace(uuid: string): Promise<any> {
    const url = `/pinecone/namespace/delete/${uuid}`
    return this.delete<any>(url)
  }

  static async listNamespace(page: number, pageSize: number): Promise<any> {
    const url = '/pinecone/namespace/list?page=' + page + '&pageSize=' + pageSize
    return this.get<any>(url)
  }
}

export default FetchUtil
