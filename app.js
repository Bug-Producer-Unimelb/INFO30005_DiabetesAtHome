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
const patientController = require('./controllers/patientController')
app.use('/patient', patientRouter)

app.use('/clinician', patientRouter)

const commentRouter = require('./routes/commentRouter')
app.use('/comment', commentRouter)

require('./models/index.js')

const Record = require('./models/record')
const Patient = require('./models/patient')
const User = require('./models/user')
// const ObjectId = require('mongodb').ObjectId

app.get('/', (req, res) => {
    console.log("index page...");
    res.render('index.hbs')
})

/**
 * Calculate the encoragement rate and return it
 * @param {*} record 
 */
const calculateEncoragement = (record) => {
    let rate = 0.0;
    if (record) {
        rate = parseFloat((record.current_record_quantity * 1.0 / record.total_quantity).toFixed(3));
    }
    return rate;
};

app.get("/patients/:id/achievement", async (req, res) => {
    const patientId = req.params.id;
    // console.log("patient id is: ", patientId);
    const record = await Record.findOne({'patient_id': patientId});
    const currentUser = await Patient.findOne({ _id: record.patient_id }).populate("user_id");
    const currentUserName = currentUser.user_id.username;
    console.log("current user is: ", currentUser);
    const records = await Record.find();
    // console.log("all records are: ", records);
    let allRankInfo = [];
    // get all the encoragement rate of all the patients
    if (records && records.length > 0) {
        for (const r of records) {
            allRankInfo.push({
                patient_id: r.patient_id,
                rate: calculateEncoragement(r)
            });
        }
    }
    // sort the allRankInfo array above
    allRankInfo.sort((a, b) => {
        return -1 * (a.rate - b.rate);
    });
    let patientIds = [];
    for (let i = 0; i < allRankInfo.length; ++i) {
        patientIds.push(allRankInfo[i].patient_id);
    }

    const patients = await Patient.find({'_id': {$in: patientIds}}).limit(5);
    // console.log("all patients are: ", patients);
    let userIds = [];
    if (patients && patients.length > 0) {
        for (const p of patients) {
            // console.log(typeof p.user_id);
            userIds.push(p.user_id._id);
        }
    }

    // console.log("all user ids are: ", userIds);
    const users = await User.find({ _id: { $in: userIds }});
    // console.log("all user are: ", users);
    let top5Users = [];
    if (users && users.length > 0) {
        for (const user of users) {
            top5Users.push({
                username: user.username
            });
        }
    }
    console.log("all user names are: ", top5Users);

    // query all the patient information according to the patient id
    let rate = 82.1;
    if (record) {
        rate = calculateEncoragement(record);
    }
    return res.render("achievement.hbs", {currentUserName: currentUserName, rate: rate, top5Users: top5Users});
});

const searchByUserId = async (userId) => {
    try {
        const patient = await Patient.findOne({
            user_id: userId
        }).lean()
        if (!patient) {
            return res.sendStatus(404)
        }

        return patient._id
    } catch (err) {
        return next(err)
    }
}

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

app.post('/reply', patientController.reply)


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

app.get('/achievement', patientController.renderAchievement)

app.post('/changepassword', patientController.changePassword)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`)
})
