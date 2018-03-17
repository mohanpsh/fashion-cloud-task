import Cache from '../models/cache.model';

/**
 * Get cache
 * @returns {Cache}
 */
function get(req, res) {
  return res.json('Get is working');
}


export default { get };
