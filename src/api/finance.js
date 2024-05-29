import requestHttp from "@/utils/request";

export default {
    async countDayRental() {
        return requestHttp.get("/rental/finance/countDayRental");
    },
    async countDayReturn() {
        return requestHttp.get("/rental/finance/countDayReturn");
    },
    async countDayCost(){
        return requestHttp.get("/rental/finance/countDayCost");
    },
    async countMonthRental() {
        return requestHttp.get("/rental/finance/countMonthRental");
    },
    async countMonthReturn() {
        return requestHttp.get("/rental/finance/countMonthReturn");
    },
    async countMonthCost(){
        return requestHttp.get("/rental/finance/countMonthCost");
    }
};