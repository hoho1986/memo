# HTTP Caching

## Default Caching Mechanism

Caching is effective by default if 
- `GET` or `HEAD` request methods are used,
- No restriction headers\* are present in the response, and 
- Status code of response is one of the following: 200, 203, 204, 206, 300, 301, 308, 404, 405, 410, 414 and 501.

> \* Example of restriction headers: `Authorization` is set, `Cache-Control` value is `no-store` or `private`, ....

## Caching Resource

Caching Type:
- Shared cache: No personalized content. Can be provided to multiple users. Store on local, proxy server or CDN.
- Private cache: Personalized content for single user. Store locally.

Caching State:
- Fresh: Can be resued.
- Stale: Can not be reused before revalidation. After revalidation, it can be freshed again. 
- Age: How long the resource has been cached (in second).

### Header `Expires`

Server gives a expired date via HTTP response header `Expires`. 
Resource after the expired date should be discarded and refresh from the server.
The expired date format uses `HTTP Date`.

> Response header `Expires` is ignored if `max-age` or `s-maxage` directive is present in response header `Cache-Control`.

> HTTP Date use Greenwich Mean Time instead of local time.
> 
> Syntax: `<day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`
> 
> - `<day-name>`: Mon, Tue, Wed, Thu, Fri, Sat, or Sun (case-sensitive)
> - `<day>`: 2 digit day number
> - `<month>`: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec (case sensitive).
> - `<year>`: 4 digit year number
> - `<hour>`: 2 digit hour number
> - `<minute>`: 2 digit minute number
> - `<second>`: 2 digit second number

### Header `Cache-Control`

Response header `Expires` is too simple and not detailed enough.
It is just one way directive from server to client.

A new header `Cache-Control`
- introduced since HTTP/1.1
- define caching policies
- instruct caching mechanisms in both requests and responses
- its value is comma-separated list of directives
- the directive is case-insensitive (lowercase is recommended)

#### Directives for Response Header `Cache-Control`

- `max-age`
   Syntax: `max-age=N`. Where N is positive integer. Override header `Expires`.
   The resource can determine fresh within N seconds from generated. 
   If response header `Age` is existed, how many seconds that the resource is stored from the generated. 
   Deduct value of `Age` when calculating freshness.
- `s-maxage`
   Syntax: `s-maxage=N`. Where N is positive integer. Override directive `max-age` and header `Expires`.
   The resource is shared cache and can determine fresh within N seconds from generated. 
   If response header `Age` is existed, how many seconds that the resource is stored from the generated. 
   Deduct value of `Age` when calculating freshness.
- `no-cache`
   The resource can be cached. 
   However, revalidation with the origin server must be done before every reuse even the client is disconnected.
- `must-revalidate`
   The resource can be cached. 
   Reuse while it is still fresh.
   Revalidation with the origin server must be done when it is stale.
   In general, HTTP use stale cache when disconnected with origin server. Using this directive can prevent this from happening.
   Typically, it is used with `max-age`.
- `proxy-revalidate`
   It is equivalent with `must-revalidate`, but specifically for shared cache only.
- `no-store`
   The resource MUST NOT be cached.
- `private`
   The resource can be only stored in private cache.
- `public`
   The resource can be stored in shared cache.
   It is used to unlock restriction that resource with `Authorization` header can not be stored in shared cache.
   The restriction can also be unlocked with `s-maxage` or `must-revalidate`.
- `must-understand`
   The resource can be stored only if it understands the requirements based on status code. 
   It should be coupled with `no-store` for fallback. e.g. `Cache-Control: must-understand, no-store`
- `no-transform`
   Any intermediary (regardless of whether it implements a cache) should not transform the resource.
- `immutable`
   The resource never update while it is fresh.
   In general, cache-busting pattern, which is changing the URL every time when updating the resource, is used. 
- `stale-while-revalidate`
   Syntax: `stale-while-revalidate=N`. Where N is positive integer.
   The stale cache can be used within the period specified in N seconds and revalidated in background.
   e.g. `Cache-Control: max-age=604800, stale-while-revalidate=86400`. There is 1 day, after 7 days fresh, that allow doing revalidation in background.
- `stale-if-error`
   Syntax: `stale-if-error=N`. Where N is positive integer.
   If error occured on upstream server, or even local, the stale cache can be used within the period specified in N seconds.
   After the period, client will receive the error.
   e.g. `Cache-Control: max-age=604800, stale-if-error=86400`. It is fresh for 7 days and extra 1 day when error is encountered.

#### Directives for Request Header `Cache-Control`

- `no-cache`
   Client requests revalidation with origin server before reuse even the cache is still fresh.
   Browser usually add this directive when user does force reloading.
- `no-store`
   Client requests do not store any cache for this request and corresponding response even the response from origin server is storable.
- `max-age`
   Syntax: `max-age=N`. Where N is positive integer.
   Client allows using cache that is generated on origin server within N seconds.
   If N is not positive integer, the behaviour is unspecified and suggest treat as 0.
   `max-age=0` is workaround for `no-cache` which is not existed in HTTP/1.0.
- `max-stale`
   Syntax: `max-stale=N`. Where N is positive integer. 
   Client allows using stale cache within N seconds. If N value is not specified, it accepts stale cache of any age.
   Major browsers do not support this directive.
- `min-fresh`
   Syntax: `min-fresh=N`. Where N is positive integer.
   Client requests the cache is still fresh at least N seconds.
   e.g. `Cache-Control: min-fresh=600`
   The cache is fresh for 3600 seconds and 3300 seconds is passed. It is still fresh for 300 seconds but can not be used.
   This directive is not only request fresh and it also request cacheable for a period of time.
   Major browsers do not support this directive.
- `no-transform`
   Any intermediary should not transform the request.
- `only-if-cached`
   Client requests returning cached response even it is stale.
   If no any cached response, `504 Gateway Timeout` will be returned.
- `stale-if-error`
   Client requests receiving stale response from any intermediate server when encountering error on origin server.
   No browsers support this directive.
   
> Request header `Pragma: no-cache` is as same as `Cache-Control: no-cache`. 
> Use it only for backwards compatibility with HTTP/1.0 clients.
> Do not use `Pragma: no-cache` on response header. It is not specified for HTTP responses.

#### Use Cases of `Cache-Control`

- Prevent storing. `Cache-Control: no-store`
- Immutable assets or libraries. `Cache-Control: max-age=31536000, immutable`
- Keep up-to-date. `Cache-Control: no-cache`

### Header `Vary`

It is used to describe that the response is influenced by the request headers (exclude method and URL).
Caches should be created based on the headers listed in response header `Vary`.

The value of response header `Vary` is either comma-separated headers' name or wildcard `*`.
For wildcard, implied that the resource is not cacheable.

## Revalidating Cached Resource

Revalidation uses conditional requests.
- `Last-Modified`
- `ETag`

### Header `Last-Modified`

Response header `Last-Modified` is the datetime, in HTTP date format, when resource was last modified.
It is simple and less accurate than `ETag`.
Only effective if ETag is unavailable.

Conditional request header for `Last-Modified`
- `If-Modified-Since`
   If the resource has been modified after the specified date, condition is meet, process the subsequent and send back the resource.
   If condition is not meet, response is `304 Not Modified`.
   This header is ignored if request header `If-None-Match` is existed.
- `If-Unmodified-Since`
   If the resource has been modified after the specified date, condition is not meet, response is `412 Precondition Failed`.
   Process the subsequent if the conditions are met.
   In conjunction with non-safe methods, such as POST, it is concurrency control to avoid conflicts.
   In conjunction with a range request, it can ensure that fragment is come from unmodified resource.
   This header is ignored if request header `If-Match` is existed.

> For `304 Not Modified` response, it is no response body.
> If following response headers are existed in previously normal response (usually is 200 OK), it MUST include in response of 304 as well:
> - `Cache-Control`
> - `Content-Location`
> - `Date`
> - `ETag`
> - `Expires`
> - `Vary`

### Header `ETag`

HTTP ETag (entity tag)
- an identifier for a specific version of a resource.
- prevent a resource is updated simultaneously and be overwritten each other.

The value of ETag is a ASCII string quoted by double quotes and no specified generation method.
In general, it is a hash of content or last modified timestamp.
Optional prefix `W/` indicates weak validator is used.

> Strong (No prefix) ETag is ideal for comparisons but it is difficult to generate. Weak ETag is opposite.
> Passed weak validator means it may be equivalent but not byte for byte identical. 
> Resource in byte range with weak ETag should not be cached.
> Use strong ETag If cache is needed for resource in byte range. 

```
Comparison Table
ETag1, ETag2, Strong Validator, Weak Validator
W/"1", W/"1", False, True
W/"1", W/"2", False, False
W/"1", "1", False, True
"1", "1", True, True
```

It always fail if weak eTag is compared by strong validator.

Conditional request header for `ETag`
- `If-Match`
   Using strong validator. Weak eTag never be matched.
   Condition is that the validator compares and determines that ETag from the header and ETag from the resource are matched.
   If the condition is meet (matched), process the subsequent and send back the resource.
   If the condition is not meet, response is `412 Precondition Failed`.
   In conjunction with non-safe methods, such as POST, it is concurrency control to avoid conflicts.
   In conjunction with a range request, it can ensure that fragment is come from unmodified resource.
   Wildcard `*` always pass the validation except the resource is not existed.
   Request header `If-Unmodified-Since` is ignored.
- `If-None-Match`
   Using weak validator.
   Condition is that the validator compares and determines that ETag from the header and ETag from the resource are NOT matched.
   If the condition is meet (NOT matched), process the subsequent and send back the resource.
   If the condition is not meet, response is either `304 Not Modified` for `GET` or `HEAD` method or `412 Precondition Failed` for other methods.
   For `GET` or `HEAD`, it is used to revalidate the cache.
   For other methods, wildcard `*` can ensure the resource is not existed to prevent overridden.
   Request header `If-Modified-Since` is ignored.

> `If-Match` and `If-None-Match` allow multiple eTag value with comma-separated. 
> `If-Match` condition is meet if one of the eTag is passed.
> `If-None-Match` condition is meet if all eTags are failed.

## Clear Cache

We can request browser to clear stored data that is come from our origin via response header `Clear-Site-Data`.

`Clear-Site-Data` runs on HTTPS only and its value accepts following directives in comma-separated format.
- `cache`: remove locally cached data
- `cookies`: remove all cookies for the origin
- `storage`: 
  - execute `localStorage.clear`, `sessionStorage.clear`, `ServiceWorkerRegistration.unregister` and `IDBFactory.deleteDatabase`. 
  - delete data of [FileSystem API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API)
  - Firefox delete plugin data via [NPAPI:ClearSiteData](https://wiki.mozilla.org/NPAPI:ClearSiteData)
- `*`: include all directives above.

Examples: `Clear-Site-Data: "cache", "cookies"`, `Clear-Site-Data: "*"`

## Conclusion

`Cache-Control` header defines when the cache is expired. 
Cache revalidation methods, `ETag` or `Last-Modified`, are used to validate the cache which is either latest or not.

## Reference

- [RFC 5861 HTTP Cache-Control Extensions for Stale Content](https://tools.ietf.org/html/rfc5861)
- [RFC 7233 Hypertext Transfer Protocol (HTTP/1.1): Range Requests](https://tools.ietf.org/html/rfc7233)
- [RFC 7234 Hypertext Transfer Protocol (HTTP/1.1): Caching](https://tools.ietf.org/html/rfc7234)
- [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [HTTP Header: Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
- [HTTP Header: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Prevent unnecessary network requests with the HTTP Cache](https://web.dev/http-cache/)
- [循序漸進理解 HTTP Cache 機制](https://blog.techbridge.cc/2017/06/17/cache-introduction/)
