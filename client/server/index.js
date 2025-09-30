const http = require("http");
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

const dbName = "Quiz"; // Database name
let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Register Student
  if (req.url === "/api/students" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const result = await db.collection("Users").insertOne(data);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, id: result.insertedId }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });

  // Check if student exists by email
  } else if (req.url.startsWith("/api/students") && req.method === "GET") {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const email = urlObj.searchParams.get("email");

      if (!email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Email query param required" }));
        return;
      }

      const student = await db.collection("Users").findOne({ email });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ exists: !!student, student: student || null }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }

  // Login Student (returns studentId, name, email)
  } else if (req.url === "/api/students/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Email and password are required" }));
          return;
        }

        const student = await db.collection("Users").findOne({ email, password });

        if (student) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            success: true,
            message: "Login successful",
            student: {
              studentId: student._id,
              studentName: student.student,
              email: student.email
            }
          }));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Invalid credentials" }));
        }

      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });

  // Route not found
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
