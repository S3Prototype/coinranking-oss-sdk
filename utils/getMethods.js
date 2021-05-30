const fetch = require('node-fetch')
const endpointList = require('../utils/endpointList')
const fetchList = require('./fetchList')

const validateType = (type)=>{
    if(!endpointList[type])
        throw {name: 'Get Error', message: `Cannot get ${type}. Invalid request type.`}
}

const getByQuery = async (type, query, fetchOptions)=>{
    validateType(type) //if error, will throw

        //Eventually check if type is currency exchange or market.
        //If either of those things, do the below. Otherwise,
        //we have to use our own search to find the item
    const fetchResult = await fetchList(
        `https://api.coinranking.com/v2/search-suggestions?query=${query}`,
        fetchOptions
    )

    return fetchResult.data[type]

    //Below code is for doing deep searches where we return more than just
    //exchanges, markets and coins. For now, leave it. But remember if you
    //want to use it, you have to add the code to exclude results from
    //exchanges, markets and coins, since getting those results would be redundant.
        // const resultList = {}
        // Promise.all(Object.keys(fetchResult.data).map(async(resultType)=>{
        //     const deepResultList = await fetchList(endpointList[resultType], fetchOptions)
        //     resultList[resultType] = deepResultList.data[resultType].filter(result=>{
        //         return fetchResult.data[resultType].some(dataPoint=>dataPoint.uuid === result.uuid)
        //     })
        //     return resultList[resultType]
        // }))
        // .then(_=>console.log("Success!!!", resultList))
        // .catch(err=>console.log("Failure", err))
}

const getMethods = {
    getByQuery,
}

module.exports = getMethods