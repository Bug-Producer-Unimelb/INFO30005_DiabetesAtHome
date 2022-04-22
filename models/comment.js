const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    },
    data_name: String,
    content: String,
})

const Comment = mongoose.model('Comment', schema)
module.exports = Comment
