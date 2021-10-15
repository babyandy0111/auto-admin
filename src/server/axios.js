import axios from "axios";
import {baseUrl, deBugModel} from "./base";

axios.defaults.baseURL = baseUrl;
const $http = axios.create();

$http.interceptors.request.use(config => {
    if (deBugModel) {
        console.log(`request ${config.method} ${config.url} => `, config.data);
    }
    config.headers.Bearer = localStorage.getItem("id_token");
    return config
})

$http.interceptors.response.use((response) => {
    if (deBugModel) {
        console.log(`response ${response.status} : `, response.data)
    }
    if (response.status === 200) {
        return response.data;
    }
}, (err) => {
    if (deBugModel) {
        console.log(err);
    }
    if (err.response.status === 401) {
        localStorage.removeItem("id_token");
        window.location.href = `${process.env.REACT_APP_BASE_HREF}/login`;
    }
    if (err.response.status === 400) {
        return Promise.reject(err);
    }
})

export default $http;
