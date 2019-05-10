const mongoose = require("mongoose");
const Note = require("../models/Note");

// ===Notes functionality===

const getAllNotes = (req, res) => {
	Note.find()
		.populate({ path: "user", select: "email" })
		.then(notes => {
			res.status(200).json({success: notes});
		})
		.catch(err => {
			res.send(err);
		});
};

const getNoteByID = (req, res) => {
	const noteID = req.params.id
	Note.findById(noteID)
		.populate({ path: "user", select: "email" })
		.then(note => {
			res.status(200).json({success: note});
		})
		.catch(err => {
			res.send(err);
		});
};

const createNote = (req, res) => {
	if (!req.body.title || !req.body.content || !req.body.user) {
		res.status(422).json({ error: "Missing a field" });
	}
	const { title, content, user } = req.body;
	const note = new Note({ title, content, user });
	note
		.save()
		.then(note => {

			note.populate("user", () => {
			let ro = { ...note._doc };
			let us = {...ro.user._doc}
			delete us.password;
				ro.user = us;
				res.status(200).json({
					success: ro
				});
			})
		})
		.catch(err => {
			res.send(err);
		});
};

const deleteNote = (req, res) => { 
	const id = req.params.id;
	Note.findByIdAndRemove(id)
	.then(deletedNote => {
			if (deletedNote === null) {
				return res.status(404).json({ errorMessage: "Note not found" });
			}
			res.status(200).json({ deleted: deletedNote });
		})
		.catch(err => {
			res.send(err);
		});
};

const updateNote = (req, res) => {
	const id = req.params.id;
	const { title, content } = req.body;
	if (!title || !content || !id) {
		res.status(400).json({ errorMessage: "Please fill in all forms" });
	}
	Note.findByIdAndUpdate(id, {title, content}, { new: true })
	.populate({path: "user", select: "email"})
		.then(updatedNote => {
			if (updatedNote === null) {
				return res.status(404).json({ errorMessage: "Note not found" });
			}
			res.status(200).json({updated: updatedNote});
		})
		.catch(err => {
			res.send(err);
		});
};

module.exports = {
	GET_ALL: getAllNotes,
	GET: getNoteByID,
	POST: createNote,
	DELETE: deleteNote,
	PUT: updateNote
};
