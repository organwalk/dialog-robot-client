import http from "@/api/cloud/http";

const manBaseUrl = '/department'
const addDept = (name)=>{
    return http.post(manBaseUrl + '/create',{
        name:name.dept
    })
}
const delDept = (deptId) => {
    return http.post(manBaseUrl + '/delete?deptId=' + Number(deptId))
}
const updateDept = (obj) => {
    return http.uPost(manBaseUrl + '/update',obj)
}
export {
    addDept,
    delDept,
    updateDept
}