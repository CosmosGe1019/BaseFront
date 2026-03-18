declare class WebsocketClient {
    private static instance;
    private ws;
    interval: any;
    ping(): void;
    Init(): void;
    static getInstance(): WebsocketClient;
    getWsConnection(): WebSocket;
    send(data: any): void;
    close(): void;
}
export default WebsocketClient;
