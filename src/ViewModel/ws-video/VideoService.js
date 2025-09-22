import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as echarts from 'echarts'
class VideoService {


    connect(options) {

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
        this.stompClient.onConnect = (frame) => {

            this.stompClient.subscribe('/topic/images/image', (message) => {
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

            this.stompClient.subscribe('/topic/image2/message', (message) => {
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
    fpsChart(dom, data){
        console.log(data)
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
            console.log(fps)
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