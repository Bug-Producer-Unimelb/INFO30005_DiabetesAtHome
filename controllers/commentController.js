// import people model
// const res = require('express/lib/response')
const Comment = require('../models/comment')

// handle request to get one data instance
const getData = async (req, res, next) => {
    // search the database by ID
    try {
        const comment = await Comment.find({user_belong: req.params.user_belong, data_name: req.params.data_name}).lean()
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
