import axios from 'axios'

const server = axios.create({
    baseURL: ' http://localhost:8080/',
    timeout: 300000
});

server.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config;
}, error => {
    return Promise.reject(error.response)
});

server.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error.response)
});

export default server;