# PHP 8.5 New Features

## URI Extensions

Before PHP 8.5, use [`parse_url()`](https://www.php.net/manual/en/function.parse-url.php) to get an array with all components or select one of it.

Implementations: [uriparser (RFC 3986)](https://uriparser.github.io/), [Lexbor (WHATWG)](https://lexbor.com/)

The classes' details can be retrieved [here](https://wiki.php.net/rfc/url_parsing_api#proposal).

```
use Uri\Rfc3986\Uri;
use Uri\WhatWg\Url;

$host = new Uri('https://php.net/releases/8.5/en.php');
var_dump($uri->getHost()); // string(7) "php.net"
$host = new Url('https://php.net/releases/8.5/en.php');
var_dump($uri->getHost()); // string(7) "php.net"

```

## Pipe Operator

It allows chaining function calls together without dealing with intermediary variables.
This enables replacing many "nested calls" with a chain that can be read forwards, rather than inside-out.

Reference: 
- [https://thephp.foundation/blog/2025/07/11/php-85-adds-pipe-operator/](https://thephp.foundation/blog/2025/07/11/php-85-adds-pipe-operator/)
- -[https://www.php.net/manual/en/language.operators.functional.php](https://www.php.net/manual/en/language.operators.functional.php)

```
$title = ' PHP 8.5 Released ';

// PHP <=8.4
$slug = strtolower(
    str_replace('.', '',
        str_replace(' ', '-',
            trim($title)
        )
    )
);

// Since PHP 8.5
$slug = $title
    |> trim(...)
    |> (fn($str) => str_replace(' ', '-', $str))
    |> (fn($str) => str_replace('.', '', $str))
    |> strtolower(...);

var_dump($slug); // string(15) "php-85-released"

```

## Clone function for cloning object

It can copy properties and change some properties with passing a associative array as parameter.
It is useful for cloning new object from an immutable object via withSomething pattern.

Reference: [https://wiki.php.net/rfc/clone_with_v2](https://wiki.php.net/rfc/clone_with_v2)

```
readonly class Color {
    public function __construct(
        public int $red,
        public int $green,
        public int $blue,
        public int $alpha = 255,
    ) {}

    public function withAlpha(int $alpha):self{
    
        // Using clone function since PHP 8.5
        return clone($this, [
            'alpha' => $alpha,
        ]);
        
        // For <= PHP 8.4
        $values = get_object_vars($this);
        $values['alpha'] = $alpha;
        return new self(...$values);
    }
}

$blue = new Color(79, 91, 147);
$transparentBlue = $blue->withAlpha(128);
```

## #[\NoDiscard] Attribute

Use to prevent losing costly or important value.

```
#[\NoDiscard]
function getPhpVersion():string{
    return 'PHP 8.5';
}
getPhpVersion(); // Trigger Warning
(void) getPhpVersion(); // No Warning. Return value is consumed by (void) cast.
```

## Closures and First-Class Callables in Constant Expressions

> Closure is an anonymous function.
> First-Class Callable is a valid callable followed by `(...)`.

Static closures and first-class callables can be used in constant expressions which include 
- attribute parameters,
- default values of properties & parameters, and 
- constants.

```
final class PostsController {
    #[AccessControl(static function (
        Request $request,
        Post $post,
    ): bool {
        return $request->user === $post->getAuthor();
    })]
    public function update(
        Request $request,
        Post $post,
    ):Response {
        // ...
    }
}
```

## Persistent cURL Share Handles

Before PHP 8.5, shared CURL handle will be destoryed at the end of the PHP request. 
Since PHP 8.5, use `curl_share_init_persistent()`, and it will be reused for same options is found for avoiding initization cost.

```
$sh = curl_share_init_persistent([
    CURL_LOCK_DATA_DNS,
    CURL_LOCK_DATA_CONNECT,
]);

$ch = curl_init('https://php.net/');
curl_setopt($ch, CURLOPT_SHARE, $sh);

// This may now reuse the connection from an earlier SAPI request
curl_exec($ch);
```

## `array_first()` and `array_last()`

New `array_first()` and `array_last()` functions return the first or last value respectively of an array and return null for empty array.

```
$event = array_last($events);
$event = $events===[]?null:$events[array_key_last($events)]; // Before PHP 8.5

$event = array_first($events);
$event = $events===[]?null:$events[array_key_first($events)]; // Before PHP 8.5
```

## Miscellaneous

### Attributes
- Attributes can now target constants.
- [`#[\Override]`](https://www.php.net/manual/en/class.override.php) can now be applied to properties.
- [`#[\Deprecated]`](https://www.php.net/manual/en/class.deprecated.php) can be used on traits and constants.
- `#[\DelayedTargetValidation]` can be used to suppress compile-time errors from core and extension attributes that are used on invalid targets.

### Class
- Static properties now support asymmetric visibility.
- Properties can be marked as `final` using constructor property promotion.

### Update on functions or methods
- Update [`setcookie()`](https://www.php.net/manual/en/function.setcookie.php) and [`setrawcookie()`](https://www.php.net/manual/en/function.setrawcookie.php) to support the "partitioned" key. Reference: [Cookies Having Independent Partitioned State aka. Partitioned cookies](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)
- Added [`Closure::getCurrent()`](https://www.php.net/manual/en/closure.getcurrent.php) to simplify recursion in anonymous functions.
- Added [`get_error_handler()`](https://www.php.net/manual/en/function.get-error-handler.php), [`get_exception_handler()`](https://www.php.net/manual/en/function.get-exception-handler.php) and `grapheme_levenshtein()`.
- New `Dom\Element::getElementsByClassName()` and `Dom\Element::insertAdjacentHTML()`

### Others
- Fatal Errors (such as an exceeded maximum execution time) now include a backtrace.

## Reference
- [https://www.php.net/releases/8.5/en.php](https://www.php.net/releases/8.5/en.php)