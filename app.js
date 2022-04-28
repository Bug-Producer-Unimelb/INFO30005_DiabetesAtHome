const exphbs = require('express-handlebars')
const express = require('express')
const app = express()

app.use(express.static('public'))

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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const patientRouter = require('./routes/patientRouter')
app.use('/patient', patientRouter)
app.use('/clinicianhome', patientRouter)

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

// clinician pages
app.get('/clinicianhome', (req, res) => {
    res.render('clinician_home.hbs')
})

app.get('/cliniciancomment', (req, res) => {
    res.render('clinician_comment.hbs')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`)
})
