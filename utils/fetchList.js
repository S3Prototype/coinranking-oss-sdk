const fetch = require('node-fetch')

const fetchList = async (endpoint, options)=>{
    const fetchOptions = {method: 'GET'}
    if(options){
        fetchOptions.headers = options.headers ?? {}
    }
    const fetchResult = await fetch(endpoint, fetchOptions)
    const resultJSON = await fetchResult.json()
    if(resultJSON.status === 'fail')
        throw {name: resultJSON.type, message: resultJSON.message}

    return resultJSON
}

module.exports = fetchList