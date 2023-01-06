const dotenv = require('dotenv')
dotenv.config()
const {MongoClient, ObjectId} = require("mongodb")
const express = require('express')
const path = require("path")
const app = express()
const multer = require('multer')
const upload = multer()
const sanitizeHTML = require('sanitize-html')
const fse = require('fs-extra')
const sharp = require('sharp')
const port = process.env.PORT || 8080

let db

const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ProductCard = require("./src/components/ProductCard").default


//when the app first launches, make sure the public/uploaded-photos exist
fse.ensureDirSync(path.join("public", "uploaded-photos"))

//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


//set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='MPRES Site'")
    if(req.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
        next()
    } else {
        res.status(401).send("Authentication Required")
    }
}

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
    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container">
            <div className='animal-grid mb-3'>
                {allProducts.map(product => <ProductCard key={product._id} name={product.name} model={product.model} photo={product.photo} id={product._id} readyOnly={true} />)}
            </div>
            <p><a href='/admin'>Manage Listing</a></p>
        </div>
    )
    res.render('product', {
        title: 'MPRÉS | Products',
        generatedHTML
    })
})

//route for contact
app.get('/contact', async (req, res) => {
    res.render('contact', {
        title: 'MPRÉS | Contact',
        heading: 'contacting mprés',
        address: 'C-14, Sector-6, Noida, Uttar Pradesh - 201301',
        email: 'inquiry@mpres.co.in',
        phone: '+0120 428 6464'
    })
})

app.use(passwordProtected)

//route for admin
app.get('/admin', async (req, res) => {
    const allProducts = await db.collection("products").find().toArray()
    res.render('admin', {
        allProducts
    })
})

//route for api
app.get("/api/products", async (req, res) => {
    const allProducts = await db.collection("products").find().toArray()
    res.json(allProducts)
})

app.post("/create-product", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename
    }
    console.log(req.body)
    const info = await db.collection("products").insertOne(req.cleanData)
    const newProduct = await db.collection("products").findOne({_id: new ObjectId(info.insertedId)})
    res.send(newProduct)
})

app.delete("/product/:id",async (req, res) => {
    if(typeof req.params.id != "string") req.params.id = ""
    const doc = await db.collection("products").findOne({_id: new ObjectId(req.params.id)})
    if(doc.photo) {
        fse.remove(path.join("public", "uploaded-photos", doc.photo))
    }
    db.collection("products").deleteOne({_id: new ObjectId(req.params.id)})
    res.send("successfully delete")
})

app.post("/update-product", upload.single("photo"), ourCleanup, async (req, res) => {
    if (req.file) {
        // if they are upload a new photo
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename
        const info = await db.collection("products").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        if (info.value.photo) {
            fse.remove(path.join("public", "uploaded-photos", info.value.photo))
        }
        res.send(photofilename)
    } else {
        // if they are not upload a new photo
        db.collection("products").findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        res.send(false)
    }
})

function ourCleanup(req, res, next) {
    if (typeof req.body.name != "string") req.body.name = ""
    if (typeof req.body.model != "string") req.body.model = ""
    if (typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        name: sanitizeHTML(req.body.name.trim(), {allowedTags: [], allowedAttributes: {}}),
        model: sanitizeHTML(req.body.model.trim(), {allowedTags: [], allowedAttributes: {}}),
    }

    next()
}

async function start() {
    const client = new MongoClient(process.env.CONNECTIONSTRING)
    await client.connect()
    db = client.db()
    // listen on port 8080
    app.listen(port, () => console.info(`Listening on port ${port}`))
}
start()

