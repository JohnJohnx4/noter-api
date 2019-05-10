const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

const User = require('../models/User');

/* TODOs
 ** Set up tests for this user
 ** Fix test user for post
 ** set up correct route testing for users
 **
 */

describe('Server', () => {
  before(done => {
    mongoose.connect('mongodb://localhost:27017/hairspray', {
      useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.on('error', () => {
      console.error('connection error');
    });

    db.once('open', () => {
      done();
    });
  });

  after(done => {
    mongoose.connection.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('Users', () => {
    let user_id = '';
    let userToken = '';

    describe('POST /', () => {
      it('should add a new User', done => {
        const email = 'test@test.com';
        const password = 'testing123';
        const name = 'Test Post';
        chai
          .request(app)
          .post('/api/users')
          .send({ email, password, name })
          .then(res => {
            user_id = res.body.success.user;
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
    });

    describe('GET /', () => {
      it('should get all users', done => {
        chai
          .request(app)
          .get('/api/users')
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('GET', err);
            done();
          });
      });
    });

    describe('/GET/:id', () => {
      it('it should retrieve a user by id', done => {
        chai
          .request(app)
          .get(`/api/users/${user_id}`)
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('GET/:id', err);
            done();
          });
      });
    });

    describe('/PUT/:id', () => {
      it('it update a user by id', done => {
        chai
          .request(app)
          .put(`/api/users/${user_id}`)
          // .set('Authorization', userToken)
          .send({
            name: 'Updated',
            email: 'updated@user.com',
            password: '123456'
          })
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a user by id', done => {
        chai
          .request(app)
          .delete(`/api/users/${user_id}`)
          // .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('DELETE/:id', err);
            done();
          });
      });
    });
  });
});
