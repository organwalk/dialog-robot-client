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
        userName:String(obj.userName[0]),
        deptId:obj.dept,
        title:obj.job
    }
    delete newObj.dept
    delete newObj.job
    return http.post(manBaseUrl + '/add',newObj)
}

const delMan = (obj)=>{
    return http.post(manBaseUrl+'/delete?uid='+String(obj.name)+"&&deptId="+Number(obj.dept))
}


const getUserDept = (obj)=>{
    return http.get(manBaseUrl+'/deptList?uid='+obj)
}

const getPersonDept = (obj)=>{
    return http.get('/department/userList?deptId='+obj)
}

const getDeptList = ()=>{
    let num = 0
    return http.get('/department/deptList?deptId='+ num )
}

const updataPersonInfo = (obj)=>{
    return http.post('/user/update',obj)
}
export {
    man,
    getUserDept,
    getPersonDept,
    getDeptList,
    updataPersonInfo,
    delMan
}