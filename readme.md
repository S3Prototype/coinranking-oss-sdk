
# Coinranking OSS SDK

An unofficial SDK for the Coinranking API. For documentation on the API directly, [go here](https://developers.coinranking.com/api/documentation/#top).

## What is Coinranking?
Coinranking is a database that stores information about cryptocurrencies, NFTs, DAPPs, crypto markets and crypto exchanges. They provide two API's for fetching their data: REST, and Websockets. This package is built on the REST API with tentative hopes to build a Websocket version in the future.

You can visit Coinranking by going here: https://coinranking.com/

Otherwise, check out the documentation for the SDK below.

**Note**: *For now, documentation will be incomplete. Methods will be listed and briefly explained, but thorough descriptions will be filled in later.*

To get an API Key, go to

https://coinranking.com/page/key-generator


## Method Reference

All methods are async. Many methods take an optional queryParams object, which
contains your query parameters. The API request the SDK makes will include the
params you specify.

Example:

`await coinRankingSDK.getExchanges({referenceCurrencyUuid: '5k-_VTxqtCEI'})`

Will make this request:

`https://api.coinranking.com/v2/exchanges?referenceCurrencyUuid=5k-_VTxqtCEI`

---

#### Init your sdk object.

This optional method takes a config object which contains the options you want
to change in the SDK. The only two implemented properties that can be changed
are showDeepResults and apiKey.

```
const coinRankingSDK = require('coinranking-oss-sdk')
coinRankingSDK.init({apiKey: '501030249'})
```

The config object is optional. You do not need an apiKey to use this sdk. By
default, all methods return shallow results. Below is an example of what
showDeepResults does.

`console.log(await coinRankingSDK.getCoinsByQuery('bitcoin'))`

Will show:
```
{
    "uuid": "Qwsogvtv82FCd",
    "iconUrl": "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg",
    "name": "Bitcoin",
    "symbol": "BTC"
},
```

But with the showDeepResults config property set to true, it will show:

```
{
    "uuid": "Qwsogvtv82FCd",
    "symbol": "BTC",
    "name": "Bitcoin",
    "color": "#f7931A",
    "iconUrl": "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg",
    "marketCap": "675363653114.2232812265917263135",
    "price": "36073.2892889105884555198",
    "listedAt": 1330214400,
    "tier": 1,
    "change": "3.0583802753754554",
    "rank": 1,
    "sparkline": [
        "35010.5303218600111478953",
        "34909.00443207421422149077",
        "34629.66751175945689709165",
        "34728.41741641907404637792",
        "34291.25523852246856575276",
        "34462.29287247915263939462",
        "34305.2374929037934768079",
        "33928.95279376258192902647",
        "33967.04068787229485731744",
        "34126.79887708277684087609",
        "34277.4787737251132607257",
        "34495.13486506954909369016",
        "34572.61722302962304720503",
        "34246.64339532343773653377",
        "33771.50226346070129677326",
        "34060.4826867892839909812",
        "34565.58717491097922026174",
        "34722.9331091426479865895",
        "34977.32128009553819540104",
        "35383.90346857155540177202",
        "35691.34605993936237027942",
        "35912.69880854507392433813",
        "35778.63137739629327635604",
        "35877.71584279866411893909",
        "35841.93357317088269181255",
        "36013.29536621204563364777",
        "36073.2892889105884555198"
    ],
    "lowVolume": false,
    "coinrankingUrl": "https://coinranking.com/coin/Qwsogvtv82FCd+bitcoin-btc",
    "24hVolume": "38516156547.74537036819457201655",
    "btcPrice": "1"
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `config`      | `object` | **Optional**. Set the config options for the sdk to use |

*Config object:*

| Property | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `apiKey`      | `string` | **Optional**. Your API key string |
| `showDeepResults`      | `boolean` | **Optional**. Tell the SDK how detailed results should be |

---

### Return an array of all coins, markets, exchanges, etc

```
const coinRankingSDK = require('coinranking-oss-sdk')
coinRankingSDK.init({apiKey: '501030249'})

await coinRankingSDK.getCoins()
await coinRankingSDK.getExchanges()
await coinRankingSDK.getMarkets()
await coinRankingSDK.getDapps()
await coinRankingSDK.getNFTs()
```

You can also add a queryParams object with the params you'd like to add.

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

```
await coinRankingSDK.getCoins({limit: 1})
await coinRankingSDK.getMarkets({
    limit: 10,
    referenceCurrencyUuid: 'yhjMzLPhuIDl'
})
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `queryParams` | `object` | **Optional**. An object containing your params. |

#### Return an array of items that match a query string you provide.

```
const coinRankingSDK = require('coinranking-oss-sdk')
coinRankingSDK.init({apiKey: '501030249'})

const customHeaders = {'x-access-token': '53a0b0a7e4f2fa59519e4'}
await coinRankingSDK.getCoinsByQuery('bitcoin')
await coinRankingSDK.getExchangesByQuery('DOGE', {headers: customHeaders})
await coinRankingSDK.getMarketsByQuery('etherium')
await coinRankingSDK.getAllByQuery('eth')
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query`      | `string` | **Required**. Text to search for |
| `options`      | `object` | **Optional**. Override headers for the fetch request|

#### Return a coin, exchange, or market whose uuid matches the string you provide.

```
const coinRankingSDK = require('coinranking-oss-sdk')
coinRankingSDK.init({apiKey: '501030249'})

await coinRankingSDK.getCoinByUuid('Qwsogvtv82FCd')
await coinRankingSDK.getExchangeByUuid('-zdvbieRdZ', {})
await coinRankingSDK.getMarketByUuid('MP77r-vKf4')
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `uuid`      | `string` | **Required**. Uuid to search for |
| `queryParams` | `object` | **Optional**. An object containing your params |


#### Return a dapp whose name matches the string you provide.

```
await coinRankingSDK.getDapp('cryptokitties')
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `dappName`      | `string` | **Required**. Dapp to search for |
| `queryParams`      | `object` | **Optional**. An object containing your params|

#### Return an NFT whose id matches the string you provide.

```
await coinRankingSDK.getNFT(
    '16443c43d6a1ba33c85a49c7c6c36f7ac7150e478a405d05c4bedcc200b9610a'
)
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. NFT id to search for |
| `queryParams`      | `object` | **Optional**. An object containing your params|