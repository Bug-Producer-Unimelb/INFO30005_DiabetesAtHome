const express = require('express')
const noteRouter = express.Router()

const noteController = require('../controllers/noteController')

noteController.get('/', noteController.getAllNotesData)

noteController.get('/view', noteController.getNoteByPatientId)

noteController.post('/', noteController.insertData)

// export the router
module.exports = noteRouter
