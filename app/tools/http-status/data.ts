export type StatusCategory = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

export type HttpStatus = {
  code: number;
  name: string;
  description: string;
  category: StatusCategory;
  useCase: string;
};

export const STATUS_CATEGORIES: ("All" | StatusCategory)[] = [
  "1xx",
  "2xx",
  "3xx",
  "4xx",
  "5xx",
  "All",
];

export const STATUS_CATEGORY_LABELS: Record<StatusCategory, string> = {
  "1xx": "1xx Informational",
  "2xx": "2xx Success",
  "3xx": "3xx Redirect",
  "4xx": "4xx Client Error",
  "5xx": "5xx Server Error",
};

export const CATEGORY_STYLES: Record<
  StatusCategory,
  { card: string; code: string; badge: string }
> = {
  "1xx": {
    badge: "border-border bg-muted/20 text-muted-foreground",
    card: "border-muted-foreground/30 hover:border-muted-foreground hover:shadow hover:shadow-muted-foreground",
    code: "text-muted-foreground",
  },
  "2xx": {
    badge: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    card: "border-emerald-500/30 hover:border-emerald-400 hover:shadow hover:shadow-emerald-400",
    code: "text-emerald-400",
  },
  "3xx": {
    badge: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    card: "border-blue-500/30 hover:border-blue-400 hover:shadow hover:shadow-blue-400",
    code: "text-blue-400",
  },
  "4xx": {
    badge: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    card: "border-amber-500/30 hover:border-amber-400 hover:shadow hover:shadow-amber-400",
    code: "text-amber-400",
  },
  "5xx": {
    badge: "border-rose-500/30 bg-rose-500/5 text-rose-400",
    card: "border-rose-500/30 hover:border-rose-400 hover:shadow hover:shadow-rose-400",
    code: "text-rose-400",
  },
};

export const HTTP_STATUS_CODES: HttpStatus[] = [
  // 1xx Informational
  {
    category: "1xx",
    code: 100,
    description:
      "The server has received the request headers and the client should proceed to send the request body.",
    name: "Continue",
    useCase: "Used with Expect: 100-continue header before sending large payloads.",
  },
  {
    category: "1xx",
    code: 101,
    description:
      "The requester has asked the server to switch protocols and the server has agreed to do so.",
    name: "Switching Protocols",
    useCase: "WebSocket upgrade from HTTP to WS protocol.",
  },
  {
    category: "1xx",
    code: 102,
    description:
      "The server has received and is processing the request, but no response is available yet.",
    name: "Processing",
    useCase: "Long-running operations like file uploads or complex database migrations.",
  },
  {
    category: "1xx",
    code: 103,
    description:
      "Allows user agents to preload resources while the server prepares the final response.",
    name: "Early Hints",
    useCase: "Preloading critical CSS/JS resources to improve page load time.",
  },

  // 2xx Success
  {
    category: "2xx",
    code: 200,
    description: "The request was successful and the server returned the requested resource.",
    name: "OK",
    useCase: "Standard GET response, or successful POST/PUT that returns data.",
  },
  {
    category: "2xx",
    code: 201,
    description: "The request was successful and a new resource was created as a result.",
    name: "Created",
    useCase: "Response to POST requests that create a new database record.",
  },
  {
    category: "2xx",
    code: 202,
    description:
      "The request has been accepted for processing, but the processing has not been completed.",
    name: "Accepted",
    useCase: "Async jobs: the server queued the task but hasn't finished it yet.",
  },
  {
    category: "2xx",
    code: 203,
    description: "The response is a transformed version from a third-party proxy.",
    name: "Non-Authoritative Information",
    useCase: "Proxy returned modified metadata (e.g., a CDN adding headers).",
  },
  {
    category: "2xx",
    code: 204,
    description: "The server successfully processed the request and is not returning any content.",
    name: "No Content",
    useCase: "DELETE requests, or updates where no body needs to be returned.",
  },
  {
    category: "2xx",
    code: 205,
    description: "Tells the user agent to reset the document which sent the request.",
    name: "Reset Content",
    useCase: "Form submission — tell the browser to clear the form after success.",
  },
  {
    category: "2xx",
    code: 206,
    description: "The server is delivering only part of the resource due to a Range header.",
    name: "Partial Content",
    useCase: "Video streaming, resumable downloads, and range requests.",
  },
  {
    category: "2xx",
    code: 207,
    description: "Conveys information about multiple resources in a single response.",
    name: "Multi-Status",
    useCase: "WebDAV bulk operations; batch API responses with mixed results.",
  },
  {
    category: "2xx",
    code: 208,
    description:
      "Used in a DAV binding, to avoid repeatedly enumerating the internal members of multiple bindings.",
    name: "Already Reported",
    useCase: "WebDAV — prevents duplicate entries in multi-status responses.",
  },
  {
    category: "2xx",
    code: 226,
    description:
      "The server has fulfilled a GET request and the response is a representation of the result of one or more instance-manipulations.",
    name: "IM Used",
    useCase: "HTTP delta encoding (RFC 3229) — rarely used in practice.",
  },

  // 3xx Redirect
  {
    category: "3xx",
    code: 300,
    description:
      "The request has more than one possible response. The user-agent should choose one.",
    name: "Multiple Choices",
    useCase: "Content negotiation — multiple formats or languages available.",
  },
  {
    category: "3xx",
    code: 301,
    description: "The URL of the requested resource has been changed permanently.",
    name: "Moved Permanently",
    useCase: "Permanent URL redirects, SEO-friendly migrations from old URLs.",
  },
  {
    category: "3xx",
    code: 302,
    description: "The URI of requested resource has been changed temporarily.",
    name: "Found",
    useCase: "Temporary redirects, post-login redirects, feature flags.",
  },
  {
    category: "3xx",
    code: 303,
    description:
      "The server directs the client to get the requested resource at another URI with a GET request.",
    name: "See Other",
    useCase: "POST/Redirect/GET pattern to prevent form resubmission.",
  },
  {
    category: "3xx",
    code: 304,
    description:
      "The resource has not been modified since the version specified in If-Modified-Since.",
    name: "Not Modified",
    useCase: "Browser caching — tells the client to use its cached version.",
  },
  {
    category: "3xx",
    code: 307,
    description:
      "The request should be repeated with another URI, but future requests should still use the original URI.",
    name: "Temporary Redirect",
    useCase: "Temporary redirects that preserve the HTTP method (unlike 302).",
  },
  {
    category: "3xx",
    code: 308,
    description: "The request and all future requests should be repeated using another URI.",
    name: "Permanent Redirect",
    useCase: "Like 301, but explicitly preserves the HTTP method and body.",
  },

  // 4xx Client Error
  {
    category: "4xx",
    code: 400,
    description:
      "The server cannot process the request due to a client error such as malformed syntax.",
    name: "Bad Request",
    useCase: "Invalid JSON body, missing required fields, or malformed query params.",
  },
  {
    category: "4xx",
    code: 401,
    description: "Authentication is required and has failed or has not yet been provided.",
    name: "Unauthorized",
    useCase: "Missing or invalid authentication token (e.g., expired JWT).",
  },
  {
    category: "4xx",
    code: 402,
    description: "Reserved for future use; some APIs use it for subscription or quota issues.",
    name: "Payment Required",
    useCase: "Paywall — user's free tier is exhausted or subscription is unpaid.",
  },
  {
    category: "4xx",
    code: 403,
    description: "The server understood the request but refuses to authorize it.",
    name: "Forbidden",
    useCase: "Authenticated but lacks permission (RBAC — wrong role or scope).",
  },
  {
    category: "4xx",
    code: 404,
    description: "The server cannot find the requested resource.",
    name: "Not Found",
    useCase: "Resource does not exist, or is intentionally hidden for security.",
  },
  {
    category: "4xx",
    code: 405,
    description:
      "The request method is known by the server but is not supported by the target resource.",
    name: "Method Not Allowed",
    useCase: "Sending POST to a read-only endpoint, or DELETE to a create-only endpoint.",
  },
  {
    category: "4xx",
    code: 406,
    description: "The server cannot produce a response matching the Accept headers in the request.",
    name: "Not Acceptable",
    useCase: "Client requests XML but the API only returns JSON.",
  },
  {
    category: "4xx",
    code: 407,
    description: "Authentication is required to use the proxy.",
    name: "Proxy Authentication Required",
    useCase: "Corporate proxy requiring authentication before forwarding requests.",
  },
  {
    category: "4xx",
    code: 408,
    description: "The server timed out waiting for the request.",
    name: "Request Timeout",
    useCase: "Client took too long to send the full request body.",
  },
  {
    category: "4xx",
    code: 409,
    description: "The request conflicts with the current state of the server.",
    name: "Conflict",
    useCase: "Duplicate resource creation, version conflicts in optimistic locking.",
  },
  {
    category: "4xx",
    code: 410,
    description: "The resource requested is no longer available and will not be available again.",
    name: "Gone",
    useCase: "Permanently deleted resources — a stronger signal than 404.",
  },
  {
    category: "4xx",
    code: 411,
    description: "The request did not specify the length of its content.",
    name: "Length Required",
    useCase: "Server requires Content-Length header for POST/PUT requests.",
  },
  {
    category: "4xx",
    code: 412,
    description:
      "The server does not meet one of the preconditions the requester put on the request.",
    name: "Precondition Failed",
    useCase: "Conditional updates (If-Match) failing due to stale ETag.",
  },
  {
    category: "4xx",
    code: 413,
    description: "The request entity is larger than limits defined by the server.",
    name: "Content Too Large",
    useCase: "File upload exceeds the server's maximum allowed size.",
  },
  {
    category: "4xx",
    code: 414,
    description:
      "The URI requested by the client is longer than the server is willing to interpret.",
    name: "URI Too Long",
    useCase: "Extremely long query strings or base64-encoded data in URLs.",
  },
  {
    category: "4xx",
    code: 415,
    description: "The media format of the requested data is not supported by the server.",
    name: "Unsupported Media Type",
    useCase: "Sending text/plain to an endpoint that only accepts application/json.",
  },
  {
    category: "4xx",
    code: 416,
    description: "The range specified in the Range header cannot be fulfilled.",
    name: "Range Not Satisfiable",
    useCase: "Client requested a byte range beyond the end of the file.",
  },
  {
    category: "4xx",
    code: 417,
    description: "The server cannot meet the requirements of the Expect request-header field.",
    name: "Expectation Failed",
    useCase: "Server doesn't support the Expect: 100-continue handshake.",
  },
  {
    category: "4xx",
    code: 418,
    description: "The server refuses to brew coffee because it is, permanently, a teapot.",
    name: "I'm a Teapot",
    useCase: "April Fools' RFC 2324. Used humorously in developer APIs.",
  },
  {
    category: "4xx",
    code: 422,
    description:
      "The server understands the content type but was unable to process the contained instructions.",
    name: "Unprocessable Entity",
    useCase: "Validation errors — request is well-formed but semantically incorrect.",
  },
  {
    category: "4xx",
    code: 423,
    description: "The resource that is being accessed is locked.",
    name: "Locked",
    useCase: "WebDAV — resource is checked out or has an exclusive lock.",
  },
  {
    category: "4xx",
    code: 424,
    description: "The request failed because it depended on another request that failed.",
    name: "Failed Dependency",
    useCase: "WebDAV batch operations where a preceding operation failed.",
  },
  {
    category: "4xx",
    code: 425,
    description:
      "Indicates that the server is unwilling to risk processing a request that might be replayed.",
    name: "Too Early",
    useCase: "TLS 1.3 early data (0-RTT) is not safe to act upon for this request.",
  },
  {
    category: "4xx",
    code: 426,
    description: "The client should switch to a different protocol such as TLS/1.3.",
    name: "Upgrade Required",
    useCase: "Server requires the client to upgrade to a newer protocol version.",
  },
  {
    category: "4xx",
    code: 428,
    description: "The origin server requires the request to be conditional.",
    name: "Precondition Required",
    useCase: "Prevents the 'lost update problem' — ETag or Last-Modified must be provided.",
  },
  {
    category: "4xx",
    code: 429,
    description: "The user has sent too many requests in a given amount of time (rate limiting).",
    name: "Too Many Requests",
    useCase: "API rate limiting — include Retry-After header with the response.",
  },
  {
    category: "4xx",
    code: 431,
    description:
      "The server is unwilling to process the request because its header fields are too large.",
    name: "Request Header Fields Too Large",
    useCase: "Oversized cookies or authorization headers exceeding server limits.",
  },
  {
    category: "4xx",
    code: 451,
    description: "The user requested a resource that cannot legally be provided.",
    name: "Unavailable For Legal Reasons",
    useCase: "GDPR data removal, DMCA takedowns, government censorship.",
  },

  // 5xx Server Error
  {
    category: "5xx",
    code: 500,
    description:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    name: "Internal Server Error",
    useCase: "Unhandled exceptions, database errors, or misconfigured servers.",
  },
  {
    category: "5xx",
    code: 501,
    description: "The server does not support the functionality required to fulfill the request.",
    name: "Not Implemented",
    useCase: "HTTP method not implemented (e.g., server doesn't support PATCH).",
  },
  {
    category: "5xx",
    code: 502,
    description:
      "The server, while acting as a gateway, received an invalid response from an upstream server.",
    name: "Bad Gateway",
    useCase: "Reverse proxy (Nginx/ALB) can't reach the upstream app server.",
  },
  {
    category: "5xx",
    code: 503,
    description:
      "The server is not ready to handle the request — overloaded or down for maintenance.",
    name: "Service Unavailable",
    useCase: "Planned maintenance windows or traffic spikes overwhelming the server.",
  },
  {
    category: "5xx",
    code: 504,
    description:
      "The server, acting as a gateway, did not receive a timely response from upstream.",
    name: "Gateway Timeout",
    useCase: "Upstream service too slow — database query timeout, slow microservice.",
  },
  {
    category: "5xx",
    code: 505,
    description: "The server does not support the HTTP version used in the request.",
    name: "HTTP Version Not Supported",
    useCase: "Client sends HTTP/2 to a server that only handles HTTP/1.1.",
  },
  {
    category: "5xx",
    code: 506,
    description: "Indicates an internal server configuration error in content negotiation.",
    name: "Variant Also Negotiates",
    useCase: "Misconfigured transparent content negotiation (RFC 2295).",
  },
  {
    category: "5xx",
    code: 507,
    description:
      "The method could not be performed on the resource because the server is unable to store the representation.",
    name: "Insufficient Storage",
    useCase: "WebDAV — disk full; can't save the uploaded file.",
  },
  {
    category: "5xx",
    code: 508,
    description: "The server detected an infinite loop while processing the request.",
    name: "Loop Detected",
    useCase: "WebDAV PROPFIND or COPY with infinite-depth detecting circular references.",
  },
  {
    category: "5xx",
    code: 510,
    description: "Further extensions to the request are required for the server to fulfill it.",
    name: "Not Extended",
    useCase: "HTTP Extension Framework (RFC 2774) — rare in practice.",
  },
  {
    category: "5xx",
    code: 511,
    description: "The client needs to authenticate to gain network access.",
    name: "Network Authentication Required",
    useCase: "Captive portals — hotel Wi-Fi requiring login before internet access.",
  },
];
