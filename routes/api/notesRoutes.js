const router = require('express').Router();
// const router = express.Router();
const { createNNote, deleteNote } = require('../../lib/notes');
const { notesArray } = require('../../db/notes');

// Endpoint to get all notes
router.get('/notes', (req, res) => {
    res.json(notesArray);
});

// Endpoint to create a new note
router.post('/notes', (req, res) => {
    const noteId = notesArray ? notesArray.length.toString() : '0';
    req.body.id = noteId;
    const newNote = createNNote(req.body, notesArray);
    res.json(newNote);
});

// Endpoint to delete a note by ID
router.delete('/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    const updatedNotesArray = await deleteNote(noteId, notesArray);
    res.json(updatedNotesArray);
});

module.exports = router;