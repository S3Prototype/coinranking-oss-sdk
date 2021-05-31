const CoinRankSDK = require('../src/coinranking-oss-sdk-index')
// CoinRankSDK.init({})

const test = async()=>{
    await CoinRankSDK.init()
    try{
        // console.log()
        console.log(await CoinRankSDK.getNFTs({limit:1}))
    } catch (err) {
        console.log(err)
    }
    // console.log("Coins results:")
    // console.log(await CoinRankSDK.getCoinsByQuery('bitco'))
    // console.log("Markets results:")
    // console.log(await CoinRankSDK.getMarketsByQuery('bitco'))
    // console.log("Exchanges results:")
    // console.log(await CoinRankSDK.getExchangesByQuery('bitco'))
}

test()