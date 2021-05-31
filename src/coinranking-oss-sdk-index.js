const fetch = require('node-fetch')
const fetchList = require('../utils/fetchList')
const {getByQuery, getByUuid, getResource} = require('../utils/getMethods')
const endpointList = require('../utils/endpointList')

const reduceTypesToString = (types)=>{
    return types.reduce(
        (typeSetString, currentType)=>typeSetString+`&types[]=${currentType}`, ''
    )
}

const generateParameterString = (limit = 50, offSet = 0, types = '')=>{
    return `?limit=${limit}&offSet=${offSet}${types}`
}

const initConfigs = (config, {defaults})=>{

    if(config){
        if(typeof config.shouldCache === 'boolean')
            defaults.shouldCache = config.shouldCache

        if(typeof config.cacheRefreshInterval === 'number' && config.cacheRefreshInterval > 0)
            defaults.cacheRefreshInterval = config.cacheRefreshInterval

        if(config.currency && config.currencySymbol !== defaults.defaultCurrency.symbol)
            defaults.defaultCurrency = defaults.findCurrency(config.currencySymbol)

        defaults.defaultLimit = config.params.limit || defaults.defaultLimit
        defaults.defaultOffset  = config.params.offset || defaults.defaultOffset
        
        if(config.deepResultsDesired && typeof config.deepResultsDesired === 'boolean')
            defaults.deepResultsDesired = config.deepResultsDesired

        if(config.params.types)
            defaults.defaultTypes = reduceTypesToString(config.params.types)

        defaults.fetchOptions.headers = {'x-access-token': config.apiKey}
        
    }//if(config)
    
    defaults.requestParameters = generateParameterString(defaults.defaultLimit, defaults.defaultOffset, defaults.defaultTypes)
}

const initLists = async ({fetchOptions, sdk})=>{
    return Promise.all(Object.keys(sdk).map(async (listType)=>{
        if(endpointList[listType]){
            console.log(listType)
            const listRequest = await fetchList(endpointList[listType], fetchOptions)
            sdk[listType] = listRequest.data[listType]
        }
    }))
}

const defaults = {
    
    fetchOptions : {
        method: 'GET',
        headers: '',
    },
    defaultLimit: 10,
    defaultOffset: 0,
    defaultTypes: reduceTypesToString(['coin', 'fiat', 'denominator']),
    requestParameters: '',

    shouldCache: false,
    cacheRefreshInterval: 0,

    coins: [],

    deepResultsDesired: false,

    currencies: [],
    defaultCurrency: {
      uuid: "yhjMzLPhuIDl",
      type: "fiat",
      symbol: "USD",
      name: "US Dollar",
      iconUrl: "https://cdn.coinranking.com/kz6a7w6vF/usd.svg",
      sign: "$"
    },

}

const CoinRankSDK = ()=> {

    async function initCoinRankSDK(config){
        try {

            initConfigs(config, this)

            console.log("Initted this", this)

            // const initOptions = {this.defaults.fetchOptions, sdk: this}
            // await initLists(initOptions)
            // console.log(this.coins.splice(0, 5))

        } catch (err) {
            //handle errors later
            console.log("Error trying to init sdk", err.message)
            return
        }
    }

    const createQuery = async (dataType, query, options, sdk)=>{
        try {
            const queryData = {
                dataType,
                query,
                options: options ||  sdk.defaults.fetchOptions,
                deepResultsDesired: sdk.defaults.deepResultsDesired ?? false,
            }
            return await getByQuery(queryData, options)
        } catch (err) {console.log(err)}
    }

    // const uuidQuery = async(dataType, uuid, queryParams, sdk)=>{

    //     const queryData = {
    //         dataType,
    //         uuid,
    //         fetchOptions: this.defaults.fetchOptions,
    //         queryParams
    //     }
    // }

    const coinRank = { 
        init: initCoinRankSDK,
            //Query-based getters
        getCoinsByQuery: async function(query, options){return await createQuery('coins', query, options, this)},
        getMarketsByQuery: async function(query, options){return await createQuery('markets', query, options, this)},
        getExchangesByQuery: async function(query, options){return await createQuery('exchanges', query, options, this)},
        getAllByQuery: async function(query, options){return await createQuery('all', query, options, this)},
        
            //Uuid- and id-based getters
        getCoinByUuid: async function(uuid, queryParams={}){
            return await getByUuid({type:'coin', uuid, queryParams}, this.defaults.fetchOptions)
        },
        getExchangeByUuid: async function(uuid, queryParams={}){
            return await getByUuid({type:'exchange', uuid, queryParams}, this.defaults.fetchOptions)
        },
        getMarketByUuid: async function(uuid, queryParams={}){
            return await getByUuid({type:'market', uuid, queryParams}, this.defaults.fetchOptions)
        },
        getDapp: async function (dappName, queryParams={}){
            return await getByUuid({type:'dapp', uuid:dappName, queryParams}, this.defaults.fetchOptions)
        },
        getNFT: async function (id, queryParams={}){
            return await getByUuid({type:'nft', uuid:id, queryParams}, this.defaults.fetchOptions)
        },

            //Default getters
        getCoins: async function (queryParams={}){
            return await getResource({type:'coins', queryParams}, this.defaults.fetchOptions)
        },
        getExchanges: async function (queryParams={}){
            return await getResource({type:'exchanges', queryParams}, this.defaults.fetchOptions)
        },
        getMarkets: async function (queryParams={}){
            return await getResource({type:'markets', queryParams}, this.defaults.fetchOptions)
        },
        getDapps: async function (queryParams={}){
            return await getResource({type:'dapps', queryParams}, this.defaults.fetchOptions)
        },
        getNFTs: async function (queryParams={}){
            return await getResource({type:'nfts', queryParams}, this.defaults.fetchOptions)
        },
        

        defaults,
    }

    coinRank.init = coinRank.init.bind(coinRank)

    coinRank.getExchangesByQuery = coinRank.getExchangesByQuery.bind(coinRank)
    coinRank.getCoinsByQuery = coinRank.getCoinsByQuery.bind(coinRank)
    coinRank.getMarketsByQuery = coinRank.getMarketsByQuery.bind(coinRank)

    coinRank.getCoinByUuid = coinRank.getCoinByUuid.bind(coinRank)
    coinRank.getExchangeByUuid = coinRank.getExchangeByUuid.bind(coinRank)
    coinRank.getMarketByUuid = coinRank.getMarketByUuid.bind(coinRank)
    coinRank.getDapp = coinRank.getDapp.bind(coinRank)
    coinRank.getNFT = coinRank.getNFT.bind(coinRank)

    coinRank.getCoins = coinRank.getCoins.bind(coinRank)
    coinRank.getExchanges = coinRank.getExchanges.bind(coinRank)
    coinRank.getMarkets = coinRank.getMarkets.bind(coinRank)
    coinRank.getDapps = coinRank.getDapps.bind(coinRank)
    coinRank.getNFTs = coinRank.getNFTs.bind(coinRank)

    return coinRank
}

module.exports = CoinRankSDK()