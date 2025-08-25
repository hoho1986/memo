# HTTP Methods

## List Of The Methods 
- `GET`: Requests a representation of the specified resource and only retrieve data.
- `HEAD`: Requests for a status of a GET request. Send back same status and response headers of GET method but without the response body.
- `POST`: Use to submit an entity to the specified resource, often causing a change in state or side effects on the server.
- `PUT`: Replaces all current representations of the target resource with the request payload.
- `PATCH`: Used to apply partial modifications to a resource. 
- `DELETE`: Deletes the specified resource.
- `OPTIONS`: Used to describe the communication options for the target resource.
- `CONNECT`: Establishes a tunnel to the server identified by the target resource.
- `TRACE`: Performs a message loop-back test along the path to the target resource.

## Characteristic Of The Methods

- Safe Methods:  No side effect. In general, read only operation.
  - `GET`
  - `HEAD`
  - `OPTIONS`
  - `TRACE`
- Idempotent Methods: Get same result\* whatever how many time you have done. Safe for retry.
  - `GET`
  - `HEAD`
  - `PUT`
  - `DELETE`
  - `OPTIONS`  
  - `TRACE`
- Cacheable Methods\*\*: Responses are allowed to be stored for future reuse.
  - `GET`
  - `HEAD`
  - `POST`\*\*\*
  - `PATCH`\*\*\*
- Request Has Body: 
  - `POST`
  - `PUT`
  - `PATCH`
  - `DELETE` (May)
  - `OPTIONS` (May)
- Response Has Body (Successful): 
  - `GET`
  - `POST`
  - `TRACE`
  - `PUT` (May)
  - `PATCH` (May)
  - `DELETE` (May)
  - `OPTIONS` (May)  
- Used in HTML Form: 
  - `GET`
  - `POST`

> \* When running multiple time of delete requests, the response may be difference due to the resource has already been deleted.
> Although the response is different, the end result, that the specified resource has been deleted, is the same.
>
> \*\* Cacheable is effective only if response header do not limit caching and 
> status code is one of the following: 200, 203, 204, 206, 300, 301, 404, 405, 410, 414 and 501.
>
> \*\*\* It is rare case and cacheable only if cache contorl heaaders are included and response header `Content-Location` is set.

## Reference

- [HTTP/1.1 Semantics and Content - Section 4](https://datatracker.ietf.org/doc/html/rfc7231#section-4)