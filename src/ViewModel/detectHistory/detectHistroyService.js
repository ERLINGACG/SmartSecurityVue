import request from "../utils/httpUtils.js";
class DetectHistoryService {
     url={
         post:'',
         get:'http://localhost:8080/detect/history/all',
         getBetweenDates:'http://localhost:8080/detect/history/between',
         getImages:'http://localhost:8080/detect/history/image'
     }

     async getHistory(topic){
         const response = await request.get(this.url.get,{
                params:{ topic }
            }
         );
         console.log(response.data.data);
        return response.data.data;
     }
     async getHistoryBetweenDates(topic,start,end){
        const response = await request.get(this.url.getBetweenDates,{
                params:{ topic,start,end }
            }
        );
        console.log(response.data.data);
       return response.data.data;
    }
    async getKeyImages(topic,path) {
        const response = await request.get(this.url.getImages,{
                params:{ topic,path },
                responseType: 'blob' // 重要：指定响应类型为blob
            }
        )
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        return URL.createObjectURL(blob);

    }

}

const detectHistoryService = new DetectHistoryService();
export default detectHistoryService;
