const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app= express();
const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.10zxl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("trueWayBlog");
    const blogCollection = db.collection("blogs");

    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();

      res.send({ status: true, data: blog });
    });

    app.post("/blog", async (req, res) => {
      const blog = req.body;

      const result = await blogCollection.insertOne(blog);

      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const blog= req.body;
      const filter= {_id: ObjectId(id)};
      const options= {upsert: true};
      const updateDoc={
        $set: blog
      }
      const result = await blogCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    
  } finally {
  }
};

run().catch((err) => console.log(err));


app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.listen(port,()=>{
    console.log(`Listenint to port ${port}`);
})