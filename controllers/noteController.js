// import people model
// const res = require('express/lib/response')
const Note = require('../models/note')
const Patient = require('../models/patient')
const ObjectId = require('mongodb').ObjectId

const getAllNotesData = async (req, res, next) => {
    try {
        const notes = await Note.find().populate('patient_id').limit(5).lean()
        console.log(notes)

        return res.render('viewcomment.hbs', { data: notes, page_num: 0 })
    } catch (err) {
        return next(err)
    }
}

const getNoteByPatientId = async (req, res) => {
    try {
        const { patient_id } = req.query
        const note = await Note.findOne({ patient_id: patient_id })
        if (!note) {
            return res.sendStatus(404)
        }
        return res.render('viewcomment.hbs', { oneItem: note })
    } catch (err) {
        console.log(err)
    }
}

const insertData = async (req, res, next) => {
    try {
        newNote = new Note(req.body)
        newNote.patient_id = ObjectId('62623d0a745775707e941445')
        newNote.clinician_id = ObjectId('62623d0a745775707e941445') //need to change
        newNote.createdAt = Date.now()

        await newNote.save()
        return res.redirect('/patient')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getNoteByPatientId,
    getAllNotesData,
    insertData,
}
