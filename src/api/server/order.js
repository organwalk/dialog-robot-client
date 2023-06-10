import http from "@/api/server/http";

const sendOrderToServer = (content) => {
    let obj = {
        action:"order",
        orderContent:content
    }
    return http.post('/order/'+sessionStorage.getItem("mobile"),obj)
}

const getUserIdByName = (nameArrary) => {
    return http.post('/data/receivers/'+sessionStorage.getItem('mobile'),{
        nameArray:nameArrary
    })
}

const getGroupIdByName = (nameArray) => {
    return http.post('/data/groupId/'+sessionStorage.getItem('mobile'),{
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