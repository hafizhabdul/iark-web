/**
 * Simple In-Memory Rate Limiter (Sliding Window)
 *
 * NOTE: This will reset on server restart and is per-instance.
 * For production with multiple instances, consider using Upstash Redis
 * or a similar shared store (@upstash/ratelimit).
 *
 * This implementation uses atomic check-and-increment to prevent
 * race conditions within a single process.
 */

interface RateLimitInfo {
    count: number;
    resetAt: number;    // timestamp when this window expires
}

const cache = new Map<string, RateLimitInfo>();

// Periodic cleanup to prevent memory leaks (every 60 seconds)
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, info] of cache) {
            if (info.resetAt < now) {
                cache.delete(key);
            }
        }
        // Stop interval if cache is empty
        if (cache.size === 0 && cleanupInterval) {
            clearInterval(cleanupInterval);
            cleanupInterval = null;
        }
    }, 60_000);

    // Don't prevent Node.js from exiting
    if (cleanupInterval && typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
        cleanupInterval.unref();
    }
}

export interface RateLimitConfig {
    limit: number;      // Maximum number of requests
    windowMs: number;   // Window size in milliseconds
}

/**
 * Check and increment rate limit for the given key.
 * The check-and-increment is atomic within a single Node.js process
 * (synchronous Map operations cannot be interleaved).
 */
export function rateLimit(key: string, config: RateLimitConfig) {
    const now = Date.now();

    // Atomic read-check-write (synchronous, no await between read and write)
    let info = cache.get(key);

    // If no entry or window has expired, start a new window
    if (!info || info.resetAt <= now) {
        info = {
            count: 1,
            resetAt: now + config.windowMs,
        };
        cache.set(key, info);
        ensureCleanup();
    } else {
        // Increment within the current window
        info.count++;
    }

    return {
        success: info.count <= config.limit,
        limit: config.limit,
        remaining: Math.max(0, config.limit - info.count),
        reset: info.resetAt,
    };
}
