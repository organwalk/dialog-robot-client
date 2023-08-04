import axios from 'axios'

const request = (config) => {
    const instance = axios.create({
        baseURL:'https://47.122.19.138:38180/api_c',
        // baseURL:'http://localhost:8180/api_c',
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