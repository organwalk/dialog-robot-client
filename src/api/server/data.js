import http from "@/api/server/http";

//根据uid及时间戳数据获取数据
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

const getScheduleBySid = (sid)=>{
    return http.get('/data/schedule/sid/'+sid)
}

//  更新日程
const updataSchedule = (sid,obj)=>{
    const newOld = {}
    newOld["action"] = "updata"
    newOld["scheduleId"] = obj.scheduleId
    obj["uid"] = Number(sessionStorage.getItem("uid"))
    obj["name"] = sessionStorage.getItem("userName")
    delete obj.warntime
    newOld["data"] = obj
    return http.put('/data/schedule/'+sid,newOld)
}

//  取消日程
const cancelSchedule = (sid)=>{
    return http.put('/data/schedule/cancel/'+sid)
}

//  删除日程
const deleteSchedule = (sid)=>{
    return http.delete('/data/schedule/'+sid)
}

//创建事项
const addNotes = (nid,obj)=>{
    const newOld = {}
    newOld["action"] = "save"
    newOld["noticeId"] = nid
    newOld["uid"] = sessionStorage.getItem("uid")
    newOld["name"] = sessionStorage.getItem("userName")
    newOld["data"] = obj
    delete obj.uid
    return http.post('/data/notification',newOld)
}

//  获取用户相关的指定日期事项列表
const getNotification = (obj)=>{
    return http.post('/data/notification/'+sessionStorage.getItem("uid"),obj)
}

//  更新事项
const updataNotification = (nid,obj)=>{
    const newOld = {}
    newOld["action"] = "updata"
    newOld["data"] = obj
    return http.put('/data/notification/'+nid,newOld)
}

//  根据事项id获取事项数据
const getNotificationByNid = (nid)=>{
    return http.get('/data/notification/nid/'+nid)
}

//  取消事项
const cancelNotificationByNid = (nid)=>{
    return http.put('/data/notification/cancel/'+nid)
}

//  删除事项
const deleteNotificationByNid = (nid)=>{
    return http.delete('/data/notification/'+nid)
}

const getNotificationCount = ()=>{
    return http.get('/data/notification/count/'+sessionStorage.getItem("uid"))
}

//释放redis资源
const release = () => {
    return http.post('/system/redis',{
        action:"release",
        mobile:sessionStorage.getItem("mobile")
    })
}

export {
    getSchedule,
    getScheduleCount,
    saveScheduleCount,
    getScheduleBySid,
    updataSchedule,
    cancelSchedule,
    deleteSchedule,
    addNotes,
    getNotification,
    updataNotification,
    getNotificationByNid,
    cancelNotificationByNid,
    deleteNotificationByNid,
    getNotificationCount,
    release
}