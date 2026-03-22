const mongoose = require('mongoose');

const uri = "mongodb://testuser:Test1234@ac-kwdpwea-shard-00-00.yu6v3gn.mongodb.net:27017,ac-kwdpwea-shard-00-01.yu6v3gn.mongodb.net:27017,ac-kwdpwea-shard-00-02.yu6v3gn.mongodb.net:27017/VenumangalDB?tls=true&replicaSet=atlas-9v4x2m-shard-0&authSource=admin";

mongoose.set('debug', true);

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
})
.then(() => {
  console.log("✅ Connected successfully!");
  process.exit(0);
})
.catch(err => {
  console.log("❌ Error name:", err.name);
  console.log("❌ Error message:", err.message);
  if (err.reason) {
    err.reason.servers.forEach((server, key) => {
      console.log(`Server: ${key}`);
      console.log(`Error: ${server.error}`);
    });
  }
  process.exit(1);
});