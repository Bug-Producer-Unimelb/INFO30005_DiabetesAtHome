// import people model
// const res = require('express/lib/response')
const Comment = require('../models/comment')
const Patient = require('../models/patient')
const ObjectId = require('mongodb').ObjectId

const getAllCommentsData = async (req, res, next) => {
    try {
        const comments = await Comment.find().populate('patient_id').limit(5).lean()
        console.log(comments)

        return res.render('clinician_comment.hbs', { data: comments, page_num: 0})
    } catch (err) {
        return next(err)
    }
}

 const getCommentByPatientId = async (req, res) => {
     try {
        const { patient_id, data_name, comment_date } = req.query
        const comment = await Comment.findOne(
            {
                patient_id: patient_id,
                data_name: data_name,
                comment_date: new Date(comment_date)
            }
        )
        if (!comment) {
            return res.sendStatus(404)
        }
     }

     catch (err) {
         console.log(err)
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

const getPage = async (req, res, next) => {
    try {
        if(req.body.page_num < 1) {
            return res.render('clinician_comment.hbs', { data: comments })
        }
        const comments = await Comment.find().populate('patient_id').skip(5*(req.body.page_num-1)).limit(5).lean()

        return res.render('clinician_comment.hbs', { data: comments })
    } catch (err) {
        return next(err)
    }
}

const lastpage = async (req, res, next) => {
    try {
        const comments = await Comment.find().populate('patient_id').skip(5*req.body.page_num).limit(5).lean()
        console.log(req.body)

        return res.render('clinician_comment.hbs', { data: comments })
    } catch (err) {
        return next(err)
    }
}

const nextpage = async (req, res, next) => {
    try {
        const comments = await Comment.find().populate('patient_id').skip(5*req.body.page_num).limit(5).lean()
        console.log(req.body)

        return res.render('clinician_comment.hbs', { data: comments })
    } catch (err) {
        return next(err)
    }
}


const insertData = async (req, res, next) => {
    try {
        newComment = new Comment(req.body)
        newComment.patient_id = ObjectId('62623d0a745775707e941445')
        newComment.data_name = 'Blood Glucose Level'
        newComment.createdAt = Date.now();

        await newComment.save()
        return res.redirect('/patient')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getCommentByPatientId,
    getAllCommentsData,
    getData,
    insertData,
    getPage,
    nextpage,
    lastpage
}
