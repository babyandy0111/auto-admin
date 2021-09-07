import qs from 'querystring'

export function apiGet(url) {
    reqSetLog(url, null)
    return fetch(url).then(res => {
        resSetLog(url, res)
        return res.json()
    })
}

export function apiForm(url, params) {
    reqSetLog(url, params)
    return fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json,text/plain,*/*'
        },
        body: qs.stringify(params)
    }).then(res => {
        resSetLog(url, res)
        return res.json()
    })
}

export function apiPost(url, params) {
    reqSetLog(url, params)
    return fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json,text/plain,*/*'
        },
        body: JSON.stringify(params),
        mode: 'cors', // no-cors, cors, *same-origin
        referrer: 'no-referrer', // *client, no-referrer
    }).then(res => {
        resSetLog(url, res)
        if (res.status === 200) {
            return res.json()
        } else {
            return {"error": "api error"}
        }
    })
}

function reqSetLog(url, params) {
    if (params == null) {
        console.log(`request ${url}`)
        return
    }
    console.log(`request ${url} : `, params)
}

function resSetLog(url, params) {
    console.log(`response ${url} : `, params)
}
