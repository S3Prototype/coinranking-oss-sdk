const CoinRankSDK = require('../src/coinranking-oss-sdk-index')
// CoinRankSDK.init({})

const test = async()=>{
    await CoinRankSDK.init({showDeepResults: false})
    try{
        // console.log()
        console.log(await CoinRankSDK.getCoinsByQuery('bitcoin'))
    } catch (err) {
        console.log(err)
    }
}

test()