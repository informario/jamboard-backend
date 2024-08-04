//SETUP//
let express = require('express')
require('dotenv').config()
let app = express()
//CORS
const cors = require('cors')
app.use(cors())
//PORT
const port = 3001
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
//BODYPARSER
let bodyParser = require('body-parser')
midware = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json());

let elements = []



app.post("/postelement/:username", midware, (req, res) =>{
    elements.push(req.body)
    elements[elements.length-1].username = req.params.username;
    console.log(req.params.username)
    res.sendStatus(200)
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
app.delete(`/element/:username`, (req, res) =>{
    console.log(req.params.username)
    for(let i= elements.length-1; i>=0; i--){
        if("username" in elements[i]){
            if(elements[i].username === req.params.username){
                elements[i]={}
                console.log(elements[i])
                break
            }
        }
    }
    res.sendStatus(200)
})
