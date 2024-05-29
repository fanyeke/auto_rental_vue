import requestHttp from "@/utils/request";

export default{
    async search(start,size,data){
        return await requestHttp.post(`/rental/user/${start}/${size}`,data);
    },
    async save(data){
        return await requestHttp.post(`/rental/user`,data);
    },
    async update(data){
        return await requestHttp.put(`/rental/user`,data);
    },
    async delete(id){
        return await requestHttp.delete(`/rental/user/${id}`);
    },
    async selectRoleIdByUserId(id){
        return await requestHttp.get(`/rental/user/role/${id}`);
    },
    async bindRole(userId,roleIds){
        return await requestHttp.get(`/rental/user/bind/${userId}/${roleIds}`);
    }
}