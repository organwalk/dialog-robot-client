import http from "@/api/cloud/http";

const man = (type,object)=>{
    switch (type){
        case 'AddMan':
            addMan(object)
            break
        case 'DelMan':
            delMan(object)
            break
    }
}

const manBaseUrl = '/user'
const addMan = (obj)=>{
    const newObj = {
        ...obj,
        userName:obj.name,
        deptId:obj.dept,
        title:obj.job
    }
    return http.post(manBaseUrl + '/add',newObj)
}

const delMan = (obj)=>{
    return http.post(manBaseUrl+'/delete?uid='+String(obj.name)+"&&deptId="+Number(obj.dept))
}


const getUserDept = (obj)=>{
    return http.get(manBaseUrl+'/deptList?uid='+obj)

}

export {
    man,
    getUserDept
}