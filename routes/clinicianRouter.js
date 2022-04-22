const express = require('express')
const clinicianRouter = express.Router()

const clinicianController = require('../controllers/clinicianController')

clinicianRouter.get('/', clinicianController.getAllClinicianData)

clinicianRouter.get('/clinician_id', clinicianController.getDataById)

clinicianRouter.post('/', clinicianController.insertData)

// export the router
module.exports = clinicianRouter