const express = require('express')
const commentRouter = express.Router()

const commentController = require('../controllers/commentController')

commentRouter.get('/', commentController.getAllCommentsData)

commentRouter.post('/nextpage', commentController.nextpage)

commentRouter.post('/lastpage', commentController.lastpage)

commentRouter.post('/page', commentController.getPage)

commentRouter.get('/:patient_id/:data_name', commentController.getData)

commentRouter.get('/:patient_id/:data_name/:comment_date', commentController.getCommentByPatientId)

commentRouter.post('/', commentController.insertData)

// export the router
module.exports = commentRouter
