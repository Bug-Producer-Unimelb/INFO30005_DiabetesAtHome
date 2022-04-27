// import people model
// const res = require('express/lib/response')
const Comment = require('../models/comment')
const  ObjectId = require('mongodb').ObjectId;

// handle request to get one data instance
const getData = async (req, res, next) => {
    // search the database by ID
    try {
        const comment = await Comment.find({patient_id: req.params.patient_id, data_name: req.params.data_name, data_content: req.params.data_content, content: req.params.content}).lean()
        if (!comment) {
            return res.sendStatus(404)
        }

        return res.render('record', { oneItem: comment })
    } catch (err) {
        return next(err)
    }
}

const insertData = async (req, res, next) => {
    try {
        newComment = new Comment(req.body)
        newComment.patient_id = ObjectId("62623d0a745775707e941445")
        newComment.data_name = "Blood Glucose Level";

        await newComment.save()
        return res.redirect('/patient')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getData,
    insertData,
}
