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
}

test()