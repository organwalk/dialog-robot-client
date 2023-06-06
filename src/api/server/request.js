import axios from 'axios'

const request = (config) => {
    const instance = axios.create({
        baseURL:'http://localhost:8180/api',
        timeout: 10000
    })

    // 请求超时时自动重新请求
    instance.interceptors.request.use(
        config => {
            config.timer = setTimeout(() => {
                config.retryCount = (config.retryCount || 0) + 1
                if (config.retryCount <= 2) {
                    // 自动重新请求
                    instance(config)
                }
            }, config.timeout || 10000)
            return config
        },
        error => {
            console.log(error)
            return Promise.reject(error)
        }
    )

    return instance(config)
}

export default request