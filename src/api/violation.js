import requestHttp from "@/utils/request";

export default {
    async search(start,size,data){
        return await requestHttp.post(`/rental/violation/${start}/${size}`,data);
    },
    async save(data){
        return await requestHttp.post(`/rental/violation`,data);
    },
    async update(data){
        return await requestHttp.put(`/rental/violation`,data);
    },
    async delete(data){
        return await requestHttp.delete(`/rental/violation/${data}`);
    },
};