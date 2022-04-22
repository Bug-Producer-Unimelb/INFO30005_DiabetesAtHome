// import people model
// const res = require('express/lib/response')
const Patient = require('../models/patient')

// handle request to get all data instances
const getAllPatientsData = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        return res.render('allData', { data: patients })
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const patient = await Patient.findById(req.params.patient_id).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('oneData', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const insertData = async (req, res, next) => {
    try {
        newPatient = new Patient(req.body)
        await newPatient.save()
        return res.redirect('/patient_dashboard')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllPatientsData,
    getDataById,
    insertData,
}
