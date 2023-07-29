import http from '@/api/server/http'

//存储当前登录用户的信息
const saveUserInfo = (userInfo) => {
    return http.post('/data/user',{
        action:'get',
        mobile:userInfo.mobile,
        uid:userInfo.uid,
        name:userInfo.name,
        deptName:userInfo.deptName
    })
}

//存储部门列表
const saveDeptList = (dept) =>{
    return http.post('/data/dept/'+sessionStorage.getItem("mobile"),{
        action:'save',
        dept:[
            {
                departments: dept
            }
        ]
    })
}

//存储企业群信息
const saveGroupList = (group) => {
    return http.post('/data/group/'+sessionStorage.getItem("mobile"),{
        action:'save',
        group:group
    })
}

//存储当前部门下人员列表
const saveDeptPersonList = (deptName,users) => {
    return http.post('/data/dept/person/'+sessionStorage.getItem("mobile"),{
        action:'save',
        deptName:deptName,
        dept:[
            {
                users:users
            }
        ]
    })
}

const deleteAboutDept = () => {
    return http.delete('/data/dept/group/'+ sessionStorage.getItem("mobile"))
}

const deletePersonInDept = (name,deptName) => {
    return http.delete('/data/dept/person/'+ sessionStorage.getItem("mobile") + "?name=" + name + "&&deptName=" + deptName)
}

export {
    saveUserInfo,
    saveDeptList,
    saveGroupList,
    saveDeptPersonList,
    deleteAboutDept,
    deletePersonInDept
}