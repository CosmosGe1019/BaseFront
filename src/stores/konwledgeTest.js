import { defineStore } from 'pinia';
export const useKonwledgeTestStore = defineStore('konwledgeTest', {
    state: () => ({
        testKnowledgeUUID: [],
    }),
    actions: {
        setSelectedKnowledgeUuids(data) {
            this.testKnowledgeUUID.push(data);
        },
    },
    getters: {
        getTestData: (state) => state.testKnowledgeUUID,
    },
});
