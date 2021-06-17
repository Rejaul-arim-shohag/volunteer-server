const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.port || 5000


app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmftb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err)
  const eventCollection = client.db("volunteer").collection("events");
  
  app.get('/events', (req, res)=>{
    eventCollection.find()
    .toArray((err, items)=>{
      res.send(items)
      console.log(items)
    })
  })

  app.post('/addEvent', (req, res)=>{
    const newEvent = req.body;
    console.log("adding New Event: ", newEvent);
    
    eventCollection.insertOne(newEvent)
    .then(result =>{
      console.log("inserted count",result.insertedCount)
      res.send(result.insertedCount>0)
    })

  })

  app.delete('/deleteEvent/:id', (req, res)=>{
        const id = ObjectID(req.params.id)//the object id is requre from mongodb
        console.log('deleted id', id)
        eventCollection.findOneAndDelete({_id: id})
        .then(documents => res.dend(!!documents))
  })


  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
//   client.close();
});





app.listen(port)