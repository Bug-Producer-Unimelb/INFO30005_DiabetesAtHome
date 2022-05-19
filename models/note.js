const mongoose = require('mongoose')
const Patient = require('./patient')

const schema = new mongoose.Schema({
        patient_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        clinician_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinician",
            required: true
        },
        content: String,
        createdAt: Date
})

const Note = mongoose.model('Note', schema)
module.exports = Note
