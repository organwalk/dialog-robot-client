import axios from 'axios'

const request = (config) => {
    const instance = axios.create({
        baseURL:'http://47.122.19.138:38180/api',
        timeout: 10000
    })


    instance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.code && error.code === 'ECONNABORTED' || error.code === '502 Bad Gateway') {
                return instance(error.config);
            }
            return Promise.reject(error);
        }
    );

    return instance(config)
}

export default request