import { defineStore } from 'pinia';
export const useConversationStore = defineStore('conversation', {
    state: () => ({
        conversations: [],
        currentConversationuuId: null,
        confirmShowConversation: true,
    }),
    getters: {
        getConfirmConversation(state) {
            return state.confirmShowConversation;
        },
        currentConversation(state) {
            return state.conversations.find((c) => c.uuid === state.currentConversationuuId) || null;
        },
        messages(state) {
            const conv = state.conversations.find((c) => c.uuid === state.currentConversationuuId);
            return conv?.messages || [];
        },
    },
    actions: {
        setConfirmCreateConversation(v) {
            this.confirmShowConversation = v;
        },
        setConversations(list) {
            this.conversations = [...list];
        },
        setCurrentConversationuuId(uuid) {
            this.currentConversationuuId = uuid;
        },
        addMessage(msg) {
            const conv = this.currentConversation;
            if (conv) {
                conv.messages.push(msg);
                // 如果是第一条消息且没有标题，则用消息内容作为标题（截断处理）
                if (!conv.title && conv.messages.length === 1) {
                    const maxLen = 20;
                    conv.title =
                        msg.content.length > maxLen ? msg.content.slice(0, maxLen) + '...' : msg.content;
                }
            }
        },
        addConversation(conv) {
            this.conversations.unshift(conv);
        },
        removeConversation(uuid) {
            this.conversations = this.conversations.filter((c) => c.uuid !== uuid);
            if (this.currentConversationuuId === uuid)
                this.currentConversationuuId = null;
        },
        pinToTop(uuid) {
            const idx = this.conversations.findIndex((c) => c.uuid === uuid);
            if (idx > 0) {
                const conv = this.conversations.splice(idx, 1)[0];
                this.conversations.unshift(conv);
            }
        },
    },
});
