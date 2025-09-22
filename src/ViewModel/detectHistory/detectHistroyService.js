import axios from "axios";

class DetectHistoryService {
     url={
         post:'',
         get:'http://localhost:8080/detect/history/all',
         getBetweenDates:'http://localhost:8080/detect/history/between',
         getImages:'http://localhost:8080/detect/history/image'
     }

     async getHistory(topic){
         const response = await axios.get(this.url.get,{
             params:{ topic }
         });
         console.log(response.data.data);
        return response.data.data;
     }
     async getHistoryBetweenDates(topic,start,end){
        const response = await axios.get(this.url.getBetweenDates,{
            params:{ topic,start,end }
        });
        console.log(response.data.data);
       return response.data.data;
    }
    async getKeyImages(topic,path) {
        const response = await axios.get(this.url.getImages,{
           params:{ topic,path },
            responseType: 'blob' // 重要：指定响应类型为blob
        })
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        return URL.createObjectURL(blob);

    }
    async getSSELog(){
         // const  response = await axios.get('http://localhost:8080/ai/deepseek/ai/chat/historyTest2')

        const eventSource = new EventSource('http://localhost:8080/ai/deepseek/ai/chat/historyTest2');
        eventSource.onmessage = (event) => {
            console.log(event.data);
            if(event.data==='[STREAM_END]'){
                eventSource.close();
                console.log('stream end');
            }
        };
        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
        };
        console.log(eventSource);
     }

}

const detectHistoryService = new DetectHistoryService();
export default detectHistoryService;
