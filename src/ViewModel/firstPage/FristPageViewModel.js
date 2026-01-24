import axios from "axios";
import * as echarts from 'echarts'
import request from "@/ViewModel/utils/httpUtils.js";
class FirstPageViewModel {

    resList = {
        getResList: "http://localhost:8080/redis/pdata/",
        select:'http://localhost:8080/device/api/select',
    }
    getUsuallyResList(){
        const tableData = localStorage.getItem("routeHistory");
        if(tableData){
            const data = JSON.parse(tableData);
            console.log(data);
        }
        return JSON.parse(tableData);
    }
    async getDeviceList() {
        const url = this.resList.select
        const response = await request.get(url, {
                params: {email: localStorage.getItem('nowUser')}
            }
        );
        console.log(response.data);
        return response.data.data;
    }

    async getResList(topic,dom) {
        const res = await axios.get(this.resList.getResList,{
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt_token')}`},
            params: {
                topic: topic
            }
        });
        console.log("DATA:",res.data.data);
        const data = JSON.parse(res.data.data);
        // 转换为ECharts所需的格式 [{name: '名称', value: 数值}, ...]
        const chartData = Object.entries(data).map(([key, value]) => ({
            name: key,
            value: value
        }));
// 初始化图表
        if (chartData.length === 0) {
            return;
        }
        const chartDom = document.getElementById(dom);
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text:'检测计数',
                left : 'left',
                textStyle: {  // 新增文本样式配置
                    color: '#fff' // 修改为红色，可替换其他颜色值
                },
                x: '30%',
                y: 'top'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} 次 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'top',
                data: chartData.map(item => item.name)  // 图例数据
            },

            series: [{
                name: '检测次数计数',
                type: 'pie',
                radius: '55%',  // 饼图半径
                data: chartData,  // 绑定转换后的数据
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        }


        // 设置配置项并渲染图表
        myChart.setOption(option);


        // console.log("resList", res.data.data);
    }
}
const firstPageViewModel = new FirstPageViewModel();
export default firstPageViewModel;