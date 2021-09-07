import {apiPost} from './http'
import apiUrl from './base'

const API = {
    postLogin(params) {
        return apiPost(apiUrl.apiToken, params)
    },
    postAccount(params) {
        return apiPost(apiUrl.accounts, params)
    }
}

export default API
