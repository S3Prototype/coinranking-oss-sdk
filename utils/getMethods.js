const fetch = require('node-fetch')
const endpointList = require('../utils/endpointList')
const fetchList = require('./fetchList')

const validateType = (type)=>{
    if(!type || !endpointList[type])
        throw {name: 'Get Error', message: `Cannot get ${type}. Invalid request type.`}
}

const verifyDeepResultsPossible = (type)=>{
    const exclusionList = [
        'markets',
        // 'exchanges',
    ]

    return !exclusionList.includes(type)
}

const getByQuery = async (queryData, query, fetchOptions)=>{
    validateType(queryData.dataType) //if error, will throw

    const fetchResult = await fetchList(
        `https://api.coinranking.com/v2/search-suggestions?query=${query}`,
        fetchOptions
    )
        
        //Get deep result for this data type if it's not "all"
    if(queryData.dataType !== 'all'){
        //if you shouldn't or can't get deep results, return what we have.
        if(!queryData.deepResultsDesired || !verifyDeepResultsPossible)
            return fetchResult.data[queryData.dataType]

        const deepResultList = await fetchList(endpointList[queryData.dataType], fetchOptions)    
        return deepResultList.data[queryData.dataType].filter(result=>{
            return fetchResult.data[queryData.dataType].some(dataPoint=>dataPoint.uuid === result.uuid)
        })
    }

        //Below code gets deeper results. The results returned by the search-suggestions
        //endpoint are not as detailed as the results from using direct endpoints related
        //to the type of data sought for.
    const resultList = {}
    return await Promise.all(
        Object.keys(fetchResult.data).map(async(resultType)=>{
            const deepResultList = await fetchList(endpointList[resultType], fetchOptions)
            resultList[resultType] = deepResultList.data[resultType].filter(result=>{
                return fetchResult.data[resultType].some(dataPoint=>dataPoint.uuid === result.uuid)
            })
            //Next add code that gets the results from the other endpoints. The above handles
            //coins, markets and exchanges.
            return resultList[resultType]
        }
    ))
}

const getMethods = {
    getByQuery,
}

module.exports = getMethods