// import people model
// const res = require('express/lib/response')
const Comment = require('../models/comment')
const ObjectId = require('mongodb').ObjectId

const getAllCommentsData = async (req, res, next) => {
    try {
        const comments = await Comment.find().lean()
        return res.render('clinician_home.hbs', { data: comments })
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getData = async (req, res, next) => {
    // search the database by ID
    try {
        const comment = await Comment.findOne({
            patient_id: req.params.patient_id,
            data_name: req.params.data_name,
        }).lean()
        if (!comment) {
            return res.sendStatus(404)
        }

        return res.render('clinician_home.hbs', { oneItem: comment })
    } catch (err) {
        return next(err)
    }
}


const insertData = async (req, res, next) => {
    try {
        newComment = new Comment(req.body)
        newComment.patient_id = ObjectId('62623d0a745775707e941445')
        newComment.data_name = 'Blood Glucose Level'

        await newComment.save()
        return res.redirect('/patient')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllCommentsData,
    getData,
    insertData,
}
