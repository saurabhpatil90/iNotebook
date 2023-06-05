const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// ROUTE-1: get all the notes using: GET " api/notes/fetchallnotes". - login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE-2: add a new notes using: Post " api/notes/addnote". - login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid name').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 })],
    async (req, res) => {
        const { title, description, tag } = req.body;

        const result = validationResult(req);
        // if there are errors
        try {
            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user
            })
            const saveNote = await note.save();
            res.json(saveNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    })

// ROUTE-3: update an existing notes using: put " api/notes/updatenote". - login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        // create a new object
        let newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // find the notes to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed");
        }

        // find and update
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


})

// ROUTE-4: delete an existing notes using: delete " api/notes/deletenote". - login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the notes to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed");
        }

        // find and delete
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: " Note has been deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router