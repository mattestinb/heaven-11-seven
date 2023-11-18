
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const uniqid = require('uniqid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to read data from JSON file
async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        throw err;
    }
}

// Function to write data to JSON file
async function writeData(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 4));
        console.info(`Data written to ${file}`);
    } catch (err) {
        console.error('Error writing data:', err);
        throw err;
    }
}

// Route to serve the index.html
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the notes.html
app.get('/notes', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to get notes from db.json
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await readData(path.join(__dirname, 'db', 'db.json'));
        res.json(notes);
    } catch {
        res.status(500).send('Internal server error');
    }
});

// Route to create a new note
app.post('/api/notes', async (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        try {
            const notes = await readData(path.join(__dirname, 'db', 'db.json'));
            notes.push({ title, text, id: uniqid() });
            await writeData(path.join(__dirname, 'db', 'db.json'), notes);
            res.status(200).send('Note added successfully');
        } catch {
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(400).send('Bad request');
    }
});

// Route to delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const notes = await readData(path.join(__dirname, 'db', 'db.json'));
        const filteredNotes = notes.filter(note => note.id !== req.params.id);
        await writeData(path.join(__dirname, 'db', 'db.json'), filteredNotes);
        res.status(200).send('Note deleted successfully');
    } catch {
        res.status(500).send('Internal server error');
    }
});

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
