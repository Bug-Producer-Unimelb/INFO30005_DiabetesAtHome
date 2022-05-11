const passport = require('passport')
const Patient = require('./models/patient')
const LocalStrategy = require('passport-local').Strategy
// Hardcode user for now
const USER = { id: 123, username: 'user', password: 'password', secret: 'info30005' }
// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    done(undefined, user._id)
})
    
passport.deserializeUser((userId, done) => {
    Patient.findById(userId, { password: 0 }, (err, patient) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, patient)
    })
})
// Define local authentication strategy for Passport
// http://www.passportjs.org/docs/downloads/html/#strategies
passport.use(
    new LocalStrategy((username, password, done) => {
        Patient.create({ username: 'user', password: 'hashed!', secret: 'INFO30005' })

        Patient.findOne({ username }, {}, {}, (err, patient) => {
        if (err) {
            return done(undefined, false, {
                message: 'Unknown error has occurred'
            })
        }
        if (!patient) {
            return done(undefined, false, {
                message: 'Incorrect username or password',
            })
        }
    // Check password
        patient.verifyPassword(password, (err, valid) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!valid) {
                return done(undefined, false, {
                    message: 'Incorrect username or password',
                })
            }
            // If user exists and password matches the hash in the database
            return done(undefined, patient)
            })
        })
    })
)
module.exports = passport