const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    data_name: String,
    max: Number,
    min: Number,
    required: Boolean
})

const Threshold = mongoose.model('Threshold', schema)
module.exports = Threshold