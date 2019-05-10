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
      it('it should add a new User', done => {
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
      it('it should not add a new User if missing API key', done => {
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
      it('it should not add a new User if missing email', done => {
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
      it('it should not add a new User if missing password', done => {
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
    describe('Note POST /', () => {
      it('it should add a new Note', done => {
        const testNote = {
          user: user_id,
          title: 'Test Title',
          content: 'Test Content'
        };
        chai
          .request(app)
          .post('/api/notes')
          .set('Authorization', userToken)
          .send(testNote)
          .then(res => {
            note_id = res.body.success;
            res.should.have.status(200);
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('it should not add a new Note without Authorization header', done => {
        const testNote = {
          user: user_id,
          title: 'Test Title',
          content: 'Test Content'
        };
        chai
          .request(app)
          .post('/api/notes')
          .send(testNote)
          .then(res => {
            res.should.have.status(422);
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('it should not add a new Note without a correct JWT on Authorization header', done => {
        const testNote = {
          user: user_id,
          title: 'Test Title',
          content: 'Test Content'
        };
        chai
          .request(app)
          .post('/api/notes')
          .set('Authorization', 'userToken')
          .send(testNote)
          .then(res => {
            res.should.have.status(403);
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('it should not add a new Note if missing a user', done => {
        const testNote = {
          title: 'Test Title',
          content: 'Test Content'
        };
        chai
          .request(app)
          .post('/api/notes')
          .set('Authorization', userToken)
          .send(testNote)
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('it should not add a new Note if missing a title', done => {
        const testNote = {
          user: user_id,
          content: 'Test Content'
        };
        chai
          .request(app)
          .post('/api/notes')
          .set('Authorization', userToken)
          .send(testNote)
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
      it('it should not add a new Note if missing content', done => {
        const testNote = {
          user: user_id,
          title: 'Test Title'
        };
        chai
          .request(app)
          .post('/api/notes')
          .set('Authorization', userToken)
          .send(testNote)
          .then(res => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('POST', err);
            done();
          });
      });
    });

    describe('User GET /', () => {
      it('it should get all users', done => {
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
      it('it should not get all users without Authorization header', done => {
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
      it('it should not get all users without a correct JWT in Authorization header', done => {
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
    describe('Note GET /', () => {
      it('it should get all notes', done => {
        chai
          .request(app)
          .get('/api/notes')
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            res.body.should.be.an('array');
            done();
          })
          .catch(err => {
            console.log('GET', err);
            done();
          });
      });
      it('it should not get all users without Authorization header', done => {
        chai
          .request(app)
          .get('/api/notes')
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
      it('it should not get all users without a correct JWT in Authorization header', done => {
        chai
          .request(app)
          .get('/api/notes')
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

    describe('User /GET /:id', () => {
      it('it should retrieve a user by id', done => {
        chai
          .request(app)
          .get(`/api/users/${user_id}`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            res.body.should.have.property('_id');
            res.body._id.should.be.a('string');
            res.body.should.have.property('email');
            res.body.email.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a user by id with an incorrect id param', done => {
        chai
          .request(app)
          .get(`/api/users/1`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(500);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a user by id without Authorization header', done => {
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
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a user by id without a correct JWT in Authorization header', done => {
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
            console.log('GET /:id', err);
            done();
          });
      });
    });
    describe('Note /GET /:id', () => {
      it('it should retrieve a note by id', done => {
        chai
          .request(app)
          .get(`/api/notes/${note_id}`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(200);
            res.body.should.have.property('user');
            res.body.user.should.be.an('object');

            res.body.should.have.property('title');
            res.body.title.should.be.a('string');

            res.body.should.have.property('content');
            res.body.content.should.be.a('string');

            res.body.should.have.property('last_edit');
            res.body.last_edit.should.be.an('object');

            res.body.should.have.property('label');
            res.body.label.should.be.an('array');

            res.body.should.have.property('collaborators');
            res.body.collaborators.should.be.an('array');
            res.body.should.have.property('checklist');
            res.body.checklist.should.be.an('object');

            res.body.should.have.property('tags');
            res.body.tags.should.be.an('array');

            res.body.should.have.property('_id');
            res.body._id.should.be.a('string');

            res.body.should.have.property('comments');
            res.body.comments.should.be.an('array');

            res.body.should.have.property('created');
            res.body.created.should.be.a('string');

            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a note by id with an incorrect id param', done => {
        chai
          .request(app)
          .get(`/api/notes/1`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(500);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a note by id without Authorization header', done => {
        chai
          .request(app)
          .get(`/api/notes/${note_id}`)
          .then(res => {
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not retrieve a note by id without a correct JWT in Authorization header', done => {
        chai
          .request(app)
          .get(`/api/notes/${note_id}`)
          .set('Authorization', 'userToken')
          .then(res => {
            res.should.have.status(403);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
    });

    describe('User /PUT/:id', () => {
      it('it should update a user by id', done => {
        chai
          .request(app)
          .put(`/api/users/${user_id}`)
          .set('Authorization', userToken)
          .send({
            name: 'Updated',
            email: 'updated@user.com',
            password: '123456'
          })
          .then(res => {
            res.should.have.status(200);
            res.body.should.have.property('success');
            res.body.success.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
      it('it should not update a user by id with an incorrect id param', done => {
        chai
          .request(app)
          .put(`/api/users/1`)
          .set('Authorization', userToken)
          .send({
            name: 'Updated',
            email: 'updated@user.com',
            password: '123456'
          })
          .then(res => {
            res.should.have.status(500);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not update a user by id without an Authorization Header', done => {
        chai
          .request(app)
          .put(`/api/users/${user_id}`)
          .send({
            name: 'Updated',
            email: 'updated@user.com',
            password: '123456'
          })
          .then(res => {
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
      it('it should not update a user by id with an incorrect JWT on Authorization Header', done => {
        chai
          .request(app)
          .put(`/api/users/${user_id}`)
          .set('Authorization', 'userToken')
          .send({
            name: 'Updated',
            email: 'updated@user.com',
            password: '123456'
          })
          .then(res => {
            res.should.have.status(403);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
    });
    describe('Note /PUT/:id', () => {
      it('it update a note by id', done => {
        chai
          .request(app)
          .put(`/api/notes/${note_id}`)
          .set('Authorization', userToken)
          .send({
            title: 'Updated Title',
            content: 'Updated Content'
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
      it('it should not update a note by id with an incorrect id param', done => {
        chai
          .request(app)
          .put(`/api/notes/1`)
          .set('Authorization', userToken)
          .send({
            title: 'Updated Title',
            content: 'Updated Content'
          })
          .then(res => {
            res.should.have.status(500);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('GET /:id', err);
            done();
          });
      });
      it('it should not update a user by id without an Authorization Header', done => {
        chai
          .request(app)
          .put(`/api/notes/${note_id}`)
          .send({
            title: 'Updated Title',
            content: 'Updated Content'
          })
          .then(res => {
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
      it('it should not update a user by id with an incorrect JWT on Authorization Header', done => {
        chai
          .request(app)
          .put(`/api/notes/${note_id}`)
          .set('Authorization', 'userToken')
          .send({
            title: 'Updated Title',
            content: 'Updated Content'
          })
          .then(res => {
            res.should.have.status(403);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('PUT/:id', err);
            done();
          });
      });
    });

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
      it("it should return an error if trying to remove a user by id that doesn't exist", done => {
        chai
          .request(app)
          .delete(`/api/users/${user_id}`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            done();
          })
          .catch(err => {
            console.log('DELETE/:id', err);
            done();
          });
      });
    });
    describe('Note /DELETE/:id', () => {
      it('it should remove a note by id', done => {
        chai
          .request(app)
          .delete(`/api/notes/${note_id}`)
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
      it("it should return an error if trying to remove a user by id that doesn't exist", done => {
        chai
          .request(app)
          .delete(`/api/notes/${note_id}`)
          .set('Authorization', userToken)
          .then(res => {
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
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
