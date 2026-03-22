const { MongoClient } = require('mongodb');

const uri = "mongodb://testuser:Test1234@ac-kwdpwea-shard-00-00.yu6v3gn.mongodb.net:27017,ac-kwdpwea-shard-00-01.yu6v3gn.mongodb.net:27017,ac-kwdpwea-shard-00-02.yu6v3gn.mongodb.net:27017/VenumangalDB?tls=true&replicaSet=atlas-9v4x2m-shard-0&authSource=admin";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  monitorCommands: true,
});

async function run() {
  try {
    console.log("Attempting connection...");
    await client.connect();
    console.log("✅ Connected!");
    const db = client.db("VenumangalDB");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (err) {
    console.log("❌ Error:", err.message);
    console.log("❌ Code:", err.code);
    console.log("❌ Full:", JSON.stringify(err, null, 2));
  } finally {
    await client.close();
  }
}

run();