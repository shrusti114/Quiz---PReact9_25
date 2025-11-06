const http = require("http");
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "Quiz"; // ✅ Database name
let db;

// Connect to MongoDB
MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log("✅ MongoDB connected successfully!");
    startServer();
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

function startServer() {
  const server = http.createServer(async (req, res) => {
    // ✅ Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // ✅ Route 1: Insert user (Registration)
    if (req.url === "/Users/insert" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));

      req.on("end", async () => {
        try {
          const userData = JSON.parse(body);
          const collection = db.collection("Users");

          // Get next studentId (auto-increment)
          const count = await collection.countDocuments();
          const nextId = count + 1;

          const newUser = {
            studentId: nextId,
            username: userData.username,
            email: userData.email,
            collegeName: userData.collegeName,
            degree: userData.degree,
            password: userData.password,
          };

          await collection.insertOne(newUser);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Registration successful", studentId: nextId }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error registering user", error: err.message }));
        }
      });
    }

    // ✅ Route 2: Login user
    else if (req.url === "/Users/login" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));

      req.on("end", async () => {
        try {
          const { email, password } = JSON.parse(body);
          const user = await db.collection("Users").findOne({ email, password });

          if (user) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Login successful" }));
          } else {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid email or password" }));
          }
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error logging in", error: err.message }));
        }
      });
    }

    // ✅ Default Route
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  });

  // ✅ Start server
  const PORT = 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
