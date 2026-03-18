import { defineStore } from 'pinia'

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    assistants: [
      {
        uuid: 'default-uuid',
        name: '默认智能体',
        desc: '这是一个用于基础问答和测试的默认智能体。',
        personality: '你是一个温和、耐心且专业的智能知识助手，会结合已接入的知识库为用户提供准确、清晰的回答。',
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
      return state.assistants.find((a) => a.uuid === state.selectedId)
    },
  },
  actions: {
    setAssistants(list) {
      this.assistants = list
    },
    setSelectedId(uuid) {
      this.selectedId = uuid
    },
    setEditingAssistant(assistant) {
      this.editingAssistant = assistant
    },
    setShowEditKnowledge(val) {
      this.showEditKnowledge = val
    },
    setShowAddModal(val) {
      this.showAddModal = val
    },
    setShowEditModal(val) {
      this.showEditModal = val
    },
    setEditAssistantData(data) {
      this.editAssistantData = data
    },
    setShowDeleteModal(val) {
      this.showDeleteModal = val
    },
    setToDeleteId(uuid) {
      this.toDeleteId = uuid
    },
    // 聊天面板相关
    setChatStatus(status) {
      this.chatStatus = { ...this.chatStatus, ...status }
    },
  },
})
