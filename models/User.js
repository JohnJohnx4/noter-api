const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = parseInt(process.env.SALT_ROUNDS);


const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

UserSchema.pre("save", function(next) {
  // generate the salt and hash the pw
  bcrypt.hash(this.password, salt, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function(potentialPassword, cb) {
  // check passwords
  bcrypt.compare(potentialPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
