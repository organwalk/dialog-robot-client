import axios from 'axios'

const request = (config) => {
    const instance = axios.create({
        baseURL:'http://localhost:8180/api',
        timeout: 10000
    })


    instance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            // 判断是否为超时错误
            if (error.code && error.code === 'ECONNABORTED') {
                // 清除当前请求
                // axios.delete(error.config);
                // 重新发送请求
                return instance(error.config);
            }
            return Promise.reject(error);
        }
    );

    return instance(config)
}

export default request