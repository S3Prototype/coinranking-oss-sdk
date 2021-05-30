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
        console.log(`${type} is part of extended list`)
        return {
            type,
            list: rawResultList.filter(result=>{
                //Return only options that contain a property with a value that matches the query.
                return Object.keys(result).some(key=>new String(result[key]).includes(query))
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
        if(!queryData.deepResultsDesired || !verifyDeepResultsPossible)
            return fetchResult.data[queryData.dataType]

        return getDeepResultList({
            type: queryData.dataType, query: queryData.query,
            fetchResult, fetchOptions
        })
    }

        //Below code gets deeper results. The results returned by the search-suggestions
        //endpoint are not as detailed as the results from using direct endpoints related
        //to the type of data sought for.
    const resultList = {}

    // return Object.keys(endpointList).map(async(endpointKey)=>{ 

    //     const deepResultList = await fetchList(endpointList[endpointKey], fetchOptions)
    //         //Remove extraneous information
    //     const rawResultList = deepResultList.data[endpointKey]   

    //     const extendedList = ['dapps', 'nfts']
    //     if(extendedList.includes(endpointKey)){
    //         return rawResultList.filter(result=>{
    //             //Return only options that contain a property with a value that matches the query.
    //             return Object.keys(result).some(key=>(new RegExp(query)).test(result[key]))
    //         })
    //     }
    // })

    return Promise.all(
        // [
            // ...Object.keys(fetchResult.data).map(async(resultType)=>{
            //     return await getDeepResultList({
            //         type: resultType, query: queryData.query,
            //         fetchResult, fetchOptions
            //     })
            //     //Next add code that gets the results from the other endpoints. The above handles
            //     //coins, markets and exchanges.
            //     // return resultList[resultType]
            // }),
            Object.keys(endpointList).map(async(endpointKey)=>{
                return await getDeepResultList({
                    type: endpointKey, query: queryData.query,
                    fetchResult, fetchOptions
                })
            })
        // ]
    )
}

const getMethods = {
    getByQuery,
}

module.exports = getMethods