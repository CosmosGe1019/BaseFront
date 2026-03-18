import { defineStore } from 'pinia';

export const useAssistantStore = defineStore('assistant', {
    state: () => ({
        assistants: [
            {
                uuid: 'default-uuid',
                name: '默认机器人',
                desc: '这是一个可以用于简单测试对话的语音机器人',
                personality: '',
                knowledge: [],
                history: [],
            },
        ],
        selectedId: '',
        editingAssistant: null,
        newAssistant: {
            uuid: '',
            name: '',
            personality: '',
            desc: '',
            knowledge: [],
            history: [],
        },
        Conversations: [],
        currentConversationId: null,
        showEditKnowledge: false,
        showAddModal: false,
        showEditModal: false,
        editAssistantData: null,
        showDeleteModal: false,
        toDeleteId: '',
        // 聊天面板相关
        chatStatus: {
            recording: false,
            isMuted: false,
            messages: [],
        },
    }),
    getters: {
        currentAssistant(state) {
            return state.assistants.find((a) => a.uuid === state.selectedId);
        },
    },
    actions: {
        setAssistants(list) {
            this.assistants = list;
        },
        setSelectedId(uuid) {
            this.selectedId = uuid;
        },
        setEditingAssistant(assistant) {
            this.editingAssistant = assistant;
        },
        setShowEditKnowledge(val) {
            this.showEditKnowledge = val;
        },
        setShowAddModal(val) {
            this.showAddModal = val;
        },
        setShowEditModal(val) {
            this.showEditModal = val;
        },
        setEditAssistantData(data) {
            this.editAssistantData = data;
        },
        setShowDeleteModal(val) {
            this.showDeleteModal = val;
        },
        setToDeleteId(uuid) {
            this.toDeleteId = uuid;
        },
        // 聊天面板相关
        setChatStatus(status) {
            this.chatStatus = { ...this.chatStatus, ...status };
        },
    },
});