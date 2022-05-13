const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const user = require('./user.js')

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
    account: user.userSchema,

    dataset: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    thresholds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threshold'
    }]
})

schema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}
const SALT_FACTOR = 10
// Hash password before saving
schema.pre('save', function save(next) {
    const patient = this
    // Go to next if password field has not been modified
    if (!patient.isModified('password')) {
        return next()
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(patient.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        // Replace password with hash
        patient.password = hash
        next()
    })
})


const Patient = mongoose.model('Patient', schema)
module.exports = Patient
