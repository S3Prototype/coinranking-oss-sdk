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

const getDeepResultList = async({type, query, fetchResult, fetchOptions})=>{

    if(type === 'all') return null
        //Get all possible options of the provided datatype
    const deepResultList = await fetchList(endpointList[type], fetchOptions)
        //Remove extraneous information
    const rawResultList = deepResultList.data[type]

    const extendedList = [
        'dapps', 'nfts',
        'coinsIndex', 'exchanges',
        'currencies', 'exchangesIndex',
    ]
    if(extendedList.includes(type)){
        return {
            type,
            list: rawResultList.filter(result=>{
                //Return only options that contain a property with a value that matches the query.
                return Object.keys(result).some(key=>new RegExp(query).test(new String(result[key])))
            })
        }
    }
    //Return only the options of the provided datatype which match our result
    return {
        type,
        list: rawResultList.filter(result=>{
            return fetchResult.data[type].some(dataPoint=>dataPoint.uuid === result.uuid)
        })
    }
}

const getByQuery = async (queryData, fetchOptions)=>{
    validateType(queryData.dataType) //if error, will throw

    const fetchResult = await fetchList(
        `https://api.coinranking.com/v2/search-suggestions?query=${queryData.query}`,
        fetchOptions
    )
        
        //Get deep result for this data type if it's not "all"
    if(queryData.dataType !== 'all'){
        //if you shouldn't or can't get deep results, return what we have.
        if(!queryData.showDeepResults || !verifyDeepResultsPossible)
            return fetchResult.data[queryData.dataType]

        return getDeepResultList({
            type: queryData.dataType, query: queryData.query,
            fetchResult, fetchOptions
        })
    }
        //Get results for 'all'
    return Promise.all(
        Object.keys(endpointList).map(async(endpointKey)=>{
            return await getDeepResultList({
                type: endpointKey, query: queryData.query,
                fetchResult, fetchOptions
            })
        })
    )
}

const getByUuid = async(queryData, fetchOptions)=>{
    const {type, uuid, queryParams} = queryData
    
    let paramValue = ''
    const paramArray = Object.keys(queryParams)
    if(paramArray.length > 0){
        paramValue = paramArray.reduce((paramString, currParam, index, paramArray)=>{
            let returnString = paramString + `${currParam}=${queryParams[currParam]}`
            returnString += index < paramArray.length-1 ? '&' : ''
            return returnString
        }, '?')
    }

    const endPointString = `${endpointList[type]}/${uuid}${paramValue}`
    const fetchResult = await fetchList(endPointString, fetchOptions)

    if(fetchResult.status === 'fail' || fetchResult.status === 'error')
        throw {name: fetchResult.type, message: fetchResult.message}

    return fetchResult.data[type]
}

const getResource = async(queryData, fetchOptions)=>{
    const {type, queryParams} = queryData
    
    let paramValue = ''
    const paramArray = Object.keys(queryParams)
    if(paramArray.length > 0){
        paramValue = paramArray.reduce((paramString, currParam, index, paramArray)=>{
            let returnString = paramString + `${currParam}=${queryParams[currParam]}`
            returnString += index < paramArray.length-1 ? '&' : ''
            return returnString
        }, '?')
    }

    const endPointString = `${endpointList[type]}${paramValue}`
    const fetchResult = await fetchList(endPointString, fetchOptions)

    if(fetchResult.status === 'fail' || fetchResult.status === 'error')
        throw {name: fetchResult.type, message: fetchResult.message}

    return fetchResult.data[type]
}

const getMethods = {
    getByQuery,
    getByUuid,
    getResource,
}

module.exports = getMethods