import axios from 'axios'

const request = (config)=> {
    const instance = axios.create({
        baseURL:'http://localhost:8180/api',
        timeout:10000
    })
    instance.interceptors.request.use(config => {
        return config
    },error => {
        console.log(error)
        return Promise.error(error)
    })
    return instance(config)
}

export default request