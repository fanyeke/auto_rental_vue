import requestHttp from "@/utils/request";

export default{
    async search(start,size,data){
        return await requestHttp.post(`/rental/autoInfo/${start}/${size}`,data)
    },
    async save(data){
        return await requestHttp.post(`/rental/autoInfo`,data)
    },
    async update(data){
        return await requestHttp.put(`/rental/autoInfo`,data)
    },
    async delete(data){
        return await requestHttp.delete(`/rental/autoInfo/${data}`)
    },
    async exist(data){
        return await requestHttp.post(`/rental/autoInfo/exist`,data)
    },
    //获取所有待保养车辆
    async toBeMaintain(){
        return await requestHttp.get(`/rental/autoInfo/toBeMaintain`)
    }
}