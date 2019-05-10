const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

const User = require('../models/User');

/* TODOs
 ** Set up tests for this note
 ** Fix test note for post
 ** set up correct route testing for notes
 **
 */



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


});
