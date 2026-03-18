export declare const useAssistantStore: import("pinia").StoreDefinition<"assistant", {
    assistants: {
        uuid: string;
        name: string;
        desc: string;
        personality: string;
        knowledge: never[];
        history: never[];
    }[];
    selectedId: string;
    editingAssistant: null;
    newAssistant: {
        uuid: string;
        name: string;
        personality: string;
        desc: string;
        knowledge: never[];
        history: never[];
    };
    Conversations: never[];
    currentConversationId: null;
    showEditKnowledge: boolean;
    showAddModal: boolean;
    showEditModal: boolean;
    editAssistantData: null;
    showDeleteModal: boolean;
    toDeleteId: string;
    chatStatus: {
        recording: boolean;
        isMuted: boolean;
        messages: never[];
    };
}, {
    currentAssistant(state: {
        assistants: {
            uuid: string;
            name: string;
            desc: string;
            personality: string;
            knowledge: never[];
            history: never[];
        }[];
        selectedId: string;
        editingAssistant: null;
        newAssistant: {
            uuid: string;
            name: string;
            personality: string;
            desc: string;
            knowledge: never[];
            history: never[];
        };
        Conversations: never[];
        currentConversationId: null;
        showEditKnowledge: boolean;
        showAddModal: boolean;
        showEditModal: boolean;
        editAssistantData: null;
        showDeleteModal: boolean;
        toDeleteId: string;
        chatStatus: {
            recording: boolean;
            isMuted: boolean;
            messages: never[];
        };
    } & import("pinia").PiniaCustomStateProperties<{
        assistants: {
            uuid: string;
            name: string;
            desc: string;
            personality: string;
            knowledge: never[];
            history: never[];
        }[];
        selectedId: string;
        editingAssistant: null;
        newAssistant: {
            uuid: string;
            name: string;
            personality: string;
            desc: string;
            knowledge: never[];
            history: never[];
        };
        Conversations: never[];
        currentConversationId: null;
        showEditKnowledge: boolean;
        showAddModal: boolean;
        showEditModal: boolean;
        editAssistantData: null;
        showDeleteModal: boolean;
        toDeleteId: string;
        chatStatus: {
            recording: boolean;
            isMuted: boolean;
            messages: never[];
        };
    }>): {
        uuid: string;
        name: string;
        desc: string;
        personality: string;
        knowledge: never[];
        history: never[];
    } | undefined;
}, {
    setAssistants(list: any): void;
    setSelectedId(uuid: any): void;
    setEditingAssistant(assistant: any): void;
    setShowEditKnowledge(val: any): void;
    setShowAddModal(val: any): void;
    setShowEditModal(val: any): void;
    setEditAssistantData(data: any): void;
    setShowDeleteModal(val: any): void;
    setToDeleteId(uuid: any): void;
    setChatStatus(status: any): void;
}>;
