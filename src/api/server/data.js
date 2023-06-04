import http from "@/api/server/http";

const getSchedule = (obj)=>{
    return http.post('/data/schedule/'+sessionStorage.getItem("uid"),obj)
}
const getScheduleCount = ()=>{
    return http.get('/data/schedule/count/'+sessionStorage.getItem("uid"))
}
const saveScheduleCount = (sid,obj)=>{
    const newOld = {}
    newOld["action"] = "save"
    newOld["scheduleId"] = sid
    obj["uid"] = sessionStorage.getItem("uid")
    obj["name"] = sessionStorage.getItem("userName")
    delete obj.warntime
    newOld["data"] = obj

    return http.post('/data/schedule',newOld)
}
export {
    getSchedule,
    getScheduleCount,
    saveScheduleCount
}