const users = require('../controllers/user');
const notes = require('../controllers/notes');
const {validateToken, verifyApiKey} = require('../controllers/auth');

// TODO - Require all routes except login to have jwt

module.exports = app => {
  app.route('/api/login').post(users.LOGIN);

  app
    .route('/api/users')
    .get(validateToken, users.GET_ALL)
    .post(verifyApiKey, users.POST);
  app
    .route('/api/users/:id')
    .get(validateToken, users.GET)
    .put(validateToken, users.PUT)
    .delete(validateToken, users.DELETE);

  app
    .route('/api/notes')
    .get(validateToken, notes.GET_ALL)
    .post(validateToken, notes.POST);
  app
    .route('/api/notes/:id')
    .get(validateToken, notes.GET)
    .delete(validateToken, notes.DELETE)
    .put(validateToken, notes.PUT);
};
