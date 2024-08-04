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

let elements = []
let id = 0;



app.post("/postelement", midware, (req, res) =>{
    elements.push(req.body)
    elements[elements.length-1].date = Date.now();
    elements[elements.length-1].id = id;
    res.json({id:id})
    id++;
})

app.get("/getelement/:id", (req, res) =>{
    if(req.params.id>=elements.length || req.params.id<0){
        res.sendStatus(204)
    }
    else{
        let element = elements[req.params.id]
        res.json(element)
    }
})
app.post("/fetchall",midware, (req, res) =>{
    if(elements.length===0){
        res.sendStatus(200)
    }
    else{
        res.json(elements)
    }
})
app.delete(`/element/:id`, (req, res) =>{
    console.log(req.params.id)
    elements[id] = {}
    res.sendStatus(200)
})