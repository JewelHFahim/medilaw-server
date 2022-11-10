const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());


// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.ML_USER}:${process.env.ML_PASSWORD}@cluster0.qez1k8e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.body.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ML_ACCESS_KEY,function(error, decoded){
        if(error){
        return res.status(401).send({message: 'unauthorized access' });
        }
        res.decoded = decoded;
        next();
    })
}


async function run(){
    try{
        const serviceCollection = client.db('mediLaw').collection('services');
        const userCollection = client.db('mediLaw').collection('users');
        const reviewCollection = client.db('mediLaw').collection('review');
        const blogCollection = client.db('mediLaw').collection('blog');


        app.post('/jwt', (req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ML_ACCESS_KEY,{expiresIn: '1d'});
            res.send({token})
        })

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

        app.post('/services', async(req, res)=>{
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.send(result);
            console.log(result);
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

        app.get('/review', verifyJWT, async(req, res)=>{
            const query = {};
            const cursor = reviewCollection.find(query).sort({_id:-1}) ;
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

        app.delete('/personalreview/:id', verifyJWT, async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);

        })

        app.patch('/personalreview/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = req.body;
            const option = { upsert: true };
            const updatedDoc = {
                $set:{
                    comment: review.comment
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc, option);
            res.send(result)
        })
        // Review Section End

        // Blog Section Start
        app.get('/blog', async(req, res)=>{
            const query = {};
            const cursor = blogCollection.find(query);
            const result =  await cursor.toArray();
            res.send(result);
        })
        app.get('/blog/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await blogCollection.findOne(query);
            res.send(result);
        })
        // Blog Section End

    }
    finally{

    }

}
run().catch(error=>console.error(error))

app.get('/', (req, res)=>{
    res.send('MediLaw API Working...!!');
})

app.listen(port, ()=>{
    console.log('MediLaw working on:', port);
})