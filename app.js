const exphbs = require('express-handlebars')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongooseClient = require('./models')

const app = express()

app.use(express.static('public'))
app.use('/js', express.static(__dirname + './public/js'))

app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout: 'main',
        extname: 'hbs',
        helpers: {
            isSafe: x => x > 115
        }
    })
)
app.set('view engine', 'hbs')

app.use(flash())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'no more bug',
        name: 'diabetesathome', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
        store: MongoStore.create({ clientPromise: mongooseClient }),
        })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}

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

const passport = require('./passport')
app.use(passport.authenticate('session'))
const authRouter = require('./routes/auth')
app.use(authRouter)

const patientRouter = require('./routes/patientRouter')
app.use('/patient', patientRouter)

app.use('/clinician', patientRouter)

const commentRouter = require('./routes/commentRouter')
app.use('/comment', commentRouter)

require('./models/index.js')

app.get('/', (req, res) => {
    res.render('index.hbs')
})

app.get('/aboutus', (req, res) => {
    res.render('about_us.hbs')
})

app.get('/aboutdiabetes', (req, res) => {
    res.render('about_diabetes.hbs')
})

app.get('/record', (req, res) => {
    res.render('record.hbs')
})

app.get('/clinicianlogin', (req, res) => {
    res.render('clinician_login.hbs')
})


// clinician pages
app.get('/clinicianhome', isAuthenticated, hasRole('clinician'), async (req, res) => {
    res.render('clinician_home.hbs')
})


app.get('/cliniciancomment', isAuthenticated, hasRole('clinician'), async (req, res) => {
    res.render('clinician_comment.hbs')
})

app.get('/c_patientdetail', (req, res) => {
    res.render('clinician_pdetail.hbs')
})

app.get('/signup', (req, res) => {
    res.render('patient_signup.hbs')
})

app.get('/c_historicaldetail', (req, res) => {
    res.render('clinician_hdetail.hbs')
})

app.get('/changepassword', (req, res) => {
    res.render('changepassword.hbs')
})

app.get('/viewcomment', (req, res) => {
    res.render('viewcomment.hbs')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`)
})
