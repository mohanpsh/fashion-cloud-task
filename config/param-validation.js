import Joi from 'joi';

export default {
  // POST /api/cache
  createCache: {
    body: {
      key: Joi.string().required(),
      value: Joi.string().required()
    }
  }
};
