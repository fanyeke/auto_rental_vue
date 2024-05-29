import requestHttp from "@/utils/request";

export default {
    async search(start,size,data) {
        return await requestHttp.post(`/rental/maintain/${start}/${size}`, data);
    },
    async save(data) {
        return await requestHttp.post(`/rental/maintain`, data);
    },
    async update(data) {
        return await requestHttp.put(`/rental/maintain`, data);
    },
    async delete(data) {
        return await requestHttp.delete(`/rental/maintain/${data}`);
    },
}