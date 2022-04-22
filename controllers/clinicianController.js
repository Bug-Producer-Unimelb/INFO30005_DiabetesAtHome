const patient = require('../models/clinician')


// handle request to get all data instances
const getAllCliniciansData = async (req, res, next) => {
    try {
        const clinicians = await Clinician.find().lean()
        return res.render('allData', {data: clinicians})
    } catch (err) {
        return next(err)
    }
}

// handle request to get one data instance
const getDataById = async (req, res, next) => {
    // search the database by ID
    try {
        const clinician = await Clinician.findById(req.params.clinician_id).lean()
        if (!clinician) {
            return res.sendStatus(404)
        }

        return res.render('oneData', {oneItem: clinician})
    } catch (err) {
        return next(err)
    }

}

const insertData = async (req, res, next) => {
    try {
        newClinician = new Clinician( req.body )
        await newClinician.save()
        return res.redirect('/clinician_dashboard')
    } catch (err) {
        return next(err)
    }
}

// exports an object, which contain functions imported by router
module.exports = {
    getAllCliniciansData,
    getDataById,
    insertData,
}