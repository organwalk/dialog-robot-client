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
        userName:String(obj.name),
        deptId:obj.dept,
        title:obj.job
    }
    delete newObj.dept
    delete newObj.job
    return http.post(manBaseUrl + '/add',newObj)
}

const delMan = (obj)=>{
    return http.post(manBaseUrl+'/delete?uid='+String(obj.name.uid)+"&&deptId="+Number(obj.dept))
}

const getUserDetail = (uid,deptid)=>{
    return http.get(manBaseUrl + '/detail?uid='+ String(uid) + '&&deptId='+Number(deptid))
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
    getUserDetail,
    getDeptList,
    updataPersonInfo,
    delMan
}