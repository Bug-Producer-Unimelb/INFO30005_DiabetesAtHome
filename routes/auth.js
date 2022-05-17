const passport = require('passport')
const express = require('express')

const Patient = require('../models/patient')
const Comment = require('../models/comment')

const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

const router = express.Router()
// -----------Authentication middleware-----------
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole) 
            return next()
        else {
            res.redirect('/')
        }
    }    
}

// --------END OF AUTH MIDDLEWARE---------

// Main page which requires login to access
// Note use of authentication middleware here
router.get('/', isAuthenticated, hasRole("patient"), patientController.searchByUserId)
router.get('/clinicianhome', isAuthenticated, hasRole("clinician"), patientController.getAllPatientsData)


// Login page (with failure message displayed upon login failure)
router.get('/login', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' })
})
// Handle login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/', failureRedirect: '/login', failureFlash: true
    })
)

router.get('/clinicianlogin', (req, res) => {
    res.render('clinician_login', { flash: req.flash('error'), title: 'Login' })
})

router.post('/clinicianlogin',
    passport.authenticate('local', {
        successRedirect: '/clinicianhome', failureRedirect: '/clinicianlogin', failureFlash: true
    })
)


// Handle logout
router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})
module.exports = router