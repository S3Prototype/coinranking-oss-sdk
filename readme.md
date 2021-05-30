
# Coinranking OSS SDK

An unofficial SDK for the Coinranking API. For documentation on the API directly, [go here](https://developers.coinranking.com/api/documentation/#top).

Otherwise, check out the documentation for the SDK below.

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
    - config: Object | optional config object

- config properties:
    - **apiKey**: String | your api auth key from
        https://coinranking.com/page/key-generator

    - **shouldCache**: Boolean | False by default. if true, the sdk will store any data
        retreived from the api with get requests. This data will be returned by subsequent calls of any functions that need to retrieve data. Purpose is to save on api requests, in order to stay under rate limits. See more about rate limiting: https://developers.coinranking.com/api/documentation/#rate-limits
    
    - **cacheRefreshInterval**: Number | Amount of time in milliseconds the sdk will wait
        before retrieving new data from the API upon a new get method being called.
        Not used if shouldCache is false.

- Returns: Void | Nothing is returned.

Example:
```
const coinrankingSDK = require('coinranking-oss-sdk')
coinrankingSDK.init({
    apiKey: '5030820852jds',
    shouldCache: false,
    cacheRefreshInterval: 0, // milliseconds
})
```
