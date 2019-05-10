const mongoose = require('mongoose');
const Note = require('../models/Note');

const createNote = (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.user) {
    return res.status(422).json({ error: 'Missing a field' });
  }
  const note = new Note(req.body);
  note
    .save()
    .then(note => {
      return res.status(200).json({ success: note._id });
    })
    .catch(err => {
      return res.status(500).send({ error: err.message });
    });
};

const getAllNotes = (req, res) => {
  Note.find()
    .populate({ path: 'user', select: 'email name' })
    .populate({
      path: 'last_edit.user',
      select: 'email name'
    })
    .then(notes => {
      return res.status(200).json({ success: notes });
    })
    .catch(err => {
      return res.status(500).send({ error: err });
    });
};

const getNoteByID = (req, res) => {
  const noteID = req.params.id;
  Note.findById(noteID)
    .populate({ path: 'user', select: 'email name' })
    .populate({
      path: 'last_edit.user',
      select: 'email name'
    })
    .then(note => {
      return res.status(200).json({ success: note });
    })
    .catch(err => {
      return res.status(500).send({ error: err });
    });
};

const updateNote = (req, res) => {
  const id = req.params.id;
  const { title, content, user } = req.body;
  if (!title || !content || !id) {
    return res.status(400).json({ errorMessage: 'Please fill in all fields.' });
  }
  Note.findByIdAndUpdate(
    id,
    { title, content, last_edit: { user: user } },
    { new: true }
  )
    .populate({ path: 'user', select: 'email' })
    .then(updatedNote => {
      return updatedNote === null
        ? res.status(404).json({ errorMessage: 'Note not found' })
        : res.status(200).json({ success: updatedNote });
    })
    .catch(err => {
      return res.status(500).send({ error: err });
    });
};

const deleteNote = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then(deletedNote => {
      return deletedNote === null
        ? res.status(404).json({ errorMessage: 'Note not found' })
        : res.status(200).json({ success: 'Note deleted succesfully.' });
    })
    .catch(err => {
      return res.status(500).send({ error: err });
    });
};

module.exports = {
  GET_ALL: getAllNotes,
  GET: getNoteByID,
  POST: createNote,
  DELETE: deleteNote,
  PUT: updateNote
};
