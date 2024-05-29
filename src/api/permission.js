import requestHttp from "@/utils/request";

export default {
    async search() { 
        return await requestHttp.get("/rental/permission");
    },
    async tree() { 
        return await requestHttp.get("/rental/permission/tree");
    },
    async save(data) { 
        return await requestHttp.post("/rental/permission", data);
    },
    async update(data) {
        return await requestHttp.put("/rental/permission", data);
     },
    async delete(id) {
        return await requestHttp.delete(`/rental/permission/${id}`);
     },
    async hasChildren(id) { 
        return await requestHttp.get(`/rental/permission/hasChildren/${id}`);
    },
};