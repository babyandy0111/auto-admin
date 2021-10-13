import axios from "axios";
import {baseUrl, deBugModel} from "./base";

axios.defaults.baseURL = baseUrl;
const $http = axios.create();
$http.interceptors.request.use(config => {
    if (deBugModel){
        console.log(`request ${config.method} ${config.url} => `, config.data);
    }
    config.headers.Bearer = localStorage.getItem("id_token");
    return config
})

$http.interceptors.response.use((response) => {
    if (deBugModel){
        console.log(`response ${response.status} : `, response.data)
    }
    if (response.status === 200) {
        console.log('200');
    }

    if (response.status === 401) {
        console.log('401');
        // todo logout
    }
    return response;
}, (err) => {
    console.log(err);
})

export default $http;
