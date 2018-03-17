import express from 'express';
import cacheCtrl from '../controllers/cache.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:cacheKey')
  /** GET /api/cache/:cacheKey - Get cache */
  .get(cacheCtrl.get);

export default router;
