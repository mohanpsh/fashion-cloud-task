import express from 'express';
import cacheRoutes from './cache.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount cache routes at /cache
router.use('/cache', cacheRoutes);

export default router;
