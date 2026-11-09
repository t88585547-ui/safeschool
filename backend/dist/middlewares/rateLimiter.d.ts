/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Auth rate limiter: 10 login attempts per 15 minutes per IP.
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * SOS rate limiter: 5 SOS reports per 5 minutes per IP.
 */
export declare const sosLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * IoT webhook rate limiter: 60 requests per minute per IP.
 */
export declare const iotLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.d.ts.map