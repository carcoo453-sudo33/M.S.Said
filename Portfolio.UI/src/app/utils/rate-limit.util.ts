/**
 * Rate limiting utility for client-side request throttling
 */
export class RateLimitUtil {
    private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

    /**
     * Check if a request should be rate limited
     * @param key Unique identifier for the rate limit bucket
     * @param maxRequests Maximum number of requests allowed in the window
     * @param windowMs Time window in milliseconds
     * @returns true if request is allowed, false if rate limited
     */
    static checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
        const now = Date.now();
        const record = this.rateLimitMap.get(key);

        if (!record || now > record.resetTime) {
            this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
            return true;
        }

        if (record.count >= maxRequests) {
            return false;
        }

        record.count++;
        return true;
    }

    /**
     * Reset rate limit for a specific key
     */
    static reset(key: string): void {
        this.rateLimitMap.delete(key);
    }

    /**
     * Clear all rate limits
     */
    static clearAll(): void {
        this.rateLimitMap.clear();
    }
}
