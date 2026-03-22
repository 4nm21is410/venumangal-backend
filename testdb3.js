const { MongoClient } = require('mongodb');

// Direct connection to ONE shard only, no replicaSet
const uri = "mongodb://testuser:Test1234@ac-kwdpwea-shard-00-00.yu6v3gn.mongodb.net:27017/VenumangalDB?tls=true&authSource=admin&directConnection=true";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

async function run() {
  try {
    console.log("Attempting direct connection to shard-00-00...");
    await client.connect();
    console.log("✅ Connected!");
  } catch (err) {
    console.log("❌ Error:", err.message);
    // Print each server error individually
    if (err.reason && err.reason.servers) {
      for (const [host, desc] of Object.entries(err.reason.servers)) {
        console.log(`\nServer: ${host}`);
        console.log(`Error: ${desc.error}`);
        console.log(`Type: ${desc.type}`);
      }
    }
  } finally {
    await client.close();
  }
}

run();