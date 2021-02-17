const jwt = require('jsonwebtoken');
const users = require('../controllers/user');
const notes = require('../controllers/notes');
// const {validateToken, verifyApiKey, verifyUserExists} = require('../controllers/auth');
const {validateToken, verifyUserExists} = require('../controllers/auth');
const SECRET = process.env.SECRET_KEY;

// TODO - Require all routes except login to have jwt

module.exports = app => {
  app.route('/api/login').post(users.LOGIN);
  app.route('/api/token').get((req, res) => res.json({token: jwt.sign({user: '1234'}, SECRET, { expiresIn: '12h' })}));

  app
    .route('/api/users')
    .get(validateToken, users.GET_ALL)
    .post(users.POST);
  app
    .route('/api/users/:id')
    .get(validateToken, users.GET)
    .put(validateToken, users.PUT)
    .delete(validateToken, users.DELETE);

  app
    .route('/api/notes')
    .get(validateToken, notes.GET_ALL)
    .post(validateToken, verifyUserExists, notes.POST);
    
  app
  .route('/api/notes/user/:userid')
  .get(validateToken, verifyUserExists, notes.GET_USER)

  app
    .route('/api/notes/:id')
    .get(validateToken, notes.GET)
    .delete(validateToken, notes.DELETE)
    .put(validateToken, notes.PUT);
};
