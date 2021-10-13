import qs from "querystring"
import $http from "./axios"

export function apiGet(url, params) {
  url = url + "?" + qs.stringify(params)
  return $http.get(url, params)
}

export function apiPost(url, params) {
  return $http.post(url, params)
}
