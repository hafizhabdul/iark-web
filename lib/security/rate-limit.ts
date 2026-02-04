/**
 * Simple In-Memory Rate Limiter (Sliding Window)
 * NOTE: This will reset on server restart and is per-instance.
 * For production, consider using Upstash Redis or a similar shared store.
 */

interface RateLimitInfo {
    count: number;
    reset: number;
}

const cache = new Map<string, RateLimitInfo>();

export interface RateLimitConfig {
    limit: number;      // Maximum number of requests
    windowMs: number;  // Window size in milliseconds
}

export function rateLimit(ip: string, config: RateLimitConfig) {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let info = cache.get(ip);

    // If no entry or the record is from a previous window, reset it
    if (!info || info.reset < windowStart) {
        info = {
            count: 1,
            reset: now + config.windowMs
        };
    } else {
        info.count++;
    }

    cache.set(ip, info);

    return {
        success: info.count <= config.limit,
        limit: config.limit,
        remaining: Math.max(0, config.limit - info.count),
        reset: info.reset
    };
}
