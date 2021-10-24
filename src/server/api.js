import { project } from "ramda"
import { apiGet, apiPost, apiPut, apiDelete } from "./http"
import day from "dayjs"

const API = {
  // post
  postLogin(params) {
    return apiPost("api-token", params)
  },
  postAccount(params) {
    return apiPost("accounts", {
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
  postMysqlPing({ databaseName, endpoint, password, port, username }) {
    return apiPost("mysql/ping", {
      database_name: databaseName,
      endpoint,
      port,
      username,
      password,
    })
  },
  postResourceMysql({ dataSrcType, databaseName, endpoint, password, port, username, workspace }) {
    return apiPost("resources/mysql", {
      name: workspace,
      is_self_connect: dataSrcType === "existed",
      info:
        dataSrcType === "existed"
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
    return apiGet("logs/metrics", params)
  },
  getResourcesMysql(params) {
    const result = apiGet("resources/mysql", {
      page: 1,
      per_page: 20,
      ...params,
    })

    return result
  },
  getResourceDBType() {
    return apiGet("resources/database-type")
  },
  getResourceMysql(params) {
    return apiGet("resources/mysql", {
      page: 1,
      per_page: 20,
      ...params,
    }).then(res =>
      res.resources.map(v => ({
        id: v.id,
        name: v.name,
        type: v.resource_type,
        createdAt: day(v.created_at).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: day(v.updated_at).format("YYYY-MM-DD HH:mm:ss"),
        isSelfConnect: v.is_self_connect,
      })),
    )
  },
  getResourcesMysqlTable(id) {
    const result = apiGet(`resources/mysql/${id}/tables`)

    return result
  },
  getResourcesMysqlTableInfo(id, tableName) {
    const result = apiGet(`resources/mysql/${id}/tables/${tableName}`)

    return result
  },
  getResourcesSubdomain(params) {
    const result = apiGet("resources/subdomain", {
      page: 1,
      per_page: 20,
      ...params,
    })
      .then(res => project(["id", "name"], res.resources))
      .catch(err => console.log(err))

    return result
  },
  getLogs(params) {
    return apiGet("logs", params)
  },
  getStorage(params) {
    return apiGet("storage/list-files", params)
  },
  // update
  updateResourceMysql(id, { databaseName, endpoint, port, username, password }) {
    return apiPut(`resources/mysql/${id}`, {
      info: {
        database_name: databaseName,
        endpoint,
        password,
        port,
        username,
      },
    })
  },
  // delete
  deleteResourceMysql(id) {
    return apiDelete(`resources/mysql/${id}`)
  },
}

export default API
