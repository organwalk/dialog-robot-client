import request from '@/api/server/request'

const http = {
    get(url,params){
        const config = {
            method:'get',
            url:url
        }
        if (params) config.params = params
        return request(config)
    },
    post(url,params){
        const config = {
            method: 'post',
            url:url,
            data: params,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (params) config.data = params
        return request(config)
    },
    put(url,params){
        const config = {
            method:'put',
            url:url
        }
        if (params) config.params = params
        return request(config)
    },
    delete(url,params){
        const config = {
            method:'put',
            url:url
        }
        if (params) config.params = params
        return request(config)
    }
}
export default http