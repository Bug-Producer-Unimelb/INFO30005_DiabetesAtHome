const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    screen_name: String,
    record_days: Number,
    blood_glucose: Number,
    weight: Number,
    does_of_insulin: Number,
    exercise: Number,
})

const Patient = mongoose.model('Patient', schema)
module.exports = Patient
