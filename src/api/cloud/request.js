import axios from "axios";

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
        console.log(error)
        return Promise.error(error)
    })
    return instance(config)
}

export default request