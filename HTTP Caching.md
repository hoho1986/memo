# HTTP Caching
## Controlling Cache
### `Cache-Control` Header
- Introduced since HTTP/1.1
- Instruct caching mechanisms in both requests and responses
- Define caching policies
#### Value
- A comma-separated list of directives
- Directive is case-insensitive (lowercase is recommended)
##### Directives
- Cacheability
    - __no-store__: Can not be stored by any cache. (max-age=0 implied)
    - __private__: [Response] Can be stored by __browser cache__ even if the response is normally non-cacheable.
    - __public__: [Response] Can be stored by __any cache__ even if the response is normally non-cacheable.
    - __no-cache__: Can be stored by __any cache__ even if the response is normally non-cacheable. However, revalidation must be done before using.
        
        > Behaviour of `Pragma: no-cache` is as same as `Cache-Control: no-cache`. Use it only for backwards compatibility with HTTP/1.0 clients.
- Expiration
    - __max-age=\<seconds\>__: [Response] It is considered fresh within specified seconds since the request is made.
    - __s-maxage=\<seconds\>__: [Response] Overrides `max-age` or the `Expires` header. Effective only for shared caches. (e.g. Proxies)
        
        > `Expires` header will be ignored if `Cache-Control` with `max-age` or `s-maxage` is existed
    - __max-stale\[=\<seconds\>\]__: Accept a stale response. An optional value in seconds indicates the upper limit of staleness will be accepted.
    - __min-fresh=\<seconds\>__: Client want a response should be freshed at least specified seconds.
    - __stale-while-revalidate=\<seconds\>__(Experimental): [Response] It should use accompany with `max-age` to specify the time that a cache will be staled. Stale response will be used while the time is within the specified seconds. Also, a revalidation request will be sent in the background asynchronously for future use. 
    - __stale-if-error=\<seconds\>__(Experimental): Client accepts a stale response within the specified seconds if it is failed to get the fresh one.
- Revalidation and reloading
    - __must-revalidate__: [Response] Stale caches must not be used unless it is validated by the origin server.
    - __proxy-revalidate__: [Response] Like `must-revalidate`. However, it is for shared cache only. (Ignored by private caches)
    - __immutable__(Experimental): [Response] The cache is never changed before it is expired(e.g. `max-age`). No conditional headers. (e.g. `If-None-Match`) HTTPS only. Firefox (Desktop) and Safari 11 are supported.
- Others
    - __no-transform__: [Response] Intermediate cache or proxy can not edit response body, `Content-Encoding`, `Content-Range`, or `Content-Type`. (e.g. Compress the images to minimize storage or transmission)
    - __only-if-cached__: [Request] Client requests stored responses or respond with `504 Gateway Timeout`. No conditional headers. (e.g. `If-None-Match`)
## Cache Validation
### `ETag`, `If-Match`, `If-None-Match` Header
### `Last-Modified`, `If-Modified-Since`, `If-Unmodified-Since` Header

## Varying Responses
### `Vary` Header
- Response header
- Response is depended on listed header names of `Vary` header
#### Value
- __\*__: It is unique and uncacheable for every request
- __\<header-name\>__: A comma-separated list of header names which affect the response content.
## Related Header
- `If-Range`
- `Range`
- `Content-Range`
## Reference
- [HTTP Header: Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
- [HTTP Header: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [RFC 7233 Hypertext Transfer Protocol (HTTP/1.1): Range Requests](https://tools.ietf.org/html/rfc7233)
- [Prevent unnecessary network requests with the HTTP Cache](https://web.dev/http-cache/)
- [循序漸進理解 HTTP Cache 機制](https://blog.techbridge.cc/2017/06/17/cache-introduction/)


A response is normally cached by the browser if:
it has a status code of 301, 302, 307, 308, or 410 and
Cache-Control does not have no-store, or if proxy, does not have private and
Authorization is unset
either
    has a status code of 301, 302, 307, 308, or 410 or
    has public, max-age or s-maxage in Cache-Control or
    has Expires set
