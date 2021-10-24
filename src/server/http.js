import qs from "querystringify"
import ky from "ky"

const apiVersion = "v1"
const $http = ky.create({ prefixUrl: `https://app-api.codegenapps.com/${apiVersion}/` }).extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set("bearer", localStorage.getItem("id_token"))
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 200) {
          return response.data
        }
        if (response.status === 403) {
          return ky(request)
        }
        if (response.status === 401) {
          localStorage.removeItem("id_token")
          window.location.href = `${process.env.REACT_APP_BASE_HREF}/login`
        }
        if (response.status === 400) {
          return Promise.reject()
        }
      },
    ],
  },
})

function apiGet(url, params) {
  return $http.get(`${url}${qs.stringify(params, true)}`).json()
}

function apiPost(url, params) {
  return $http.post(url, { json: params }).json()
}

function apiPut(url, params) {
  return $http.put(url, { json: params }).json()
}

function apiDelete(url, params) {
  return $http.delete(url, { json: params }).json()
}

export { apiGet, apiPost, apiPut, apiDelete }
