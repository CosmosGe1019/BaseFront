export interface user {
    uuid: string;
    name: string;
    email: string;
}
export declare const useUserStore: import("pinia").StoreDefinition<"user", {
    user: user;
    users: user[];
    isLogin: boolean;
}, {
    getUser(state: {
        user: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        };
        users: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        }[];
        isLogin: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        user: user;
        users: user[];
        isLogin: boolean;
    }>): {
        uuid: string;
        name: string;
        email: string;
        Assistants?: any;
    };
    getUsers(state: {
        user: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        };
        users: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        }[];
        isLogin: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        user: user;
        users: user[];
        isLogin: boolean;
    }>): {
        uuid: string;
        name: string;
        email: string;
        Assistants?: any;
    }[];
    getIsLogin(state: {
        user: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        };
        users: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        }[];
        isLogin: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        user: user;
        users: user[];
        isLogin: boolean;
    }>): boolean;
    getAssistants(state: {
        user: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        };
        users: {
            uuid: string;
            name: string;
            email: string;
            Assistants?: any;
        }[];
        isLogin: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        user: user;
        users: user[];
        isLogin: boolean;
    }>): Assistant[];
}, {
    setUser(user: user): void;
    setUsers(users: user[]): void;
    setIsLogin(isLogin: boolean): void;
    logout(): void;
    setAssistants(assistants: Assistant[]): void;
}>;
