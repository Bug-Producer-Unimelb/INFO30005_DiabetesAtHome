const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    gender: String,
    DOB: Date,
    screen_name: String,
    record_days: Number,
    blood_glucose_level: Number,
    Weight: Number,
    Doses: Number,
    Exercise: Number,
    note: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    dataset: [{
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        }
    }],
    thresholds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threshold'
    }]
})



const Patient = mongoose.model('Patient', schema)
module.exports = Patient
