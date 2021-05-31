
# Coinranking OSS SDK

An unofficial SDK for the Coinranking API. For documentation on the API directly, [go here](https://developers.coinranking.com/api/documentation/#top).

Otherwise, check out the documentation for the SDK below.

**Note**: *For now, documentation will be incomplete. Methods will be listed and briefly explained, but thorough descriptions will be filled in later.*

# How to use these docs

Each method in these docs will include:

- Name of method
- High-level description: What the method does.
- Low-level description: How it does what it does.
- List of parameters.
- Description of what it returns.
- Example code

# Method Reference

### *async* init()

**High level**:

Initializes the SDK with a list of coins and currencies pulled from the API, then
sets up caching based on the optional config object you pass into it.

**Low Level**:

Executes a fetch request to https://api.coinranking.com/v2/indexes/coins, then maps
the resulting array to a new array that the sdk stores. Configures caching based on
the optional config object you pass to it.

- Takes:
    - config: Object | optional config object (Described below this entry)

- Returns: Void | Nothing is returned.

Example:
```
const coinrankingSDK = require('coinranking-oss-sdk')
coinrankingSDK.init({
    apiKey: '5030820852jds',
    limit: 50,
    showDeepResults: true,
})
```

#### config: Object

**High Level**: An optional object to be passed to the init() method. The config object sets the default options for queries. In future versions of the SDK, you will be able to modify the config after init is called. For now, you can pass your optional parameters into the queryParameters objects of the methods you call, as will be explained later in the documentation. Below is the list of functioning config properties:

- config properties:
    - **apiKey**: String | your api auth key from
        https://coinranking.com/page/key-generator

    - **showDeepResults**: Boolean | tells the sdk whether you want results of your queries to have all possible details or not. Default false.

### *async* getCoins(queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a list of all existing coins in the coinranking API.

### *async* getExchanges(queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a list of all existing exchanges in the coinranking API.

### *async* getMarkets(queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a list of all existing markets in the coinranking API.

### *async* getDapps(queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a list of all existing dapps in the coinranking API.

### *async* getNFTs(queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a list of all existing NFTs in the coinranking API.

### *async* getCoinByQuery(query | required String, options | optional Object)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Find a coin or set of coins that match your query string.

### *async* getExchangesByQuery(query | required String, options | optional Object)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Find an exchange or set of exchanges that match your query string.

### *async* getMarketByQuery(query | required String, options | optional Object)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Find a market or set of markets that match your query string.

### *async* getAllByQuery(query | required String, options | optional Object)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return all items of all data types which match your query string.

### *async* getCoinByUuid(uuid | required String, queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a coin that matches the provided uuid.

### *async* getExchangeByUuid(uuid | required String, queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return an exchange that matches the provided uuid.

### *async* getDapp(dappName | required String, queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return a Dapp that matches the provided name.

### *async* getNFT(id | required String, queryParams | Object, optional)

*For a list of all params, check out the API documentation: https://developers.coinranking.com/api/documentation*

**High Level**: Return an NFT that matches the provided id.
