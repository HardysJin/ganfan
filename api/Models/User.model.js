const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v !== 'service';
      },
      message: props => `User name cannot be 'service'`
    },
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
