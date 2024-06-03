const express = require('express')
var cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 6000

app.use(express.json())
app.use(cors({
  origin: '*'
 
}));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdiymxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
    await client.connect();

    const ServicesCollection = client.db("CarDoctor").collection("services");
    const BookingCollection = client.db("CarDoctor").collection("booking");
    const UsersCollection = client.db("CarDoctor").collection("users");

    app.get('/services', async(req, res) => {
      const cursor = ServicesCollection.find();
      const result=await cursor.toArray()
      res.send(result)
      })
    app.get('/users', async(req, res) => {
      const cursor = UsersCollection.find();
      const result=await cursor.toArray()
      res.send(result)
      })
    app.get('/bookings', async(req, res) => {
      
      let query={}
      if(req.query?.email){
        query={email:req.query.email}
      }
      const result =await  BookingCollection.find(query).toArray();
      res.send(result)
      })
    app.get('/checkout/:id', async(req, res) => {
      const id=req.params.id 
      const query={_id:new ObjectId(id)}
    
      const result=await ServicesCollection.findOne(query)
      res.send(result)
      })
      
    app.post('/bookings',async(req,res)=>{
      const bookings=req.body
      const result =await BookingCollection.insertOne(bookings)
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result)
    })
    app.post('/users',async(req,res)=>{
      const users=req.body
      console.log(users)
      const result =await UsersCollection.insertOne(users)
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result)
    })

    app.delete('/bookings/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await BookingCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/bookings/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
     
      const updateBookings=req.body 
      const updatedDOc={
        $set:{
       
          status:updateBookings.status
        }
      }
      const result=await BookingCollection.updateOne(filter,updatedDOc)
      res.send(result)

    })
    app.patch('/users/:email',async(req,res)=>{
      const email=req.params.email
      const filter={email:email}
     console.log(filter)
      const updatedUsers=req.body 
      const updatedDOc={
        $set:{
       
          role:updatedUsers.role
        }
      }
      const result=await UsersCollection.updateOne(filter,updatedDOc)
      console.log(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})