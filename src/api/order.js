import requestHttp from "@/utils/request";


export default {
    async save(data){
        return await requestHttp.post("/rental/order",data)
    },
    async searchUnfinished(start,size,data){
        return await requestHttp.post(`/rental/order/unfinished/${start}/${size}`,data)
    },
    async update(data){
        return await requestHttp.put(`/rental/order`,data);
    },
    async search(start,size,data){
        return await requestHttp.post(`/rental/order/${start}/${size}`,data)
    },
    async countViolation(auto_id){
        return await requestHttp.get(`/rental/order/countViolation/${auto_id}`)
    },
    async doReturnDeposit(orderId){
        return await requestHttp.get(`/rental/order/doReturnDeposit/${orderId}`)
    }
}