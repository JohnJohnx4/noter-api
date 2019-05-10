const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  subtitle: {
    type: String,
    minlength: 1,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16384
  },
  label: [{ type: String }],
  public: {
    type: Boolean
  },
  comments: [],
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tags: [{ type: String }],
  checklist: {
    completed: {
      type: Boolean,
      default: false
    },
    items: [
      {
        completed: { type: Boolean, default: false },
        item: { type: String }
      }
    ]
  },
  created: {
    type: Date,
    default: Date.now
  },
  last_edit: {
    user: {
      type: Schema.Types.ObjectId,
      ref: User
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
});

module.exports = mongoose.model('Note', NoteSchema);
