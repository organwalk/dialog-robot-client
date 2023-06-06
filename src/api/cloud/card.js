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

const updataPlan = (sid,obj)=>{
    return http.unPost('/schedule/update?scheduleId='+sid,obj)
}

const cancelPlan = (sid)=>{
    return http.uPost('/schedule/cancel?scheduleId='+sid)
}

const deletePlan = (sid)=>{
    return http.uPost('/schedule/delete?scheduleId='+sid)
}

const addNotes = (obj)=>{
    return http.unPost('/notification/create',obj)
}

const updataNotes = (nid,obj)=>{
    return http.unPost('/notification/update?noticeId='+nid,obj)
}

const cancelNotes = (nid)=>{
    return http.unPost('/notification/cancel?noticeId='+ nid)
}

const deleteNotes = (nid)=>{
    return http.uPost('/notification/delete?noticeId='+ nid)
}


export {
    sendOAMsg,
    getPersonList,
    sendAddPlan,
    updataPlan,
    cancelPlan,
    deletePlan,
    addNotes,
    updataNotes,
    cancelNotes,
    deleteNotes
}