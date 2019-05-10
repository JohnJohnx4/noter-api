const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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
        return res
          .status(422)
          .json({
            error:
              'The provided user does not exist. Ensure your email is correct.'
          });
      }

      user.checkPassword(password, hashMatch => {
        if (hashMatch) {
          const token = jwt.sign({ user: user._id }, secret);
          return res.status(200).json({ success: user._id, token });
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
        const newUser = new User({ email, password });
        newUser.save().then(user => {
          const token = jwt.sign({ user: user._id }, secret);
          return res.status(201).json({ success: user._id, token });
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

const getUserByID = (req, res) => {
  const userID = req.params.id;
  User.findById(userID)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  if (!id) return res.status(422).json({ error: 'User ID required.' });
  if (!req.body.email) {
    return res.status(422).json({ error: 'Email required' });
  } else if (!/^.+@.+\..+$/.test(req.body.email)) {
    return res.status(422).json({ error: 'Valid email address required' });
  } else if (!req.body.password) {
    return res.status(422).json({ error: 'Password required' });
  } else if (
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(req.body.password) === false
  ) {
    return res.status(422).json({
      error:
        'Password must be minimum eight characters, at least one letter, and one number'
    });
  }
  User.findById(id)
    .then(user => {
      if (user) {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return res.json({ error: err, type: 'bcrypt' });
          const newPass = hash;
          User.findByIdAndUpdate(id, { email, newPass }, { new: true })
            .select('-password')
            .then(updatedUser => {
              if (!updatedUser)
                return res
                  .status(204)
                  .json({ failure: 'User ID does not exist.' });
              res.status(200).json({ user: updatedUser });
            })
            .catch(error => res.status(500).json({ mongo_error: error }));
        });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ mongo_error: err });
    });
};

//TODO - Add delete user route

module.exports = {
  GET_ALL: getUsers,
  GET: getUserByID,
  POST: addUser,
  UPDATE: updateUser,
  LOGIN: login
};
