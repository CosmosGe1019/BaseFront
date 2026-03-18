// AI 设定相关结构体
// 可作为 UpdateAISetting 的示例数据结构
export const UpdateAISetting = {
    uuid: '', // AI 设定的主键 ID
    name: '', // AI 设定名称
    desc: '', // AI 设定描述
    personality: '' // AI 人设
};

// 可作为 CreateAISetting 的示例数据结构
export const CreateAISetting = {
    name: '', // AI 设定名称
    desc: '', // AI 设定描述
    personality: '' // AI 人设
};

// 会话相关结构体
// 可作为 Conversation 的示例数据结构
export  const Conversation = {
    uuid: '',
    title: '',
    user_id: 0,
    setting_id: 0,
    messages: []
};

// 消息相关结构体
// 可作为 Message 的示例数据结构
export const Message = {
    uuid: '',
    conversation_uuid: '',
    role: 0, // 0-用户, 1-助手
    content: '',
    sequence: 0
};

// AI 设定分页查询参数结构体
// 可作为 AISettingPageQuery 的示例数据结构
export  const AISettingPageQuery = {
    page: 1, // 当前页码，必须且最小值为 1
    pageSize: 1 // 每页数量，必须，最小值为 1，最大值为 20
};

// 会话分页查询参数结构体
// 可作为 ConvPageQuery 的示例数据结构
export const ConvPageQuery = {
    page: 1, // 当前页码，必须且最小值为 1
    pageSize: 1 // 每页数量，必须，最小值为 1，最大值为 20
};

// 可作为 WsMessage 的示例数据结构
export const WsMessage = {
    type: '', // 消息类型 number, ping, stop, text, webrtc-offer
    data: null
};

// 可作为 ConvMsg 的示例数据结构
export const ConvMsg = {
    id: 0, // 主键 ID
    conversation_id: 0, // 会话 ID
    role: 0, // 消息角色:0-用户,1-AI助手
    content: '', // 消息内容
    sequence: 0 // 消息序号
};

// ai的设定
// 可作为 LlmSetting 的示例数据结构
export const LlmSetting = {
    prompt_text: '',
    prompt_uuid: '',
    namespace_uuid: [] // 知识库 UUID 列表
};

// 可作为 User 的示例数据结构
export const User = {
    uuid: '',
    name: '',
    email: '',
    role: '', // 用户角色
    status: '' // 用户状态
};

// 可作为 LoginRequest 的示例数据结构
export const LoginRequest = {
    name: '',
    email: '',
    password: ''
};

// 可作为 RegisterRequest 的示例数据结构
export const RegisterRequest = {
    name: '',
    email: '',
    password: ''
};

// 可作为 LoginResponse 的示例数据结构
export const LoginResponse = {
    token: '',
    user: {...User}
};

// 可作为 RegisterResponse 的示例数据结构
export const RegisterResponse = {
    user: {...User},
    message: ''
};

