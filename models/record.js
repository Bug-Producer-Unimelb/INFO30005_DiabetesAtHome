const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    },
    // the registering days
    total_quantity: Number,
    // the times it had record
    current_record_quantity: Number,
    // the start date
    start_date: Date,
    // the end date
    end_date: Date,
})

const Record = mongoose.model('Record', schema)
module.exports = Record
