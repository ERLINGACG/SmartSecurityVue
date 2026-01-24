import axios from "axios";
import router from "@/router/Router.js";
import MemberModel from "@/Model/group/memberModel.js";
import request from "@/ViewModel/utils/httpUtils.js";

class MemberService {
    urlList={
        add:'http://localhost:8080/group/member/add',
        get_list:'http://localhost:8080/group/member/get/',
        updateNoFeatures:'http://localhost:8080/group/member/updateNoFeatures',
        update:'http://localhost:8080/group/member/update',
        delete:'http://localhost:8080/group/member/delete/',
    }

    async addMember(addMemberModel, image_file) {
        const url=this.urlList.add
            const form = new FormData();
            form.append('groupMember', new Blob([JSON.stringify(addMemberModel)], {
                type: 'application/json'
            }));
            form.append('file', image_file, image_file.name); // 字段名需与后端@RequestParam一致
            // 移除form.getHeaders()用法
            const headers = {
                'Content-Type': 'multipart/form-data; boundary=' + form._boundary,
            };

            // 完整axios配置
            const response = await request.post(url, form, {

                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 10000,
                withCredentials: true
            });

            console.log(response.data)
            alert(response.data.message)

    }
    async getMembers(gid) {
        const token=`Bearer ${localStorage.getItem('jwt_token')}`
        const url=this.urlList.get_list+gid;
        try{
            const response = await axios.get(url,{
                headers: {
                    'Authorization': token,
                },
            });
            console.log(response.data)
            return response.data.data
        }catch (error) {
            if (error.response.data.code === 401) {
                alert(error.response.data.message);
                await router.push('/user/login')
            }
            if (error.response) {
                alert(error.response.data.message || `获取成员列表失败: ${error.response.data.message}`);
            }

        }
    }
    async updateMemberNoFeatures(memberModel) {

        const token=`Bearer ${localStorage.getItem('jwt_token')}`
        const url=this.urlList.updateNoFeatures;
        try{
            const response = await axios.put(url,{
                mid:memberModel.mid,
                groupId:memberModel.groupId,
                memberName:memberModel.memberName,
                memberEmail:memberModel.memberEmail,
                memberIdentity:memberModel.memberIdentity,
                memberGender:memberModel.memberGender,
                memberDescription:memberModel.memberDescription,
            },{
                headers: {
                    'Authorization': token,
                }
            });
            console.log(response.data)
            alert(response.data.message)
        }catch (error) {
            if (error.response) {
                console.error('更新成员失败:', error.response.data.message);
                if(error.response.data.code === 401){
                    alert(error.response.data.message);
                   await router.push('/user/login')
                }
                alert(error.response.data.message || `更新成员失败: ${error.response.data.message}`);
            }
        }
    }
    async updateMember(memberModel, image_file) {
        if(!MemberModel.updateCheck){
            alert('请确认是否更新已有成员')
            return
        }
        const token=`Bearer ${localStorage.getItem('jwt_token')}`
        const url=this.urlList.update;
        try{
            const form = new FormData();
            form.append('groupMember', new Blob([JSON.stringify(memberModel)], {
                type: 'application/json'
            }));
            form.append('file', image_file, image_file.name); // 字段名需与后端@RequestParam一致
            const headers = {
                'Content-Type': 'multipart/form-data; boundary=' + form._boundary,
                'Authorization': token,
            };

            // 完整axios配置
            const response = await axios.put(url, form, {
                headers: headers,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 10000,
                withCredentials: true
            });

            console.log(response.data)
            alert(response.data.message)
        }catch (error) {
            if (error.response) {
                console.error('更新成员失败:', error.response.data.message);
                if(error.response.data.code === 401){
                    alert(error.response.data.message);
                   await router.push('/user/login')
                }else{
                    alert(error.response.data.message || `更新成员失败: ${error.response.data.message}`);
                }
            }
        }
    }
    async deleteMember(memberModel) {
        const token=`Bearer ${localStorage.getItem('jwt_token')}`
        const url=this.urlList.delete+memberModel.groupId+'/'+memberModel.mid;
        try{
            const response = await axios.delete(url,{
                headers: {
                    'Authorization': token,
                }
            });
            console.log(response.data)
            alert(response.data.message)
            window.location.reload();
        }catch (error) {
            if (error.response.data.code === 401) {
                alert(error.response.data.message);
               await router.push('/user/login')
            }
            if (error.response) {
                console.error('删除成员失败:', error.response.data.message);
                alert(error.response.data.message || `删除成员失败: ${error.response.data.message}`);
            }
        }
    }
}
const memberService = new MemberService();
export default memberService;
