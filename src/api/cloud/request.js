import axios from "axios";
import {getAccessToken} from "@/api/cloud/auth";

const request = (config) => {
    const instance = axios.create({
        baseURL:'/api',
        timeout:10000
    })

    //配置请求拦截器
    instance.interceptors.request.use(config => {
        //除获取accessToken外，请求头由accessToken字段和orgSecret字段构成
        const accessToken = window.sessionStorage.getItem('accessToken')
        if (accessToken){
            config.headers.accessToken = accessToken
            config.headers.orgSecret = "TwAHIAEAAAAAAInnxwAAAAAA"
        }
        return config
    },error => {
        return Promise.error(error)
    })

    //配置响应拦截器
    instance.interceptors.response.use(response => {
        if (response.data.status === 4004) {
            getAccessToken().then(res => {
                const accessToken = res.data.data.accessToken;
                sessionStorage.setItem("accessToken", accessToken);
            })
        }
        return response
    }, error => {
        return Promise.reject(error)
    })

    return instance(config)
}



export default request