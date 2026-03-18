// AI 设定相关结构体
export interface UpdateAISetting {
  uuid: string // AI 设定的主键 ID
  name: string // AI 设定名称
  desc: string // AI 设定描述
  personality: string // AI 人设
}

export interface CreateAISetting {
  name: string // AI 设定名称
  desc: string // AI 设定描述
  personality: string // AI 人设
}

// 会话相关结构体
export interface Conversation {
  uuid: string
  title: string
  user_id: number
  setting_id: number
  messages: Message[]
}

// 消息相关结构体
export interface Message {
  uuid: string
  conversation_uuid: string
  role: number // 0-用户, 1-助手
  content: string
  sequence: number
}

// AI 设定分页查询参数结构体
export interface AISettingPageQuery {
  page: number // 当前页码，必须且最小值为 1
  pageSize: number // 每页数量，必须，最小值为 1，最大值为 20
}

// 会话分页查询参数结构体
export interface ConvPageQuery {
  page: number // 当前页码，必须且最小值为 1
  pageSize: number // 每页数量，必须，最小值为 1，最大值为 20
}

export interface WsMessage {
  type: string // 消息类型 number, ping, stop, text, webrtc-offer
  data: any
}

export interface ConvMsg {
  id: number // 主键 ID
  conversation_id: number // 会话 ID
  role: number // 消息角色:0-用户,1-AI助手
  content: string // 消息内容
  sequence: number // 消息序号
}

// ai的设定
export interface LlmSetting {
  prompt_text: string
  prompt_uuid: string
  namespace_uuid?: string[] // 知识库 UUID 列表
  conversation_uuid?: string
}

export interface User {
  uuid: string
  name: string
  email: string
  role: string // 用户角色
  status: string // 用户状态
}

export interface LoginRequest {
  name: string
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterResponse {
  user: User
  message?: string
}
