import Cache from '../models/cache.model';

let randomString = require('random-string');

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
  if (cache) {
    console.log('Cache hit');
    return res.json(cache);
  } else {
    console.log('Cache Miss');
    // create a random string and create cache
    let randomstring = randomString({length: 20});
    cache = new Cache({
      key: req.params.cacheKey,
      value: randomstring
    });
    cache.save()
      .then(savedCache => res.json(savedCache));
  }
  return cache;
}

/**
 * Create new cache
 * @property {string} req.body.key - The key of cache.
 * @property {string} req.body.value - The value of cache.
 * @returns {Cache}
 */
function create(req, res, next) {
  let key = req.body.key;
  let value = req.body.value;
  Cache.get(key)
    .then((cache,err) => {
      if(cache) {
        // we update cache if already exists
        cache.value = value;
        cache.save()
          .then(savedCache => res.json(savedCache))
          .catch(e => next(e));
      } else {
        // create new cache
        const cache = new Cache({
          key: key,
          value: value
        });
        cache.save()
          .then(savedCache => res.json(savedCache))
          .catch(e => next(e));
      }
    })
}

/**
 * Get cache list.
 * @returns {Cache[]}
 */
function list(req, res, next) {
  Cache.list()
    .then(caches => res.json(caches))
    .catch(e => next(e));
}

/**
 * Delete cache.
 * @returns {status}
 */
function remove(req, res, next) {
  const cache = req.cache;
  cache.remove()
    .then(deletedCache => res.json({ 'message':'Cache deleted successfully.' }))
    .catch(e => next(e));
}

/**
 * Delete all cache.
 * @returns {status}
 */
function removeAll(req, res, next) {
  Cache.remove({})
    .then(deletedCache => res.json({ 'message':'All cache deleted successfully.' }))
    .catch(e => next(e));
}

export default { load, get, create, list, remove, removeAll };
