const users = require("../controllers/user");
const notes = require("../controllers/notes");

module.exports = app => {
	// === User CRUD operations

	// --- Multiple Users
	// GET all users in database
	app.route("/api/users/all").get(users.GET_ALL);
	
	// --- Single User
	app
	.route("/api/users/:id")
	// GET one user by their provided ID
	.get(users.GET)
	// PUT an updated user into database
	.put(users.UPDATE);
	
	// GET a response based on whether email exists in database or not
	app.route("/api/user/exists/:email").get(users.FIND);
	
	// --- User Registration
	// POST a new user to the database
	app.route("/api/users/register").post(users.POST);

	// === Navigation handling
	// --- Logging in/out
	app.route("/api/login").post(users.LOGIN);

	// === Note CRUD operations
	// --- Multiple Notes
	app
		.route("/api/notes")
		.get(notes.GET_ALL)
		.post(notes.POST);
	// --- Single Notes
	app
		.route("/api/notes/:id")
		.get(notes.GET)
		.delete(notes.DELETE)
		.put(notes.PUT);
};
