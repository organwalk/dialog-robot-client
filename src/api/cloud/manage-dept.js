import http from "@/api/cloud/http";

const dept = (type,obj)=>{
    switch (type){
        case 'AddDept':
            addDept(obj)
            break
        case 'DelDept':
            delDept(obj)
            break
    }
}

const manBaseUrl = '/department'
const addDept = (name)=>{
    return http.post(manBaseUrl + '/create',{
        name:name.dept
    })
}
const delDept = (deptId) => {
    return http.post(manBaseUrl + '/delete?deptId=' + Number(deptId))
}
export {
    dept
}