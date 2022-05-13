const express = require('express')
const commentRouter = express.Router()

const commentController = require('../controllers/commentController')

commentRouter.get('/', commentController.getAllCommentsData)

commentRouter.get('/:patient_id/:data_name', commentController.getData)

commentRouter.post('/', commentController.insertData)

// export the router
module.exports = commentRouter
