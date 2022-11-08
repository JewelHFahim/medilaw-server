const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const services =require('./data.json');

// user: mediLaw
// pass: apnmy5nvn2xPAMlz

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.ML_USER}:${process.env.ML_PASSWORD}@cluster0.qez1k8e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('mediLaw').collection('services');

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

    }
    finally{

    }

}
run().catch(error=>console.error(error))



app.get('/', (req, res)=>{
    res.send('MediLaw API Working...!!');
})

// app.get('/services', (req, res)=>{
//     res.send(services)
// })

app.listen(port, ()=>{
    console.log('MediLaw working on:', port);
})