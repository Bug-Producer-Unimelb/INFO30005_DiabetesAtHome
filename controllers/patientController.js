// import people model
// const res = require('express/lib/response')
const Patient = require('../models/patient')
const Clinician = require('../models/clinician')
const Comment = require('../models/comment')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId

// handle request to get all data instances
const getAllPatientsData = async (req, res, next) => {
    try {
        const clinician = await Clinician.findOne({user_id: req.user.id}).lean()
        const patients = await Patient.find().limit(5).lean()

        return res.render('clinician_home.hbs', { data: patients, page_num: 0, oneItem: clinician })
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

        const comment = await Comment.findOne({patient_id: req.params.patient_id}).limit(1).lean()

        const clinician = await Clinician.findOne({user_id: req.user.id}).lean()

        return res.render('clinician_pdetail.hbs', { oneItem: patient, clinician:  clinician, comment: comment })
    } catch (err) {
        return next(err)
    }
}

const getHistory = async (req, res, next) => {
    // search the database by ID
    try {
        console.log(req)
        const patient = await Patient.findOne({
            user_id: req.user._id,
        }).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        const comment = await Comment.findOne({patient_id: req.body.patient_id}).limit(1).lean()

        const clinician = await Clinician.findOne({user_id: req.user.id}).lean()

        return res.render('patient_hdetail.hbs', { oneItem: patient, clinician:  clinician, comment: comment })
    } catch (err) {
        return next(err)
    }
}


const getPage = async (req, res, next) => {
    try {
        if (req.body.page_num < 1) {
            return res.render('clinician_home.hbs', { data: patients, oneItem: clinician })
        }
        const patients = await Patient.find()
            .skip(5 * (req.body.page_num - 1))
            .limit(5)
            .lean()

        const clinician = await Clinician.findOne({user_id: req.user.id}).lean()

        return res.render('clinician_home.hbs', { data: patients, oneItem:  clinician})
    } catch (err) {
        return next(err)
    }
}

const reply = async (req, res, next) => {
    try {
        console.log(req.body)
        const patient = await Patient.findByIdAndUpdate(
            ObjectId(req.body.pid),
            { note: req.body.note },
            { new: true }
        ).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        res.render('clinician_pdetail.hbs', { oneItem: patient })

        console.log(patient)
    } catch (err) {
        return next(err)
    }
}

const sendSupportMessage = async (req, res, next) => {
    try {
        console.log(req.body)
        const patient = await Patient.findByIdAndUpdate(
            ObjectId(req.body.pid),
            { support_message: req.body.support_message },
            { new: true }
        ).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        res.render('clinician_pdetail.hbs', { oneItem: patient })

        console.log(patient)
    } catch (err) {
        return next(err)
    }
}

const searchByUserId = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({
            user_id: req.user._id,
        }).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('record.hbs', { oneItem: patient })
    } catch (err) {
        return next(err)
    }
}

const renderAchievement = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({
            user_id: req.user._id,
        }).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('achievement.hbs', { oneItem: patient })
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
    } catch (err) {
        return next(err)
    }
}

const updateData = async (req, res, next) => {
    try {
        pid = ObjectId(req.body.pid)
        console.log(pid)
        const patient = await Patient.findByIdAndUpdate(pid, {
            blood_glucose_level: Number(req.body.data_content),
        }).lean()
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
        User.create(
            {
                username: req.body.username,
                password: req.body.password,
                role: 'patient',
                createdAt: Date.now(),
                secret: 'INFO30005',
            },
            (err) => {
                if (err) {
                    console.log(err)
                    return
                }
                console.log('Dummy user inserted')
            }
        )

        const newUser = await User.findOne(
            {},
            {},
            { sort: { createdAt: -1 } }
        ).lean()
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

const changePassword = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            password: hash_password(req.body.password),
        }).lean()

        if (!user) {
            return res.sendStatus(404)
        }

        try {
            const patient = await Patient.findOne({
                user_id: req.user._id,
            }).lean()
            if (!patient) {
                return res.sendStatus(404)
            }

            return res.render('record.hbs', { oneItem: patient })
        } catch (err) {
            return next(err)
        }
    } catch (err) {
        return next(err)
    }
}

const hash_password = function (password) {
    const SALT_FACTOR = 10
    let hash = bcrypt.hashSync(password, SALT_FACTOR)
    return hash
}

module.exports = {
    sendSupportMessage,
    getAllPatientsData,
    renderAchievement,
    getNewestComment,
    searchByUserId,
    changePassword,
    updateData,
    getDataById,
    insertData,
    getHistory,
    getPage,
    reply,
}
