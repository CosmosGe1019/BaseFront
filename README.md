## 智能知识库平台前端（Vue 3）

本项目是智能知识库平台的前端部分，基于 **Vue 3 + Vite + Pinia + Ant Design Vue + TailwindCSS** 构建，提供：

- 智能体对话：基于 WebSocket 的流式对话界面，可选择智能体人设与关联知识库。
- 智能体人设管理：配置智能体名称、性格、人设简介，以及绑定知识库。
- 知识库管理：管理知识库、上传文档并切片入库。
- 用户管理：查看账号信息、修改密码，并切换多套界面主题。

---

## 一、页面功能说明

### 1. 智能体对话（`/AI/chat`）

- 中间：`ChatPanel`
  - 与当前选中的智能体进行文字对话。
  - 顶部可以多选知识库（下拉框），对话时会带上选中的知识库 UUID。
  - 消息流通过 WebSocket 与后端交互，支持多轮对话和历史记录加载。
- 左侧：`ChatAside`
  - 展示会话列表：标题 + 最近一条消息预览。
  - 可新建会话、切换会话、删除当前会话。
- 右侧：`AssistantList + EditKnowledgeModal`
  - 列出所有智能体（含一个默认智能体）。
  - 支持新建、编辑、删除智能体。
  - 通过弹窗为智能体绑定一个或多个知识库。

### 2. 智能体人设管理（`/AI/test`）

- 使用 `AiTestView` 承载智能体人设管理。
- 内部直接复用 `AssistantList`，专注在人设本身：
  - 智能体名称、性格、人设简介。
  - 已绑定的知识库信息。
- 适合运营或管理员集中配置智能体，而无需进入对话页。

### 3. 知识库管理（`/AI/knowledge`）

- 使用 `KnowledgeHome` 组件。
- 左侧：知识库列表
  - 支持新建知识库（名称 + 简短简介）。
  - 支持编辑知识库简介、删除知识库。
- 右侧：知识库文件列表
  - 展示当前选中知识库下的所有文件（名称、分块数、上传时间）。
  - 支持上传文件（txt/json/csv/xml/md），实时显示上传进度。
  - 支持删除文件。

### 4. 用户管理与主题切换（`/AI/account`）

- 使用 `Account` 组件。
- 账号信息
  - 显示当前登录用户的用户名、邮箱、用户 UUID。
  - 提供“修改密码”按钮，跳转到 `/AI/change-password`。
- 主题切换
  - 复用原 `SystemSetting` 中的多主题方案（default / pink / brown / gradient-blue-pink / new-theme / cyber-dark 等）。
  - 点击某一主题后：
    - 将 `data-theme` 写入 `document.body`。
    - 在 `localStorage` 中持久化 `theme` 字段。

---

## 二、主要接口与前后端交互说明

### 1. 鉴权与用户接口

前端通过 `FetchUtil`/`http` 封装调用后端 `/api/auth` 相关接口：

- `POST /api/auth/login`：登录，返回 token 与用户信息。
- `GET /api/auth/profile`：获取当前登录用户信息（用于 `Account` 页面）。
- `PUT /api/auth/change-password`：修改密码。
- `GET /api/auth/verify`：路由守卫中验证登录状态。
- `POST /api/auth/logout`：退出登录。

路由守卫在 `router/index.ts` 中通过 `FetchUtil.verifyToken()` 实现登录验证。

### 2. WebSocket 对话接口

- 连接地址：`ws://localhost:8888/api/socket.io`
- 封装类：`front/src/api/websocket.ts` 中的 `WebsocketClient`
- 使用方式：
  1. 调用 `WebsocketClient.getInstance()` 建立连接。
  2. 连接成功后，发送设定消息：
     - `type: 'setting'`
     - `data`: `JSON.stringify({ prompt_text, prompt_uuid, namespace_uuid: string[] })`
       - `prompt_uuid`：当前智能体 UUID。
       - `namespace_uuid`：选中的知识库 UUID 列表。
  3. 发送用户问题：
     - `type: 'text'`
     - `data`: 纯文本问题。
  4. 后端以流式消息返回：
     - `type: 'llmConv'`：包含 `role`（0 用户 / 1 AI）、`content` 及 `play_id`。
     - 前端将 `role == 1` 的内容不断拼接显示为 AI 回复。

### 3. 会话与消息接口

路由前缀：`/api/conversation`

- `GET /list`：分页获取历史会话列表，用于 `ChatAside`。
- `GET /messages/:uuid`：根据会话 UUID 获取该会话的历史消息，用于 `ChatPanel` 初始化。
- `DELETE /delete/:uuid`：删除某个会话。

前端通过 `conversationStore` 统一管理当前会话 ID 和本地缓存的消息列表。

### 4. 智能体（人设）接口

路由前缀：`/api/ai-settings`

- `POST /add`：创建智能体人设（名称、性格、人设简介、关联知识库等）。
- `GET /list`：获取智能体人设列表，用于 `AssistantList` 初始化。
- `PUT /update`：更新智能体信息。
- `DELETE /delete/:uuid`：删除指定智能体。

前端通过 `assistantStore` 维护智能体列表、当前选中智能体以及编辑状态。

### 5. 知识库与文件接口

路由前缀：`/api/pinecone`

- `GET /namespace/list`：获取知识库列表，用于 `KnowledgeHome` 和 `ChatPanel` 中的知识库下拉。
- `POST /namespace/create`：新建知识库。
- `PUT /namespace/update`：更新知识库信息。
- `DELETE /namespace/delete/:uuid`：删除知识库。
- `POST /file/upload`：上传文件到指定知识库，并进行向量化/切片。
- `POST /file/list`：列出某知识库下的文件列表。
- `DELETE /file/delete`：删除某个文件。

前端通过 `knowledgeStore` 管理知识库列表、文件列表以及上传状态。

---

## 三、启动与构建方式

### 1. 安装依赖

```bash
cd front
npm install
```

### 2. 本地开发（热更新）

```bash
npm run dev
```

默认会在 `http://localhost:5173`（或控制台提示端口）启动前端开发服务。  
确保后端服务（Go + SQLite）已经在 `http://localhost:8888` 启动，以便前端能够正常访问 `/api/*` 与 WebSocket。

### 3. 生产构建

```bash
npm run build
```

生成的静态文件位于 `front/dist`，会被后端以静态资源方式提供（`/assets` 与 `index.html`）。

### 4. 其他脚本（如有）

- 可根据实际需要继续使用 `npm run test:unit` 等命令进行单元测试。
