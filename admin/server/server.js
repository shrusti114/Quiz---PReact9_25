// server.js
const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = 5001;
const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "admin";
const COLLECTION = "users";

async function startServer() {
  // Connect to MongoDB
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION);

    // Predefined admin credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin@123";

    // Check if admin exists, else insert
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await usersCollection.insertOne({ email: adminEmail, password: adminPassword });
      console.log("✅ Admin account created: admin@gmail.com / admin@123");
    } else {
      console.log("✅ Admin account already exists");
    }

    // Create HTTP server
    const server = http.createServer(async (req, res) => {
      // Enable CORS
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
      }

      // Admin login
      if (req.url === "/admin/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk.toString()));
        req.on("end", async () => {
          try {
            const { email, password } = JSON.parse(body);
            const user = await usersCollection.findOne({ email, password });

            if (user) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true, message: "✅ Admin Login Successful" }));
            } else {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "❌ Invalid credentials" }));
            }
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error", error: err.message }));
          }
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Route not found" }));
      }
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

startServer();