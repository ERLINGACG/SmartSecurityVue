import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as echarts from 'echarts'
class VideoService {

    conn_list={
        pro:"https://frp-dad.com:59920/ws",
        location:"http://localhost:8080/ws"
    }
    connect(options) {

        if (this.stompClient) {
            this.stompClient.deactivate().then(r => {

            });
        }
        this.socket =new SockJS(this.conn_list.location);
        this.stompClient = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str)
        });
        this.stompClient.onConnect = (frame) => {

            this.stompClient.subscribe(localStorage.getItem('cat-selectedDevice') + '/image', (message) => {
                // 解析JSON数据并提取image字段
                const data = JSON.parse(message.body);
                options.onMessage(data.image);
            });
        };
        this.stompClient.activate();
    }
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

            this.stompClient.subscribe('/topic/image2/urgent/message', (message) => {
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
            '/topic/image3/urgent/message',
            '/topic/image2/message'
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
                    options.onMessage([...this.messageQueue],topic);
                });
                // 保存订阅引用，用于后续取消
                this.subscriptions.push(subscription);
            });
        };

        this.stompClient.activate();


    }
    fpsChart(dom, data){
        // console.log(data)
        const chart = echarts.init(dom);
        // chart.setOption(data);
        const option = {
            title: {
                text: '实时FPS',
                left: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const date = new Date(params[0].name);
                    return `${date.toLocaleTimeString()}<br/>FPS: ${params[0].value}`;
                }
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [],
                type: 'line',
                smooth: true
            }]
        };
        setInterval(() => {
            const fps = data.value;
            // console.log(fps)
            option.xAxis.data.push(new Date().toLocaleTimeString());
            option.series[0].data.push(fps);
            // 保持最多20个数据点
            if (option.xAxis.data.length > 20) {
                option.xAxis.data.shift();
                option.series[0].data.shift();
            }
            chart.setOption(option,true);
        }, 1000);
        return chart;
    }

}
const videoService = new VideoService();
export default videoService;