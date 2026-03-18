export interface UpdateAISetting {
    uuid: string;
    name: string;
    desc: string;
    personality: string;
}
export interface CreateAISetting {
    name: string;
    desc: string;
    personality: string;
}
export interface Conversation {
    uuid: string;
    title: string;
    user_id: number;
    setting_id: number;
    messages: Message[];
}
export interface Message {
    uuid: string;
    conversation_uuid: string;
    role: number;
    content: string;
    sequence: number;
}
export interface AISettingPageQuery {
    page: number;
    pageSize: number;
}
export interface ConvPageQuery {
    page: number;
    pageSize: number;
}
export interface WsMessage {
    type: string;
    data: any;
}
export interface ConvMsg {
    id: number;
    conversation_id: number;
    role: number;
    content: string;
    sequence: number;
}
export interface LlmSetting {
    prompt_text: string;
    prompt_uuid: string;
    namespace_uuid?: string[];
}
export interface User {
    uuid: string;
    name: string;
    email: string;
    role: string;
    status: string;
}
export interface LoginRequest {
    name: string;
    email: string;
    password: string;
}
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    user: User;
}
export interface RegisterResponse {
    user: User;
    message?: string;
}
