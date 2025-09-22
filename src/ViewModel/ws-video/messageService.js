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
}

const  messageService = new MessageService();
export default messageService;
