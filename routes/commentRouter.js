const express = require('express')
const commentRouter = express.Router()

const commentController = require('../controllers/commentController')

commentRouter.get('/:patient_id', commentController.getData)

commentRouter.post('/', commentController.insertData)

// export the router
module.exports = commentRouter