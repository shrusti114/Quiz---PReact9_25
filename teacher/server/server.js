// ✅ Import dependencies
const http = require("http");
const { MongoClient } = require("mongodb");

// ✅ MongoDB setup
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "Quiz";              // your database name
const collectionName = "teachers";  // your collection name

let db, teacherCollection;

// ✅ Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    teacherCollection = db.collection(collectionName);
    console.log("✅ Connected to MongoDB:", dbName);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

// ✅ Create HTTP Server
const server = http.createServer(async (req, res) => {
  // Allow CORS for frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ✅ 1️⃣ TEACHER LOGIN
  if (req.method === "POST" && req.url === "/login") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ success: false, message: "Email and password required" })
          );
        }

        const teacher = await teacherCollection.findOne({
          teacherEmail: email,
          teacherPassword: password,
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        if (teacher) {
          res.end(JSON.stringify({ success: true, teacher }));
        } else {
          res.end(JSON.stringify({ success: false, message: "Invalid credentials" }));
        }
      } catch (err) {
        console.error("❌ Login Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
  }

  // ✅ 2️⃣ FETCH TEACHER BY EMAIL (for fetching details)
  else if (req.method === "POST" && req.url === "/teachers/fetchByEmail") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", async () => {
      try {
        const { email } = JSON.parse(body);
        if (!email) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: false, message: "Email is required" }));
        }

        const teacher = await teacherCollection.findOne({ teacherEmail: email });

        res.writeHead(200, { "Content-Type": "application/json" });
        if (teacher) {
          res.end(JSON.stringify({ success: true, teacher }));
        } else {
          res.end(JSON.stringify({ success: false, message: "Teacher not found" }));
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
  }

  // ❌ Default route (not found)
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Route not found" }));
  }
});

// ✅ Start server
connectDB().then(() => {
  const PORT = 5002; // Your chosen port
  server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
