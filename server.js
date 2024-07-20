//SETUP//
let express = require('express')
require('dotenv').config()
let app = express()
//CORS
const cors = require('cors')
app.use(cors())
//PORT
const port = 3000
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
//BODYPARSER
let bodyParser = require('body-parser')
midware = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json());

let user_id = 0;
let elements = []
let users = []

app.post("/", midware, (req,res)=>{
    users.push(user_id)
    user_id++
    res.send({user_id:user_id})
})

app.post("/postelement", midware, (req, res) =>{
    elements.push(req.body)
    //console.log('response: ' +req.body)
    res.sendStatus(200)
})

app.post("/getelement",midware, (req, res) =>{
    if(req.body.id>=elements.length || req.body.id<0){
        res.sendStatus(200)
    }
    let element = elements[req.body.id]
    res.json(element)
})
app.post("/fetchall",midware, (req, res) =>{
    if(elements.length==0){
        res.sendStatus(200)
    }
    res.json(elements)
})