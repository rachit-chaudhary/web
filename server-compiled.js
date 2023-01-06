(()=>{var e={142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},13:e=>{"use strict";e.exports=require("mongodb")},738:e=>{"use strict";e.exports=require("multer")},109:e=>{"use strict";e.exports=require("sanitize-html")},17:e=>{"use strict";e.exports=require("path")}},t={};function o(s){var i=t[s];if(void 0!==i)return i.exports;var n=t[s]={exports:{}};return e[s](n,n.exports,o),n.exports}(()=>{o(142).config();const{MongoClient:e,ObjectId:t}=o(13),s=o(860),i=(o(17),s()),n=o(738)(),r=o(109),a=process.env.PORT||8080;let c;i.use(s.static("public")),i.use("/css",s.static(__dirname+"public/css")),i.use("/js",s.static(__dirname+"public/js")),i.use("/img",s.static(__dirname+"public/img")),i.set("views","./views"),i.set("view engine","ejs"),i.use(s.json()),i.use(s.urlencoded({extended:!1})),i.get("/",((e,t)=>{t.render("index",{title:"MPRÉS | Home"})})),i.get("/about",((e,t)=>{t.render("about",{title:"MPRÉS | About",heading:"contacting mprés",address:"C-14, Sector-6, Noida, Uttar Pradesh - 201301",email:"inquiry@mpres.co.in",phone:"+0120 428 6464"})})),i.get("/product",(async(e,t)=>{const o=await c.collection("products").find().toArray();t.render("product",{title:"MPRÉS | Products",allProducts:o})})),i.get("/contact",(async(e,t)=>{t.render("contact",{title:"MPRÉS | Contact",heading:"contacting mprés",address:"C-14, Sector-6, Noida, Uttar Pradesh - 201301",email:"inquiry@mpres.co.in",phone:"+0120 428 6464"})})),i.use((function(e,t,o){t.set("WWW-Authenticate","Basic realm='MPRES Site'"),"Basic YWRtaW46YWRtaW4="==e.headers.authorization?o():t.status(401).send("Authentication Required")})),i.get("/admin",(async(e,t)=>{const o=await c.collection("products").find().toArray();t.render("admin",{allProducts:o})})),i.get("/api/products",(async(e,t)=>{const o=await c.collection("products").find().toArray();t.json(o)})),i.post("/create-product",n.single("photo"),(function(e,t,o){"string"!=typeof e.body.name&&(e.body.name=""),"string"!=typeof e.body.model&&(e.body.model=""),"string"!=typeof e.body._id&&(e.body._id=""),e.cleanData={name:r(e.body.name.trim(),{allowedTags:[],allowedAttributes:{}}),model:r(e.body.model.trim(),{allowedTags:[],allowedAttributes:{}})},o()}),(async(e,o)=>{console.log(e.body);const s=await c.collection("products").insertOne(e.cleanData),i=await c.collection("products").findOne({_id:new t(s.instertedId)});o.send(i)})),async function(){const t=new e(process.env.CONNECTIONSTRING);await t.connect(),c=t.db(),i.listen(a,(()=>console.info(`Listening on port ${a}`)))}()})()})();