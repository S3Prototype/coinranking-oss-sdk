const fetch = require('node-fetch')
const fetchList = require('../utils/fetchList')
const {getByQuery} = require('../utils/getMethods')
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
    defaultLimit: 50,
    defaultOffset: 0,
    defaultTypes: reduceTypesToString(['coin', 'fiat', 'denominator']),
    requestParameters: '',

    shouldCache: false,
    cacheRefreshInterval: 0,

    coins: [],

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

            // const initOptions = {this.defaults.fetchOptions, sdk: this}
            // await initLists(initOptions)
            // console.log(this.coins.splice(0, 5))

        } catch (err) {
            //handle errors later
            console.log("Error trying to init sdk", err.message)
            return
        }
    }

    const coinRank = {
        init: initCoinRankSDK,
        
        getCoinsByQuery: async(query, options)=>await getByQuery('coins', query, options),

        getMarketsByQuery: async(query, options)=>await getByQuery('markets', query, options),

        defaults,
    }

    coinRank.init = coinRank.init.bind(coinRank)
    coinRank.getCoinsByQuery = coinRank.getCoinsByQuery.bind(coinRank)
    coinRank.getMarketsByQuery = coinRank.getMarketsByQuery.bind(coinRank)

    return coinRank
}

module.exports = CoinRankSDK()