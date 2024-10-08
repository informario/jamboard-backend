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
//EVENTS
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
let pendingRequests = [];
let lastUpdate = { version: 0, data: null }
let elements = []



app.post("/postelement/:username", midware, (req, res) =>{
    elements.push(req.body)
    elements[elements.length-1].username = req.params.username;
    eventEmitter.emit('newelementOccurred');
    res.sendStatus(200)
})

app.get("/getelement/:id", (req, res) =>{
    if(req.params.id>=elements.length || req.params.id<0){
        res.sendStatus(204)
    }
    else{
        let data = {}
        data.elements = elements.slice(req.params.id, elements.length)
        data.size=  elements.length - req.params.id - 1
        res.json(data)
    }
})

app.delete(`/element/:username`, (req, res) =>{
    for(let i= elements.length-1; i>=0; i--){
        if("username" in elements[i]){
            if(elements[i].username === req.params.username){
                elements[i]={}
                break
            }
        }
    }
    //responder con update a todos
    eventEmitter.emit('deleteOccurred');
    res.sendStatus(200)
})

app.delete(`/deleteall`, (req, res) =>{
    for(let i= elements.length-1; i>=0; i--){
        elements[i]={}
    }
    //responder con update a todos
    eventEmitter.emit('deleteOccurred');
    res.sendStatus(200)
})


app.get("/update/:username/:version", (req, res) =>{
    let userVersion = req.params.version

    if(lastUpdate.version > userVersion){
        res.send(lastUpdate)
    }
    else{
        pendingRequests.push(res);
        pendingRequests[pendingRequests.length-1].username = req.params.username;
    }
    //console.log("recibida request update de: "+res.username);

})

app.get("/awake", (req, res) =>{
    setTimeout(()=>{
        res.sendStatus(200)
    }, 50)
})

eventEmitter.on('deleteOccurred', () => {
    lastUpdate = {version:lastUpdate.version+1, data:'deleteOccurred'}
    console.log(`version: ${lastUpdate.version}`);
    while (pendingRequests.length > 0) {
        const res = pendingRequests.pop();
        //console.log("enviada respuesta delete a: "+res.username);
        res.send(lastUpdate);
    }
});
eventEmitter.on('newelementOccurred', () => {
    lastUpdate = {version:lastUpdate.version+1, data:'newelementOccurred'}
    console.log(`version: ${lastUpdate.version}`);
    while (pendingRequests.length > 0) {
        //console.log(pendingRequests.length);
        const res = pendingRequests.pop();
        //console.log("enviada respuesta new a: "+res.username);
        res.send(lastUpdate);

    }
});