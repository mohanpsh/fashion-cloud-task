import Cache from '../models/cache.model';
import config from '../../config/config';

const randomString = require('random-string');

/**
 * Load cache and append to req.
 */
function load(req, res, next, key) {
  Cache.get(key)
    .then((cache) => {
      req.cache = cache;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get cache
 * @returns {Cache}
 */
function get(req, res) {
  let cache = req.cache;
  if (cache) { // Here we find cache,we print cache hit
    console.log('Cache hit');
    return res.json(cache);
  } else { // We not find cache, we print cache miss and add cache
    console.log('Cache Miss');
    // create a random string and create cache
    const randomValue = randomString({ length: config.rand_str_len });
    // save in cache
    cache = saveNewCache(cache, req.params.cacheKey, randomValue).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.send(err);
    });
  }
  return cache;
}

/**
 * Save New cache
 * @param cache - object of cache.
 * @param key - The key of cache.
 * @param value - The value of cache.
 * @returns {Cache}
 */
function saveNewCache(cacheInput, key, value) {
  let cache = cacheInput;
  const ttl = new Date();
  ttl.setSeconds(ttl.getSeconds() + config.ttl_sec);
  const cachePromise = new Promise((resolve) => {
    // we count current stored cache
    Cache.count({})
    .then((number) => {
      if (number >= config.max_record) {
        // if cache are already stored max, We just replace cache values and incerement TTL
        cache = Cache.find()
        .sort({ timeToLive: 1 })
        .limit(1)
        .exec()
        .then((cacheResult) => {
          const cacheRes = cacheResult[0];
          cacheRes.key = key;
          cacheRes.value = value;
          cacheRes.timeToLive = ttl;
          cacheRes.save()
            .then(savedCache => resolve(savedCache));
        });
      } else {
        // we Add new Cache
        const resCache = new Cache({
          key: key,
          value: value,
          timeToLive : ttl
        });
        resCache.save()
          .then(savedCache => resolve(savedCache));
      }
    });
  });
  
  return cachePromise;
}

/**
 * Create new cache
 * @property {string} req.body.key - The key of cache.
 * @property {string} req.body.value - The value of cache.
 * @returns {Cache}
 */
function create(req, res, next) {
  const key = req.body.key;
  const value = req.body.value;
  const ttl = new Date();
  ttl.setSeconds(ttl.getSeconds() + config.ttl_sec);
  Cache.get(key)
    .then((cache) => {
      if (cache) {
        // we update cache if already exists and increase TTL
        cache.value = value;
        cache.timeToLive = ttl;
        cache.save()
          .then(savedCache => res.json(savedCache))
          .catch(e => next(e));
      } else {
        // create new cache
        cache = saveNewCache(cache, key, value).then((result) => {
          res.send(result);
        }).catch((err) => {
          res.send(err);
        });
      }
    });
}

/**
 * Get cache list.
 * @returns {Cache[]}
 */
function list(req, res, next) {
  Cache.list()
    .then((caches) => {
      const jobs = [];
      caches.forEach((cache) => {
        jobs.push(checkCacheTTL(cache));
      });
      return Promise.all(jobs);
    }).then((listOfJobs) => {
      res.send(listOfJobs);
    })
    .catch(e => next(e));
}

// While returnning Cache, we check TTL is expire or not
function checkCacheTTL(cache) {
  const cachePromise = new Promise((resolve) => {
    if (new Date() > cache.timeToLive) {
      // If TTL exceed we update the value
      cache.value = randomString({ length: config.rand_str_len });
    }
    const ttl = new Date();
    ttl.setSeconds(ttl.getSeconds() + config.ttl_sec);
    cache.timeToLive = ttl;
    cache.save()
      .then((savedCache) => {
        resolve(savedCache);
      });
  });
  return cachePromise;
}

/**
 * Delete cache.
 * @returns {status}
 */
function remove(req, res, next) {
  const cache = req.cache;
  if (cache) { // Here we find cache,we print cache hit
    cache.remove()
      .then(deletedCache => res.json({ 'message': 'Cache deleted successfully.' }))
      .catch(e => next(e));
  } else { // We not find cache, we print cache miss and add cache
    res.json({ 'message': 'Cache not found.' });
  }
}

/**
 * Delete all cache.
 * @returns {status}
 */
function removeAll(req, res, next) {
  Cache.remove({})
    .then(deletedCache => res.json({ 'message': 'All cache deleted successfully.' }))
    .catch(e => next(e));
}

export default { load, get, create, list, remove, removeAll };
