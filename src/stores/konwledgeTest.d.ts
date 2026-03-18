export declare const useKonwledgeTestStore: import("pinia").StoreDefinition<"konwledgeTest", {
    testKnowledgeUUID: string[];
}, {
    getTestData: (state: {
        testKnowledgeUUID: string[];
    } & import("pinia").PiniaCustomStateProperties<{
        testKnowledgeUUID: string[];
    }>) => string[];
}, {
    setSelectedKnowledgeUuids(data: string): void;
}>;
