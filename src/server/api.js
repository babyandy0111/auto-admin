import { project } from "ramda"
import { apiGet, apiPost } from "./http"

const apiVersion = "v1"
const apiUrl = {
  // post
  apiToken: `${apiVersion}/api-token`,
  accounts: `${apiVersion}/accounts`,
  resourcesMysql: `${apiVersion}/resources/mysql`,
  // get
  logsMetrics: `${apiVersion}/logs/metrics`,
  resourceDatabaseType: `${apiVersion}/resources/database-type`,
  resourceMysqlTable: `${apiVersion}/resources/mysql/:id/tables`,
  resourceMysqlTableInfo: `${apiVersion}/resources/mysql/:id/tables/:table`,
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
    return apiPost(apiUrl.accounts, {
      info: {
        database_name: "abc",
        endpoint: "127.0.0.1",
        password: "123456",
        port: "3306",
        username: "wen",
      },
      is_self_connect: false,
      name: "workspace name",
    })
  },
  postResourceMysql({ dataSrcType, databaseName, endpoint, password, port, username, workspace }) {
    return apiPost(apiUrl.resourcesMysql, {
      name: workspace,
      is_self_connect: dataSrcType === "connect",
      info:
        dataSrcType === "connect"
          ? {
              database_name: databaseName,
              endpoint,
              password,
              port,
              username,
            }
          : undefined,
    })
  },
  // get
  getLogsMetrics(params) {
    return apiGet(apiUrl.logsMetrics, params)
  },
  getResourcesMysql(params) {
    const result = apiGet(apiUrl.resourcesMysql, {
      page: 1,
      per_page: 20,
      ...params,
    })

    return result
  },
  getResourceDBType() {
    return apiGet(apiUrl.resourceDatabaseType)
  },
  getResourcesMysqlTable(id) {
    const result = apiGet(apiUrl.resourceMysqlTable.replace(":id", id))

    return result
  },
  getResourcesMysqlTableInfo(id, tableName) {
    const result = apiGet(apiUrl.resourceMysqlTableInfo.replace(":id", id).replace(":table", tableName))

    return result
  },
  getResourcesSubdomain(params) {
    const result = apiGet(apiUrl.resourcesSubdomain, {
      page: 1,
      per_page: 20,
      ...params,
    })
      .then(res => project(["id", "name"], res.resources))
      .catch(err => console.log(err))

    return result
  },
  getLogs(params) {
    return apiGet(apiUrl.logs, params)
  },
  getStorage(params) {
    return apiGet(apiUrl.storages, params)
  },
}

export default API
