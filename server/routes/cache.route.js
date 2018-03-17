import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import cacheCtrl from '../controllers/cache.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/cache - Get list of all caches */
  .get(cacheCtrl.list)

  /** POST /api/cache - Create new cache/Update a cache */
  .post(validate(paramValidation.createCache), cacheCtrl.create)

  /** DELETE /api/cache - Delete all cache */
  .delete(cacheCtrl.removeAll);

router.route('/:cacheKey')
  /** GET /api/cache/:cacheKey - Get cache */
  .get(cacheCtrl.get)

  /** DELETE /api/cache/:cacheKey - Delete cache */
  .delete(cacheCtrl.remove);

/** Load cache when API with cacheKey route parameter is hit */
router.param('cacheKey', cacheCtrl.load);

export default router;
