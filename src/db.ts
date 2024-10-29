import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://ibhandar:DAFlickpedia12!@ishab.if5u1.mongodb.net/?retryWrites=true&w=majority&appName=IshaB";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase(): Promise<void> {
  try {
    console.log("db.tsx");

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Shows").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export default connectToDatabase;