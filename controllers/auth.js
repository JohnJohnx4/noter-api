const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;
const apiKey = process.env.PUBLIC_KEY;
const User = require('../models/User');

const userToken = user => jwt.sign(user, SECRET, { expiresIn: '12h' });


const verifyUserExists = (req, res, next) => {
  User.findById(req.body.user)
  .then(user => {
    if (!user) {
      return res.status(404).send({ error: 'User does not exist.' });
    }
    next();
  });
}

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(422)
      .json({ error: 'No token found on Authorization header.' });
  }
  jwt.verify(token, SECRET, (authError, decoded) => {
    if (authError) {
      return res
        .status(403)
        .json({ error: 'Token invalid', message: authError });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyApiKey = (req, res, next) => {
  const givenKey = req.body.key;
  if (givenKey !== apiKey){
    return res
      .status(422)
      .json({ error: 'API key invalid, please check env variables.' });
  }
  next();
}

module.exports = {
  validateToken,
  userToken,
  verifyApiKey,
  verifyUserExists
};
