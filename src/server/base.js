const baseUrl = 'https://app-api.codegenapps.com/';
const version = 'v1'

const apiUrl = {
    apiToken: baseUrl + version + '/api-token',
    accounts: baseUrl + version + '/accounts',
    logsMetrics: baseUrl + version + '/logs/metrics',
    resourcesMysql: baseUrl + version + '/resources/mysql',
    resourcesSubdomain: baseUrl + version + '/resources/subdomain',
    logs: baseUrl + version + '/logs',
    storages: baseUrl + version + '/storage/list-files',
}

export default apiUrl
