const mongoose = require('mongoose');
const Note = require('../models/Note');

const createNote = (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(422).json({ error: 'Missing a title or content field' });
  }
  const note = new Note(req.body);
  note
    .save()
    .then((note) => res.status(200).json({ success: note._id }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const getAllNotes = (req, res) => {
  Note.find()
    .populate({ path: 'user', select: 'email name' })
    .populate({
      path: 'last_edit.user',
      select: 'email name',
    })
    .then((notes) => res.status(200).json(notes))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const getUserNotes = (req, res) => {
  const { userid } = req.params;
  Note.find({ user: { $all: userid } })
    .populate({ path: 'user', select: 'email name' })
    .populate({
      path: 'last_edit.user',
      select: 'email name'
    })
    .then((notes) => res.status(200).json(notes))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const getNoteByID = (req, res) => {
  const noteID = req.params.id;
  Note.findById(noteID)
    .populate({ path: 'user', select: 'email name' })
    .populate({
      path: 'last_edit.user',
      select: 'email name',
    })
    .then((note) => res.status(200).json(note))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const updateNote = (req, res) => {
  const id = req.params.id;
  const { title, content, user } = req.body;
  if (!title || !content || !id) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }
  Note.findByIdAndUpdate(
    id,
    { title, content, last_edit: { user: user } },
    { new: true }
  )
    .populate({ path: 'user', select: 'email' })
    .then((updatedNote) =>
      updatedNote === null
        ? res.status(404).json({ error: 'Note not found' })
        : res.status(200).json({ success: 'Updated Note successfully.' })
    )
    .catch((err) => res.status(500).send({ error: err.message }));
};

const deleteNote = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((deletedNote) =>
      deletedNote === null
        ? res.status(404).json({ error: 'Note not found' })
        : res.status(200).json({ success: 'Note deleted succesfully.' })
    )
    .catch((err) => res.status(500).send({ error: err.message }));
};

module.exports = {
  GET_ALL: getAllNotes,
  GET_USER: getUserNotes,
  GET: getNoteByID,
  POST: createNote,
  DELETE: deleteNote,
  PUT: updateNote,
};
