const mongoose = require('mongoose')
const Patient = require('./patient')

const schema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    data_name: String,
    data_content: Number,
    content: String,
    createdAt: Date,
})

const Comment = mongoose.model('Comment', schema)
module.exports = Comment
