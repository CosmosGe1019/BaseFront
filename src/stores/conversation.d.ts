export interface Message {
    uuid: string;
    conversation_uuid: string;
    role: number;
    content: string;
    sequence: number;
}
export interface Conversation {
    uuid: string;
    title: string;
    user_id: number;
    setting_id: number;
    messages: Message[];
}
export declare const useConversationStore: import("pinia").StoreDefinition<"conversation", {
    conversations: Conversation[];
    currentConversationuuId: string | null;
    confirmShowConversation: boolean;
}, {
    getConfirmConversation(state: {
        conversations: {
            uuid: string;
            title: string;
            user_id: number;
            setting_id: number;
            messages: {
                uuid: string;
                conversation_uuid: string;
                role: number;
                content: string;
                sequence: number;
            }[];
        }[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        conversations: Conversation[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    }>): boolean;
    currentConversation(state: {
        conversations: {
            uuid: string;
            title: string;
            user_id: number;
            setting_id: number;
            messages: {
                uuid: string;
                conversation_uuid: string;
                role: number;
                content: string;
                sequence: number;
            }[];
        }[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        conversations: Conversation[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    }>): Conversation | null;
    messages(state: {
        conversations: {
            uuid: string;
            title: string;
            user_id: number;
            setting_id: number;
            messages: {
                uuid: string;
                conversation_uuid: string;
                role: number;
                content: string;
                sequence: number;
            }[];
        }[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        conversations: Conversation[];
        currentConversationuuId: string | null;
        confirmShowConversation: boolean;
    }>): Message[];
}, {
    setConfirmCreateConversation(v: boolean): void;
    setConversations(list: Conversation[]): void;
    setCurrentConversationuuId(uuid: string): void;
    addMessage(msg: Message): void;
    addConversation(conv: Conversation): void;
    removeConversation(uuid: string): void;
    pinToTop(uuid: string): void;
}>;
