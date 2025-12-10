import logger from "../config/logger.js";
import RedisClient from "../config/redis.js"; 
  async function getDataFromRedis(key){
    try {
     
      if (!key) throw new Error("Key is required");
      const data = await RedisClient.get(key);
      console.log("data",data);
      
     return data?JSON.parse(data):null;
    } catch (error) {
        logger.error(error.message);
    }
}

async function setDataInRedis(key,value,ttlSeconds = 5 * 60){
    try {
       if (!key) throw new Error("Key is required");
    if (value==undefined ||value==null) throw new Error("Value is required");
        await RedisClient.set(key,JSON.stringify(value),"EX",ttlSeconds);
    } catch (error) {
        logger.error(error.message); 
    }
} 
async function invalidateByPrefix(prefix) {
  const keys = await RedisClient.keys(`${prefix}*`);
  if (keys.length) await RedisClient.del(...keys);
}

async function InvalidateCache(key){
 try {
   if (!key) throw new Error("Key is required");
    await RedisClient.del(key);
 } catch (error) {
    logger.error(error.message);
 }
}

export {getDataFromRedis,setDataInRedis,invalidateByPrefix,InvalidateCache};