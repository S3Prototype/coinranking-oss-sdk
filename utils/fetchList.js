const fetch = require('node-fetch')

const fetchList = async (endpoint, options)=>{
    const fetchResult = await fetch(endpoint, options)
    const resultJSON = await fetchResult.json()
    if(resultJSON.status === 'fail')
        throw {name: resultJSON.type, message: resultJSON.message}

    return resultJSON
}

module.exports = fetchList