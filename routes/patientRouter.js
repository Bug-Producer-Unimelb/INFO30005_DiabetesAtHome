const express = require('express')
const patientRouter = express.Router()

const patientController = require('../controllers/patientController')

patientRouter.get('/', patientController.getAllPatientsData)

patientRouter.get('/:patient_id', patientController.getDataById)

patientRouter.post('/', patientController.insertData)

// export the router
module.exports = patientRouter