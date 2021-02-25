const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

const mongoUri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.senq3.mongodb.net/notes?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/note', (req,res)=>{
    var note = {'note':req.body.note};
    insertToDb(note,mongoUri).then(result => res.send(result.insertedId))
})

app.get('/note', (req,res) => {
    var id = req.trailers.id;
    findFromDb('_id',id,mongoUri).then(result => res.send(result));
})

async function findFromDb(field,value,uri){
    const client = new MongoClient(uri);
    await client.connect();
    var db = client.db("notes");
    var result = await db.collection('stored').findOneAndDelete({field:value});
    await client.close()

    return result;
}


async function insertToDb(doc,uri){
    const client = new MongoClient(uri);
    await client.connect();
    var db = client.db("notes");
    var result = await db.collection('stored').insertOne(doc);
    await client.close();

    return result;

}

app.listen(port, ()=>{
    console.log('Listening at port 3000')
})