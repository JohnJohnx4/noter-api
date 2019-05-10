const users = require('../controllers/user');
const notes = require('../controllers/notes');

// TODO - Require all routes except login to have jwt

module.exports = app => {
  app.route('/api/login').post(users.LOGIN);

  app
    .route('/api/users')
    .get(users.GET_ALL)
    .post(users.POST);
  app
    .route('/api/users/:id')
    .get(users.GET)
    .put(users.PUT)
    .delete(users.DELETE);

  app
    .route('/api/notes')
    .get(notes.GET_ALL)
    .post(notes.POST);
  app
    .route('/api/notes/:id')
    .get(notes.GET)
    .delete(notes.DELETE)
    .put(notes.PUT);
};
