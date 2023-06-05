import axios from "axios";
import http from "@/api/server/http";

const mockBaseURL = 'http://localhost:4523/m1/2785261-0-default/m1/2785261-0-default'
const sendOrderToServer = (content) => {
    return axios.get(mockBaseURL+'/order/msg?id='+content)
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
    return http.post('/dept/id/'+sessionStorage.getItem('mobile')+"?deptName="+encodeURIComponent(name))
}

export {
    sendOrderToServer,
    getUserIdByName,
    getGroupIdByName,
    getDeptIdByName
}