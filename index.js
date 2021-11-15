const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.gfkri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("Stedman_Wheel");
    const productsCollection = database.collection("Products");
    const UsersCollection = database.collection("Users");
    const ContactsCollection = database.collection("Contacts");
    const OrdersCollection = database.collection("Orders");
    const ReviewCollection = database.collection("Review");

    //get Products from Database
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = await productsCollection.find(query).toArray();
      res.json(cursor);
    });
    //get single Product from database
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await productsCollection.findOne(query);
      res.json(cursor);
    });
    //add Product in Database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      console.log(result);
      res.json(result);
    });
    // update single product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const newValue = { $set: req.body };
      const cursor = await productsCollection.updateOne(query, newValue);
      res.json(cursor);
    });
    //Delete single Product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await productsCollection.deleteOne(query);
      res.json(cursor);
    });
    // get all Orders from database
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = await OrdersCollection.find(query).toArray();
      res.json(cursor);
    });
    //get all singel user orders from database
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await OrdersCollection.find(query).toArray();
      res.json(cursor);
    });
    //Add Order on database
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await OrdersCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });
    //Update order from database
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const newValue = { $set: req.body };
      const cursor = await OrdersCollection.updateOne(query, newValue);
      res.json(cursor);
    });

    // Delete order from Database
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await OrdersCollection.deleteOne(query);
      res.json(cursor);
    });
    //get all Reviews from the database
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = await ReviewCollection.find(query).toArray();
      res.json(cursor);
    });
    //Add users review into Database
    app.post("/addreview", async (req, res) => {
      const review = req.body;
      const result = await ReviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });
    // add contact form details to database
    app.post("/contact", async (req, res) => {
      const contactForm = req.body;
      const result = await ContactsCollection.insertOne(contactForm);
      console.log(result);
      res.json(result);
    });
    //get user by email

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await UsersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "Admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //add new user into Database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UsersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // add or update user into Database
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await UsersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // add a admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "Admin" } };
      const result = await UsersCollection.updateOne(filter, updateDoc);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
