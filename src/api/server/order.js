import http from "@/api/server/http";

const sendOrderToServer = (deptName,content) => {
    let obj = {
        action:"order",
        deptName:deptName,
        orderContent:content
    }
    return http.post('/order/'+sessionStorage.getItem("mobile"),obj)
}

const getUserIdByName = (deptName,nameArray) => {
    return http.post('/data/receivers/'+sessionStorage.getItem('mobile'),{
        deptName:deptName,
        nameArray:nameArray
    })
}

const getGroupIdByName = (deptName, nameArray) => {
    return http.post('/data/groupId/'+sessionStorage.getItem('mobile'),{
        deptName:deptName,
        nameArray:[nameArray]
    })
}

const getDeptIdByName = (name) => {
    return http.get('/data/dept/id/'+sessionStorage.getItem('mobile'),{
        deptName:name
    })
}

export {
    sendOrderToServer,
    getUserIdByName,
    getGroupIdByName,
    getDeptIdByName
}