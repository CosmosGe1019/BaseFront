import { CreateAISetting, UpdateAISetting } from '@/types/request';
const BaseURL = 'http://localhost:8888/api';
const AuthTokenKey = 'auth_token';
class FetchUtil {
    static async get(url) {
        const token = sessionStorage.getItem(AuthTokenKey);
        const response = await fetch(BaseURL + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    static async post(url, body) {
        const token = sessionStorage.getItem(AuthTokenKey);
        const response = await fetch(BaseURL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    static async put(url, body) {
        const token = sessionStorage.getItem(AuthTokenKey);
        const response = await fetch(BaseURL + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    static async delete(url) {
        const token = sessionStorage.getItem(AuthTokenKey);
        const response = await fetch(BaseURL + url, {
            method: 'DELETE',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    // 测试 API 接口
    static async testAPI() {
        const url = '/test';
        return this.get(url);
    }
    // AI 设定相关接口
    static async createAISetting(setting) {
        const url = '/ai-settings/add';
        return this.post(url, setting);
    }
    static async getAISettings(page, pageSize) {
        const url = '/ai-settings/list?page=' + page + '&pageSize=' + pageSize;
        return this.get(url);
    }
    static async updateAISetting(setting) {
        const url = '/ai-settings/update';
        return this.put(url, setting);
    }
    static async deleteAISetting(uuid) {
        const url = `/ai-settings/delete/${uuid}`;
        return this.delete(url);
    }
    static async getSingleAISetting(uuid) {
        const url = `/ai-settings/view/${uuid}`;
        return this.get(url);
    }
    // 会话管理相关接口
    static async listConversations(page, pageSize) {
        const url = '/conversation/list?page=' + page + '&pageSize=' + pageSize;
        return this.get(url);
    }

      static async getConversationMessages(page, pageSizer, uuid) {
    const url = `/conversation/messages/${uuid}?page=${page}&pageSize=${pageSizer}`
    return this.get(url)
  }
  
    static async deleteConversation(uuid) {
    const url = `/conversation/delete/${uuid}`
    return this.delete(url)
  }

  static async updateConversation(data) {
    const url = '/conversation/update'
    return this.put(url, data)
  }

  // rustpbx相关
  static async getIceUrl() {
        const url = '/rustpbx/ice-url';
        return this.get(url);
    }
    //用户注册接口
    static async register(data) {
        const url = '/auth/register';
        return this.post(url, data);
    }
    // 用户登录接口
    static async login(data) {
        const url = '/auth/login';
        const res = await this.post(url, data);
        if (res?.token)
            sessionStorage.setItem(AuthTokenKey, res.token);
        return res;
    }
    // 用户注销接口
    static async logout() {
        const url = '/auth/logout';
        const res = await this.post(url, {});
        sessionStorage.removeItem(AuthTokenKey);
        return res;
    }
    // 验证token接口
    static async verifyToken() {
        const url = '/auth/verify';
        return this.get(url);
    }
    // 获取用户信息接口
    static async getUserInfo() {
        const url = '/auth/profile';
        return this.get(url);
    }
    static async updateUserInfo(data) {
        const url = '/auth/change-password';
        return this.put(url, data);
    }
    static async sendEmailVerifyCode(email) {
        const url = `/auth/send/${email}`;
        return this.get(url);
    }
    // 在 class FetchUtil 里添加
    static async postForm(url, formData) {
        const token = sessionStorage.getItem(AuthTokenKey);
        const response = await fetch(BaseURL + url, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: formData,
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    }
    // 修改 uploadAndVectorize
    static async uploadAndVectorize(formData) {
        const url = '/pinecone/file/upload';
        return this.postForm(url, formData);
    }
    static async listFilesByNamespace(page, pageSize, namespace_uuid) {
        const url = `/pinecone/file/list?page=${page}&pageSize=${pageSize}&namespace_uuid=${namespace_uuid}`;
        return this.post(url, {});
    }
    static async deleteFile(file_uuid) {
        const url = `/pinecone/file/delete?file_uuid=${file_uuid}`;
        return this.delete(url);
    }
    static async createNamespace(data) {
        const url = '/pinecone/namespace/create';
        return this.post(url, data);
    }
    static async updateNamespace(data) {
        const url = '/pinecone/namespace/update';
        return this.post(url, data);
    }
    static async deleteNamespace(uuid) {
        const url = `/pinecone/namespace/delete/${uuid}`;
        return this.delete(url);
    }
    static async listNamespace(page, pageSize) {
        const url = '/pinecone/namespace/list?page=' + page + '&pageSize=' + pageSize;
        return this.get(url);
    }
}
export default FetchUtil;
