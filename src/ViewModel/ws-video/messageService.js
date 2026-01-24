import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
class  MessageService {
    getMessage(options) {
        // 先断开旧连接
        if (this.stompClient) {
            this.stompClient.deactivate().then(r => {

            });
        }

        this.socket =new SockJS('http://localhost:8080/ws');
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            // debug: (str) => console.log(str)
        });
        this.stompClient.onConnect = () => {

            this.stompClient.subscribe('/topic/images/message', (message) => {
                // console.log(message.body)
                const logData = message.body
                const newMessage = `${new Date().toLocaleTimeString()} - ${logData}`;

                // 保持最多200条历史消息
                if (!this.messageQueue) this.messageQueue = [];
                this.messageQueue.push(newMessage);
                if (this.messageQueue.length > 200) {
                    this.messageQueue.shift();
                }
                options.onMessage([...this.messageQueue]);
            });
        };
        this.stompClient.activate();
    }


    getMessageList(options){
        if (this.stompClient) {
            // 取消所有旧订阅
            if (this.subscriptions && this.subscriptions.length) {
                this.subscriptions.forEach(sub => sub.unsubscribe());
                this.subscriptions = []; // 清空订阅列表
            }
            // 断开连接
            this.stompClient.deactivate().then(() => {});
        }

        this.socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str)
        });

        const subscribeTopics = options.topics || [
            '/topic/image2/urgent/message',
            '/topic/image2/warn/message',
            '/topic/image2/info/message'
        ];
        this.stompClient.onConnect = () => {
            this.subscriptions = []; // 初始化订阅引用列表
            subscribeTopics.forEach(topic => {
                // 订阅单个地址，并保存订阅引用
                const subscription = this.stompClient.subscribe(topic, (message) => {
                    // 处理消息（与原逻辑一致，可区分不同topic的消息）
                    const logData = message.body;
                    // 可添加topic标识，方便区分消息来源
                    const newMessage = `${new Date().toLocaleTimeString()} [${topic}] - ${logData}`;

                    // 维护消息队列（最多200条）
                    if (!this.messageQueue) this.messageQueue = [];
                    this.messageQueue.push(newMessage);
                    if (this.messageQueue.length > 200) {
                        this.messageQueue.shift();
                    }
                    // 回调返回最新消息列表
                    options.onMessage([...this.messageQueue]);
                });
                // 保存订阅引用，用于后续取消
                this.subscriptions.push(subscription);
            });
        };

        this.stompClient.activate();


    }
}

const  messageService = new MessageService();
export default messageService;
