const express = require('express')
const path = require("path")
const app = express()
const port = process.env.PORT || 8080



//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

//route for index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'MPRÉS | Home',
        message: 'This is ejs'})
})

//route for about 
app.get('/about.ejs', (req, res) => {
    res.render('about', {
        title: 'MPRÉS | About',
        message: 'This is about.ejs',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})

//route for product 
app.get('/product.ejs', (req, res) => {
    res.render('product', {
        title: 'MPRÉS | Products',
        message: 'This is product.ejs'
    })
})

//route for contact
app.get('/contact.ejs', (req, res) => {
    res.render('contact', {
        title: 'MPRÉS | Contact',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})
// listen on port 8080
app.listen(port, () => console.info(`Listening on port ${port}`))