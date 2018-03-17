import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Cache APIs', () => {
  let cache = {
    key: 'mps123',
    value: 'Mohan123'
  };

  describe('# POST /api/cache', () => {
    it('should create a new cache', (done) => {
      request(app)
        .post('/api/cache')
        .send(cache)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.key).to.equal(cache.key);
          expect(res.body.value).to.equal(cache.value);
          cache = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/cache/:cacheKey', () => {
    it('should get cache details', (done) => {
      request(app)
        .get(`/api/cache/${cache.key}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.key).to.equal(cache.key);
          expect(res.body.value).to.equal(cache.value);
          done();
        })
        .catch(done);
    });

    it('should create new cache, when cache does not exists', (done) => {
      const randomKey = '56c787ccc67fc16ccc1a5e92';
      request(app)
        .get(`/api/cache/${randomKey}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.key).to.equal(randomKey);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/cache/', () => {
    it('should get all caches', (done) => {
      request(app)
        .get('/api/cache')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/cache/:cacheKey', () => {
    it('should delete cache', (done) => {
      request(app)
        .delete(`/api/cache/${cache.key}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('object');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/cache/', () => {
    it('should delete all cache', (done) => {
      request(app)
        .delete('/api/cache')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('object');
          done();
        })
        .catch(done);
    });
  });
});
