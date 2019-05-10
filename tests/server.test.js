const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

const User = require('../models/User');
const Stylist = require('../models/Stylist');
const Note = require('../models/Note');

/* TODOs
** Set up tests for this user
** Fix test user for post
** set up correct route testing for users
** set up test note for post
** sset up coorect route testing for notes
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
    let userToken = '';

    describe('POST /', () => {
      it('should add a new User', done => {
        const testUser = {
        };
        chai
          .request(app)
          .post('/api/users')
          .send({ user: testUser })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });


    describe('GET /', () => {
      it('should get all users', done => {
        chai
          .request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('/GET/:id', () => {
      it('it should retrieve a user by id', done => {
        const testGet = new User({
        });

        testGet.save((err, user) => {
          chai
            .request(app)
            .get(`/api/users/${user._id}`)
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe('/PUT/:id', () => {
      it('it update a user by id', done => {
        const testPut = new User({
        });

        testPut.save((err, user) => {
          chai
            .request(app)
            .put(`/api/users/${user._id}`)
            .set('Authorization', userToken)
            .send({
              name: 'Updated',
              email: 'updated@user.com',
              password: '123456'
            })
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a user by id', done => {
        const testDelete = new User({
        });
        testDelete.save((err, user) => {
          chai
            .request(app)
            .delete(`/api/users/${user._id}`)
            .set('Authorization', userToken)
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              done();
            });
        });
      });
    });
  });

  describe('Notes', () => {
    let stylistToken = '';

    Stylist.collection.insertMany(stylists, err => {
      err ? console.log(err) : null;
    });

    describe('POST /', () => {
      it('should add a new Stylist', done => {
        const testPostNote = {};
        chai
          .request(app)
          .post('/api/notes')
          .send({ stylist: testPostStylist })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('GET /', () => {
      it('should get all stylists', done => {
        chai
          .request(app)
          .get('/api/notes')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });



    describe('/GET/:id', () => {
      it('it should retrieve a user by id', done => {
        const testGetStylist = new Stylist({
        });

        testGetStylist.save((err, user) => {
          chai
            .request(app)
            .get(`/api/notes/${user._id}`)
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
      });
    });

    describe('/PUT/:id', () => {
      it('it updates a stylist by id', done => {
        const testPutStylist = new Stylist({
        });

        testPutStylist.save((err, stylist) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .put(`/api/notes/${stylist._id}`)
            .set('Authorization', stylistToken)
            .send({
              name: 'Updated',
              email: 'updated@stylist.com'
            })
            .end((err, res) => {
              if (err) {
                console.log('ERROR', err);
                done();
              }
              res.body.success.should.have.property('name', 'Updated');
              res.body.success.should.have.property(
                'email',
                'updated@stylist.com'
              );
              res.body.success.should.have.property('password');
              res.body.success.should.have.property('date');
              res.body.success.should.have.property('services');
              res.body.success.should.have.property('appointments');
              res.body.success.should.have.property('feedback');
              res.body.success.should.have.property(
                '_id',
                stylist._id.toString()
              );
              done();
            });
        });
      });
    });

    describe('/DELETE/:id', () => {
      it('it should remove a stylist by id', done => {
        let testDeleteStylist = new Stylist({
          name: 'TestDelete',
          email: 'testDelete@stylist.com',
          password: '123456',
          avatar: 'testimgurl'
        });
        testDeleteStylist.save((err, stylist) => {
          if (err) {
            console.log(err);
            done();
          }
          chai
            .request(app)
            .delete(`/api/notes/${stylist._id}`)
            .set('Authorization', stylistToken)
            .end((err, res) => {
              if (err) {
                console.log(err);
                done();
              }
              res.should.have.status(200);
              res.body.should.have.property('success');
              res.body.should.be.a('object');
              done();
            });
        });
      });
    });
  });

});
