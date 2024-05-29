import requestHttp from "@/utils/request"
export default{
    async search(start,size,data){
        return await requestHttp.post(`/rental/autoMaker/${start}/${size}`,data)
    },
    async delete(id){
        return await requestHttp.delete(`/rental/autoMaker/${id}`)
    },
    async save(data){
        return await requestHttp.post(`/rental/autoMaker`,data)
    },
    async update(data){
        return await requestHttp.put(`/rental/autoMaker`,data)
    },
    async selectAll(){
        return await requestHttp.get(`/rental/autoMaker`)
    }


}