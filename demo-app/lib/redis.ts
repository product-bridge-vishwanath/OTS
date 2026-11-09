import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 2,
    // Connect on first command, not at import — keeps builds and Redis-less
    // boots quiet. Callers already treat Redis as optional.
    lazyConnect: true,
  });

// Without a listener, a Redis outage crashes the process with an unhandled
// 'error' event instead of degrading to cache misses.
redis.on("error", (err) => {
  console.error(`redis.error ${err.message}`);
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
