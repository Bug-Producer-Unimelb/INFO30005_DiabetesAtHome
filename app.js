const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

app.use(express.static('public'))

app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout: 'main',
        extname: 'hbs',
    })
)
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index.hbs')
})

app.get('/aboutus', (req, res) => {
    res.render('about_us.hbs')
})

app.get('/aboutdiabetes', (req, res) => {
    res.render('about_diabetes.hbs')
})

app.listen(3000, () => {
    console.log('Demo app is listening on port 3000!')
})
