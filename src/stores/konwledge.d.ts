export interface KnowledgeFile {
    uuid: string;
    name: string;
    ext?: string;
    fullName?: string;
    chunkCount?: number;
    uploadDate?: string;
    [key: string]: any;
}
export interface KnowledgeItem {
    name: string;
    uuid: string;
    description?: string;
}
export interface KnowledgeState {
    knowledges: KnowledgeItem[];
    showUploadModal: boolean;
    uploadFileList: File[];
    selectedKnowledge: string;
    knowledgeFiles: Record<string, KnowledgeFile[]>;
    showCreateModal: boolean;
    newKnowledgeName: string;
    searchKeyword: string;
    showDeleteFileModal: boolean;
    deleteFileTarget: KnowledgeFile | null;
}
export declare const useKnowledgeStore: import("pinia").StoreDefinition<"knowledge", KnowledgeState, {
    getUploadFileList: (state: {
        knowledges: {
            name: string;
            uuid: string;
            description?: string | undefined;
        }[];
        showUploadModal: boolean;
        uploadFileList: {
            readonly lastModified: number;
            readonly name: string;
            readonly webkitRelativePath: string;
            readonly size: number;
            readonly type: string;
            arrayBuffer: () => Promise<ArrayBuffer>;
            bytes: () => Promise<Uint8Array>;
            slice: (start?: number, end?: number, contentType?: string) => Blob;
            stream: () => ReadableStream<Uint8Array>;
            text: () => Promise<string>;
        }[];
        selectedKnowledge: string;
        knowledgeFiles: Record<string, KnowledgeFile[]>;
        showCreateModal: boolean;
        newKnowledgeName: string;
        searchKeyword: string;
        showDeleteFileModal: boolean;
        deleteFileTarget: {
            [x: string]: any;
            uuid: string;
            name: string;
            ext?: string | undefined;
            fullName?: string | undefined;
            chunkCount?: number | undefined;
            uploadDate?: string | undefined;
        } | null;
    } & import("pinia").PiniaCustomStateProperties<KnowledgeState>) => {
        readonly lastModified: number;
        readonly name: string;
        readonly webkitRelativePath: string;
        readonly size: number;
        readonly type: string;
        arrayBuffer: () => Promise<ArrayBuffer>;
        bytes: () => Promise<Uint8Array>;
        slice: (start?: number, end?: number, contentType?: string) => Blob;
        stream: () => ReadableStream<Uint8Array>;
        text: () => Promise<string>;
    }[];
    getKnowledges: (state: {
        knowledges: {
            name: string;
            uuid: string;
            description?: string | undefined;
        }[];
        showUploadModal: boolean;
        uploadFileList: {
            readonly lastModified: number;
            readonly name: string;
            readonly webkitRelativePath: string;
            readonly size: number;
            readonly type: string;
            arrayBuffer: () => Promise<ArrayBuffer>;
            bytes: () => Promise<Uint8Array>;
            slice: (start?: number, end?: number, contentType?: string) => Blob;
            stream: () => ReadableStream<Uint8Array>;
            text: () => Promise<string>;
        }[];
        selectedKnowledge: string;
        knowledgeFiles: Record<string, KnowledgeFile[]>;
        showCreateModal: boolean;
        newKnowledgeName: string;
        searchKeyword: string;
        showDeleteFileModal: boolean;
        deleteFileTarget: {
            [x: string]: any;
            uuid: string;
            name: string;
            ext?: string | undefined;
            fullName?: string | undefined;
            chunkCount?: number | undefined;
            uploadDate?: string | undefined;
        } | null;
    } & import("pinia").PiniaCustomStateProperties<KnowledgeState>) => {
        name: string;
        uuid: string;
        description?: string | undefined;
    }[];
}, {
    deleteKnowledge(item: KnowledgeItem): Promise<void>;
    setSearchKeyword(val: string): void;
    setShowUploadModal(val: boolean): void;
    setUploadFileList(val: File[]): void;
    setShowCreateModal(val: boolean): void;
    setNewKnowledgeName(val: string): void;
    setSelectedKnowledge(val: string): void;
    setShowDeleteFileModal(val: boolean): void;
    setDeleteFileTarget(val: KnowledgeFile | null): void;
    addFile(file: File): void;
    addKnowledgeFile(uuid: string, file: KnowledgeFile): void;
    removeFile(file: File): void;
    addFilesToKnowledge(): void;
    createKnowledge(desc: string): Promise<void>;
    deleteFileFromKnowledge(): Promise<void>;
    setKnowledgeList(list: KnowledgeItem[]): void;
    removeKnowledgeFile(uuid: string): void;
}>;
