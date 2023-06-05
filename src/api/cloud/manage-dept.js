import http from "@/api/cloud/http";

const dept = (type,obj)=>{
    switch (type){
        case 'AddDept':
            addDept(obj)
            break

    }
}

const manBaseUrl = '/department'
const addDept = (name)=>{
    return http.post(manBaseUrl + '/create',{
        name:name.dept
    })
}

export {
    dept
}