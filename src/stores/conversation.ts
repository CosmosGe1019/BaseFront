import { defineStore } from 'pinia'

export interface Message {
  uuid: string
  conversation_uuid: string
  role: number // 0-用户, 1-助手
  content: string
  sequence: number
}

export interface Conversation {
  uuid: string
  title: string
  user_id: number
  setting_id: number
  messages: Message[]
}

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [] as Conversation[],
    currentConversationuuId: null as string | null,
    confirmShowConversation: true,
  }),
  getters: {
    getConfirmConversation(state): boolean {
      return state.confirmShowConversation
    },
    currentConversation(state): Conversation | null {
      return state.conversations.find((c) => c.uuid === state.currentConversationuuId) || null
    },
    messages(state): Message[] {
      const conv = state.conversations.find((c) => c.uuid === state.currentConversationuuId)
      return conv?.messages || []
    },
  },
  actions: {
    setConfirmCreateConversation(v: boolean) {
      this.confirmShowConversation = v
    },

    setConversations(list: Conversation[]) {
      this.conversations = [...list]
    },
    setCurrentConversationuuId(uuid: string) {
      this.currentConversationuuId = uuid
    },
    addMessage(msg: Message) {
      const conv = this.currentConversation
      if (conv) {
        conv.messages.push(msg)
        // 如果是第一条消息且没有标题，则用消息内容作为标题（截断处理）
        if (!conv.title && conv.messages.length === 1) {
          const maxLen = 20
          conv.title =
            msg.content.length > maxLen ? msg.content.slice(0, maxLen) + '...' : msg.content
        }
      }
    },
    addConversation(conv: Conversation) {
      this.conversations.unshift(conv)
    },
    removeConversation(uuid: string) {
      this.conversations = this.conversations.filter((c) => c.uuid !== uuid)
      if (this.currentConversationuuId === uuid) this.currentConversationuuId = null
    },
    pinToTop(uuid: string) {
      const idx = this.conversations.findIndex((c) => c.uuid === uuid)
      if (idx > 0) {
        const conv = this.conversations.splice(idx, 1)[0]
        this.conversations.unshift(conv)
      }
    },
  },
})
