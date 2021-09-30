import {apiGet, apiPost} from './http'
import apiUrl from './base'

const API = {
    postLogin(params) {
        return apiPost(apiUrl.apiToken, params)
    },
    postAccount(params) {
        return apiPost(apiUrl.accounts, params)
    },
    getLogsMetrics(params) {
        return apiGet(apiUrl.logsMetrics, params)
    },
    getResourcesMysql(params) {
        return apiGet(apiUrl.resourcesMysql, params)
    },
    getResourcesSubdomain(params) {
        return apiGet(apiUrl.resourcesSubdomain, params)
    },
    getLogs(params) {
        return apiGet(apiUrl.logs, params)
    },
    getStorage(params) {
        return apiGet(apiUrl.storages, params)
    },
}

export default API
