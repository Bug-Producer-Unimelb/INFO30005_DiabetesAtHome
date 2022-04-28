const express = require('express')
const patientRouter = express.Router()

const patientController = require('../controllers/patientController')

patientRouter.get('/', patientController.getAllPatientsData)

patientRouter.get('/:patient_id', patientController.getDataById)

patientRouter.get('/:patient_id/:data_name', patientController.getNewestComment)

patientRouter.post('/', patientController.insertData)

patientRouter.post('/record', patientController.updateData)

// export the router
module.exports = patientRouter
