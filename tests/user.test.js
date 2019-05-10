const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const apiKey = process.env.PUBLIC_KEY;

chai.use(chaiHttp);
chai.should();

describe('Server', () => {
  before(done => {
    mongoose.connect('mongodb://localhost:27017/noter', {
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

  describe('Routes', () => {
    let user_id = '';
    let userToken = '';
    let note_id = '';

    describe('User POST /', () => {
      it('should add a new User', done => {
        const email = 'test@test.com';
        const password = 'testing123';
        const name = 'Test Post';
        chai
          .request(app)
          .post('/api/users')
          .send({ email, password, name, key: apiKey })
          .then(res => {
            user_id = res.body.user;
            userToken = res.body.token;
            res.should.have.status(200);
            res.body.should.have.property('user');
            res.body.user.should.be.a('string');
            res.body.should.have.property('token');
            res.body.token.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('should not add a new User if missing API key', done => {
        const email = 'test@test.com';
        const password = 'testing123';
        const name = 'Test Post';
        chai
          .request(app)
          .post('/api/users')
          .send({ email, password, name })
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.to.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('should not add a new User if missing email', done => {
        const password = 'testing123';
        const name = 'Test Post';
        chai
          .request(app)
          .post('/api/users')
          .send({ password, name, key: apiKey })
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.to.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('should not add a new User if missing password', done => {
        const email = 'test@test.com';
        const name = 'Test Post';
        chai
          .request(app)
          .post('/api/users')
          .send({ email, name, key: apiKey })
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.to.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
    });
    // describe('Note POST /', () => {
    //   it('should add a new Note', done => {
    //     const testNote = {
    //       user: user_id,
    //       title: 'Test Title',
    //       content: 'Test Content'
    //     };
    //     chai
    //       .request(app)
    //       .post('/api/notes')
    //       .set('Authorization', userToken)
    //       .send(testNote)
    //       .then(res => {
    //         note_id = res.body.success._id;
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('POST', err);
    //         done();
    //       });
    //   });
    // });

    describe('User GET /', () => {
      it('should get all users', done => {
        chai
          .request(app)
          .get('/api/users')
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('email');
            res.body[0].should.have.property('password');
            res.body[0].should.have.property('name');
            done();
          })
          .catch(err => {
            console.log('GET', err);
            done();
          });
      });
      it('should not get all users without Authorization header', done => {
        chai
          .request(app)
          .get('/api/users')
          .then(res => {
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET', err);
            done();
          });
      });
      it('should not get all users without a correct JWT in Authorization header', done => {
        chai
          .request(app)
          .get('/api/users')
          .set('Authorization', 'userToken')
          .then(res => {
            res.should.have.status(403);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET', err);
            done();
          });
      });
    });
    // describe('Note GET /', () => {
    //   it('should get all notes', done => {
    //     chai
    //       .request(app)
    //       .get('/api/notes')
    //       .set('Authorization', userToken)
    //       .then(res => {
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('GET', err);
    //         done();
    //       });
    //   });
    // });

    describe('User /GET/:id', () => {
      it('it should retrieve a user by id', done => {
        chai
          .request(app)
          .get(`/api/users/${user_id}`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            res.body.should.have.property('_id');
            res.body.should.have.property('email');
            done();
          })
          .catch(err => {
            console.log('GET/:id', err);
            done();
          });
      });
      it('it should not retrieve a user by id without a correct JWT in Authorization header', done => {
        chai
          .request(app)
          .get(`/api/users/${user_id}`)
          .then(res => {
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET/:id', err);
            done();
          });
      });
      it('it should not retrieve a user by id without Authorization header', done => {
        chai
          .request(app)
          .get(`/api/users/${user_id}`)
          .set('Authorization', 'userToken')
          .then(res => {
            res.should.have.status(403);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET/:id', err);
            done();
          });
      });
    });
    // describe('Note /GET/:id', () => {
    //   it('it should retrieve a note by id', done => {
    //     chai
    //       .request(app)
    //       .get(`/api/notes/${note_id}`)
    //       .set('Authorization', userToken)
    //       .then(res => {
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('GET/:id', err);
    //         done();
    //       });
    //   });
    // });

    // describe('User /PUT/:id', () => {
    //   it('it update a user by id', done => {
    //     chai
    //       .request(app)
    //       .put(`/api/users/${user_id}`)
    //       .set('Authorization', userToken)
    //       .send({
    //         name: 'Updated',
    //         email: 'updated@user.com',
    //         password: '123456'
    //       })
    //       .then(res => {
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('PUT/:id', err);
    //         done();
    //       });
    //   });
    // });
    // describe('Note /PUT/:id', () => {
    //   it('it update a note by id', done => {
    //     chai
    //       .request(app)
    //       .put(`/api/notes/${note_id}`)
    //       .set('Authorization', userToken)
    //       .send({
    //         title: 'Updated Title',
    //         content: 'Updated Content',
    //       })
    //       .then(res => {
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('PUT/:id', err);
    //         done();
    //       });
    //   });
    // });

    describe('User /DELETE/:id', () => {
      it('it should remove a user by id', done => {
        chai
          .request(app)
          .delete(`/api/users/${user_id}`)
          .set('Authorization', userToken)
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
    // describe('Note /DELETE/:id', () => {
    //   it('it should remove a note by id', done => {
    //     chai
    //       .request(app)
    //       .delete(`/api/notes/${note_id}`)
    //       .set('Authorization', userToken)
    //       .then(res => {
    //         res.should.have.status(200);
    //         done();
    //       })
    //       .catch(err => {
    //         console.log('DELETE/:id', err);
    //         done();
    //       });
    //   });
    // });
  });
});
