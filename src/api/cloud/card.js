import http from "@/api/cloud/http";

const getPersonList = ()=>{
    return http.get("/contact/export")
}
const sendOAMsg = (obj)=>{
    return http.post('/message/push/oa',obj)
}

const sendAddPlan = (obj)=>{
    return http.unPost('/schedule/create',obj)
}


export {
    sendOAMsg,
    getPersonList,
    sendAddPlan
}