import Redis from "ioredis"
import config from "./env.js";

const RedisClient  = new Redis(config.redisUrl);

RedisClient.on("connect", () => {
    console.log("Redis connected");
});

RedisClient.on("error", (err) => {
    console.log("Redis error", err);
});

export default RedisClient;