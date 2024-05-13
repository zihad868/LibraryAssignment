const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');



const corsOptions = {
  origin: ['http://localhost:5173/'],
  credentials: true,
  optionSuccessStatus: 200
}


// Middleware
app.use(cors());
app.use(express.json());



// var uri = "mongodb://<username>:<password>@ac-62j8ihz-shard-00-00.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-01.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-02.7lbrva6.mongodb.net:27017/?ssl=true&replicaSet=atlas-g1t94d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-62j8ihz-shard-00-00.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-01.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-02.7lbrva6.mongodb.net:27017/?ssl=true&replicaSet=atlas-g1t94d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const libraryCollection = client.db('LibraryDB').collection('books');

    // Get Book
    app.get('/books', async(req, res) => {
       const books = await libraryCollection.find().toArray();
       res.send(books);
    })

    // Get Book by Id
    app.get('/books/:id', async(req, res) => {
       const id = req.params.id;
       const query = {_id: new ObjectId(id)};
       const result = await libraryCollection.findOne(query);
       res.send(result);
    })

    // Add Book
    app.post('/addBook', async(req, res) => {
      const book = req.body;
      const result = await libraryCollection.insertOne(book);
      res.send(result);
    })


    // Update Book
    app.put('/updateBook/:id', async(req, res) => {
       const updateId = req.params.id;
       const bodyData = req.body;
       const updateBook = { $set: bodyData};
       const query = {_id: new ObjectId(updateId)};
       const result = await libraryCollection.updateOne(query, updateBook);
       res.send(result);
    })

    //Delete Book
    app.delete('/deleteBook/:id', async(req, res) => {
       const id = req.params.id;
       const query = {_id: new ObjectId(id)};
       const result = await libraryCollection.deleteOne(query);
       res.send(result);
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


app.get('/', async(req, res) => {
    res.send("Library server is running")
})


app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})