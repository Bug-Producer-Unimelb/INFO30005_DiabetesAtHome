// import people model
// const res = require('express/lib/response')
const Patient = require('../models/patient')
const Comment = require('../models/comment')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectId

// handle request to get all data instances
const getAllPatientsData = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        let out_range = []
        let required = []
        
        return res.render('clinician_home.hbs', { data: patients })
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

        return res.render('clinician_home.hbs', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const searchByUserId = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({
            user_id: req.user._id
        }).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('record.hbs', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const getNewestComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOne({
            patient_id: req.params.patient_id,
            data_name: req.params.data_name,
        }).lean()
        if (!comment) {
            return res.sendStatus(404)
        }

        return res.render('clinician_home.hbs', { oneItem: comment })
    } catch (err){
        return next(err)
    }
}

const updateData = async (req, res, next) => {
    try {
        pid = ObjectId('62623d0a745775707e941445')
        const patient = await Patient.findByIdAndUpdate(pid, { blood_glucose_level: Number(req.body.data_content)}).lean()
        if (!patient) {
            return res.sendStatus(404)
        }
        console.log(req.body)
        try {
            newComment = new Comment(req.body)
            newComment.patient_id = pid
            newComment.data_name = 'Blood Glucose Level'
    
            await newComment.save()
        } catch (err) {
            return next(err)
        }
        return res.render('record.hbs', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const insertData = async (req, res, next) => {
    try {
        console.log(req.body)

        User.create({ username: req.body.username, password: req.body.password, role: "patient", createdAt: Date.now(), secret: 'INFO30005' }, (err) => {
            if (err) { console.log(err); return; }
            console.log('Dummy user inserted')
        })

        const newUser = await User.findOne({}, {}, { sort: {'createdAt': -1 } }).lean()
        console.log(newUser)

        newPatient = new Patient({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            DOB: req.body.DOB,
            screen_name: req.body.screen_name,
            user_id: newUser._id,
        })
        await newPatient.save()


        return res.redirect('/clinicianhome')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllPatientsData,
    getNewestComment,
    searchByUserId,
    updateData,
    getDataById,
    insertData,
}
