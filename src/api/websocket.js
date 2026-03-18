import { WsMessage } from '@/types/request';
class WebsocketClient {
    static instance;
    ws;
    interval;
    ping() {
        const pingMsg = {
            type: 'ping',
            data: null,
        };
        this.ws.send(JSON.stringify(pingMsg));
    }
    // 初始化连接
    Init() {
        this.ws = new WebSocket('ws://localhost:8888/api/socket.io');
        this.ws.onopen = () => {
            console.log('连接成功');
            // 连接成功后，发送 ping 消息
            this.interval = setInterval(() => {
                this.ping();
            }, 20000);
        };
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log('收到消息', msg);
            switch (msg.type) {
                case 'pong':
                    console.log('websocket 连接正常------------');
                    break;
                case 'stop':
                    clearInterval(this.interval);
                    this.ws.close();
                    break;
                default:
                    break;
            }
        };
        this.ws.onclose = () => {
            console.log('连接关闭');
            clearInterval(this.interval);
            this.ws.close();
            WebsocketClient.instance = null;
        };
        this.ws.onerror = (error) => {
            console.log('连接错误', error);
            clearInterval(this.interval);
            this.ws.close();
        };
    }
    //发起对话，打电话的
    static getInstance() {
        if (!WebsocketClient.instance) {
            WebsocketClient.instance = new WebsocketClient();
            WebsocketClient.instance.Init();
        }
        return WebsocketClient.instance;
    }
    getWsConnection() {
        return WebsocketClient.instance.ws;
    }
    //发消息
    // ...existing code...
 send(data) {
  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify(data))
  } else {
    console.warn('WebSocket 未连接，无法发送消息')
  }
}

 close() {
  if (WebsocketClient.instance) {
    // 只有 OPEN 状态下才发送 stop
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        type: 'stop',
        data: null,
      })
      this.ws.close()
    } else if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.CLOSING)) {
      // 直接关闭
      this.ws.close()
    }
    WebsocketClient.instance = null
  }
}
// ...existing code...
}
export default WebsocketClient;
