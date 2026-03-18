import { CreateAISetting, UpdateAISetting } from '@/types/request';
declare class FetchUtil {
    static get<T>(url: string): Promise<T>;
    static post<T>(url: string, body: any): Promise<T>;
    static put<T>(url: string, body: any): Promise<T>;
    static delete<T>(url: string): Promise<T>;
    static testAPI(): Promise<{
        [key: string]: string;
    }>;
    static createAISetting(setting: CreateAISetting): Promise<any>;
    static getAISettings(page: number, pageSize: number): Promise<any>;
    static updateAISetting(setting: UpdateAISetting): Promise<any>;
    static deleteAISetting(uuid: string): Promise<any>;
    static getSingleAISetting(uuid: string): Promise<any>;
    static listConversations(page: number, pageSize: number): Promise<any>;
    static getConversationMessages(uuid: string): Promise<any>;
    static deleteConversation(uuid: string): Promise<any>;
    static getIceUrl(): Promise<any>;
    static register(data: {
        name: string;
        code: string;
        email: string;
        password: string;
    }): Promise<any>;
    static login(data: {
        email: string;
        password: string;
    }): Promise<any>;
    static logout(): Promise<any>;
    static verifyToken(): Promise<any>;
    static getUserInfo(): Promise<any>;
    static updateUserInfo(data: {
        old_password: string;
        new_password: string;
    }): Promise<any>;
    static sendEmailVerifyCode(email: string): Promise<any>;
    static postForm<T>(url: string, formData: FormData): Promise<T>;
    static uploadAndVectorize(formData: FormData): Promise<any>;
    static listFilesByNamespace(page: number, pageSize: number, namespace_uuid: string): Promise<any>;
    static deleteFile(file_uuid: string): Promise<any>;
    static createNamespace(data: {
        description: string;
        name: string;
    }): Promise<any>;
    static updateNamespace(data: {
        description: string;
        uuid: string;
    }): Promise<any>;
    static deleteNamespace(uuid: string): Promise<any>;
    static listNamespace(page: number, pageSize: number): Promise<any>;
}
export default FetchUtil;
