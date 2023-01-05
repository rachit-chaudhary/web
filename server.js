const dotenv = require('dotenv')
dotenv.config()
const {MongoClient} = require("mongodb")
const express = require('express')
const path = require("path")
const app = express()
const port = process.env.PORT || 8080

let db


//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

function passwordProtected(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='MPRES Site'")
    if(req.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
        next()
    } else {
        console.log(req.headers.authorization)
        res.status(401).send("Wrong Password")
    }
}

//route for admin
app.get('/admin', (req, res) => {
    res.render("admin")
})

//route for index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'MPRÉS | Home'
    })
})

//route for about 
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'MPRÉS | About',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})

//route for product 
app.get('/product', async (req, res) => {
    const allProducts = await db.collection("products").find().toArray()
    res.render('product', {
        title: 'MPRÉS | Products',
        allProducts
    })
})

//route for contact
app.get('/contact', async (req, res) => {
    const allProducts = await db.collection("products").find().toArray()
    res.render('contact', {
        title: 'MPRÉS | Contact',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})

async function start() {
    const client = new MongoClient(process.env.CONNECTIONSTRING)
    await client.connect()
    db = client.db()
    // listen on port 8080
    app.listen(port, () => console.info(`Listening on port ${port}`))
}
start()

