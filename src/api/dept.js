import requestHttp from "@/utils/request";

export default{
    async search(params){
        return await requestHttp.post("/rental/dept",params)
    },
    async selectTree(){
        return await requestHttp.get("/rental/dept")
    },
    async save(params){
        return await requestHttp.post("/rental/dept/save",params)
    },
    async update(params){
        return await requestHttp.put("/rental/dept",params)
    },
    async delete(id){
        return await requestHttp.delete(`/rental/dept/${id}`)
    },
    async hasChildren(id){
        return await requestHttp.get(`/rental/dept/${id}`)
    }
}