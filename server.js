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

//route for index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'MPRÉS | Home'
    })
})

//route for about 
app.get('/about.ejs', (req, res) => {
    res.render('about', {
        title: 'MPRÉS | About',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})

//route for product 
app.get('/product.ejs', async (req, res) => {
    const allProducts = await db.collection("products").find().toArray()
    res.render('product', {
        title: 'MPRÉS | Products',
        allProducts
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

async function start() {
    const client = new MongoClient('mongodb+srv://rachit:WW5IO5jbxkRoulor@cluster0.vol2k7z.mongodb.net/MPRES?retryWrites=true&w=majority')
    await client.connect()
    db = client.db()
    // listen on port 8080
    app.listen(port, () => console.info(`Listening on port ${port}`))
}
start()

