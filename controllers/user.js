const mongoose = require('mongoose');
const User = require('../models/User');
const { userToken } = require('../controllers/auth');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;
const salt = parseInt(process.env.SALT_ROUNDS);

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: 'Email and password are both required.' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).json({
          error:
            'The provided user does not exist. Ensure your email is correct.'
        });
      }

      user.checkPassword(password, hashMatch => {
        if (hashMatch) {
          const token = userToken({ user: user._id });
          return res.status(200).json({ user: user._id, token });
        }
        return res.status(422).json({
          error: 'The password provided is incorrect.'
        });
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

const addUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(422)
      .json({ error: 'Email and Password are both required.' });
  }
  const { email, password, name } = req.body;
  User.find({ email })
    .then(existingUser => {
      if (existingUser.length > 0) {
        return res
          .status(409)
          .json({ error: 'User with this email already exists' });
      }
      const newUser = new User({ email, password, name });
      newUser.save().then(user => {
        const token = userToken({ user: user._id });
        return res.status(200).json({ user: user._id, token });
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

const getSingleUser = (req, res) => {
  const userID = req.params.id;
  User.findById(userID)
    .then(user => {
      return user === null
        ? res.status(404).json({ error: 'User does not exist.' })
        : res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name ? user.name : ''
          });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

const updateSingleUser = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(422).json({ error: 'User ID required.' });
  const { email, password, name } = req.body;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: 'User does not exist.' });
      }
      bcrypt.hash(password, salt).then(hash => {
        const newPass = hash;
        User.findOneAndUpdate;
        User.findByIdAndUpdate(id, { email, newPass, name }, { new: true })
          .then(updatedUser => {
            if (!updatedUser) {
              return res
                .status(404)
                .json({ failure: 'User ID does not exist.' });
            }
            return res.status(200).json({ updatedUser });
          })
          .catch(error => res.status(500).json({ error }));
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

const deleteSingleUser = (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then(user => {
      if (user === null) {
        return res.status(404).json({ errorMessage: 'User not found' });
      }
      return res.status(200).json({ success: 'User deleted successfully' });
    })
    .catch(err => {
      return res.send(err);
    });
};

module.exports = {
  GET_ALL: getUsers,
  GET: getSingleUser,
  POST: addUser,
  PUT: updateSingleUser,
  DELETE: deleteSingleUser,
  LOGIN: login
};
