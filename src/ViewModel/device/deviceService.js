import request from "@/ViewModel/utils/httpUtils.js";

class DeviceService{
    urlList={
       add:'http://localhost:8080/device/api/add',
       update:'http://localhost:8080/device/api/update',
       select:'http://localhost:8080/device/api/select',
       get:'http://localhost:8080/device/api/getDevice',
       delete:'http://localhost:8080/device/api/delete'

    }

    async PostAddDevices(DeviceModel){
        const url=this.urlList.add
        const response = await request.post(url,{
                   pid:DeviceModel.pid,
                   deviceName:DeviceModel.deviceName,
                   deviceTopic:DeviceModel.deviceTopic,
                   deviceType:DeviceModel.deviceType,
                   deviceDescribe:DeviceModel.deviceDescribe,
                   userEmail:DeviceModel.userEmail,
              }
        )
        alert(response.data.message);


    }
    async DeleteDevice(isdelete,pid,email){
        if(!isdelete){
            alert("请确认删除");
            return;
        }
        const url=this.urlList.delete
        const response = await request.delete(url, {
                params: { pid, email }
            }
        );
        alert(response.data.message);

    }
    async GetDeviceList(email){

        console.log(email);
        const url=this.urlList.select

        const response = await request.get(url, {
                params:{ email },
            }
        )
        console.log(response.data.data);
        return response.data.data;


    }
    async GetDeviceInfo(pid,email){
            const url=this.urlList.get
            const response = await request.get(url, {
                    params:{ pid,email }
                }
            )
            console.log(response.data.data);
            return response.data.data;
    }

    async UpdateDevice(DeviceModel) {
        try {
            const url = this.urlList.update;
            const response = await request.put(url, {
                pid: DeviceModel.pid,
                deviceName: DeviceModel.deviceName,
                deviceTopic: DeviceModel.deviceTopic,
                deviceType: DeviceModel.deviceType,
                deviceDescribe: DeviceModel.deviceDescribe,
                userEmail: DeviceModel.userEmail,
            });
            alert(response.data.message);
        } catch (error) {
            console.error('更新设备失败:', error);
            // 关键：重新抛出错误，让全局错误处理器捕获
            throw error;
        }

    }
}
const deviceService = new DeviceService();
export default deviceService;