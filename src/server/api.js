import { apiGet, apiPost } from "./http"

const apiVersion = "v1"
const apiUrl = {
  apiToken: `${apiVersion}/api-token`,
  accounts: `${apiVersion}/accounts`,
  logsMetrics: `${apiVersion}/logs/metrics`,
  resourcesMysql: `${apiVersion}/resources/mysql`,
  resourcesSubdomain: `${apiVersion}/resources/subdomain`,
  logs: `${apiVersion}/logs`,
  storages: `${apiVersion}/storage/list-files`,
}

const API = {
  // post
  postLogin(params) {
    return apiPost(apiUrl.apiToken, params)
  },
  postAccount(params) {
    return apiPost(apiUrl.accounts, params)
  },
  // get
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
