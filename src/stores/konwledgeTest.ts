import { defineStore } from 'pinia'

export const useKonwledgeTestStore = defineStore('konwledgeTest', {
  state: () => ({
    testKnowledgeUUID: [] as string[],
    isWebSearch: false, // 新增
  }),
  actions: {
    setSelectedKnowledgeUuids(data: string[]) {
      this.testKnowledgeUUID = data
    },
    setWebSearch(val: boolean) {
      this.isWebSearch = val
      if (val) {
        this.testKnowledgeUUID = [] // 联网搜索时清空知识库选择
      }
    },
  },
  getters: {
    getTestData: (state) => state.testKnowledgeUUID,
    isWebSearch: (state) => state.isWebSearch,
  },
})
