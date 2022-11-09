const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.ML_USER}:${process.env.ML_PASSWORD}@cluster0.qez1k8e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('mediLaw').collection('services');
        const userCollection = client.db('mediLaw').collection('users');
        const reviewCollection = client.db('mediLaw').collection('review');

        // Service Section Start
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        // Service Section End

        // Users Section
        app.post('/users', async(req, res)=>{
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.send(result);
            console.log(result);
        })
        app.get('/users', async(req, res)=>{

            const query = {};
            const cursor = userCollection.find(query);
            const result =  await cursor.toArray();
            res.send(result);
        })
        // USer Section End


        // Review Section
        app.post('/review', async(req, res)=>{
            const service_id = req.params.id;
            const query = {_id: ObjectId(service_id)}
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
            console.log(result);
        })

        app.get('/review', async(req, res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const result =  await cursor.toArray();
            res.send(result);
        })

          app.get('/personalreview', async(req, res)=>{
            const id = req.params.id;
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        app.delete('/personalreview/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);

        })

        // Review Section

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