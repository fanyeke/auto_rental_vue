import requestHttp from "@/utils/request";

export default {
    async search(start,size,data){
        return await requestHttp.post(`/rental/autoBrand/${start}/${size}`,data);
    },
    async delete(id){
        return await requestHttp.delete(`/rental/autoBrand/${id}`);
    },
    async save(data){
        return await requestHttp.post(`/rental/autoBrand`,data);
    },
    async update(data){
        return await requestHttp.put(`/rental/autoBrand`,data);
    },
    async selectByMakerId(makerId){
        return await requestHttp.get(`/rental/autoBrand/${makerId}`);
    }
};