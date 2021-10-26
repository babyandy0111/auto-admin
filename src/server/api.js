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
  postAuthKeys({ keyName }) {
    return apiPost("auth-keys", { name: keyName })
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
  getAuthKey(params) {
    return apiGet("auth-keys", {
      page: 1,
      per_page: 20,
      ...params,
    }).then(res =>
      res.auth_keys.map(v => {
        return {
          id: v.id,
          name: v.name,
          isDisabled: Boolean(v.is_disable),
          privateKey: v.private_key,
          publicKey: v.public_key,
          createdAt: day(v.created_at).format("YYYY-MM-DD HH:mm:ss"),
        }
      }),
    )
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

const ApiResource = {
  resourceMySql: {
    get() {},
    getTableUser(id) {
      return apiGet(`resources/mysql/${id}/tables/user`)
    },
    getTables(id) {
      return apiGet(`resources/mysql/${id}/tables`)
    },
    getTable(id, tableName) {
      return apiGet(`resources/mysql/${id}/tables/${tableName}`)
    },
    post() {},
    put(id, { databaseName, endpoint, port, username, password }) {
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
    delete(id) {
      return apiDelete(`resources/mysql/${id}`)
    },
  },
  endpointVerifications: {
    get() {
      return apiGet("endpoint-verifications", {
        page: 1,
        per_page: 20,
      }).then(res => {
        return res.endpoint_verifications.map(v => ({ id: v.id, name: v.name }))
      })
    },
  },
  endpointVerification: {
    get(id) {
      return apiGet(`endpoint-verifications/${id}`)
    },
  },
}

// 我的 API 要如何管理比較方便
// 方便新增，方便修改

// 如何管理這些 RestFul API ？
// 在 graphql 我是如何管理這些 API 的？

export { ApiResource }

export default API
