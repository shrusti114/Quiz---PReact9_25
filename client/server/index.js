const http = require("http");
const { MongoClient } = require("mongodb");

// ---- MONGO CONNECTION ----
const url = "mongodb://127.0.0.1:27017";
const dbName = "Quiz";
let db;

MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log("✅ MongoDB connected to:", dbName);
    startServer();
  })
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---- START SERVER ----
function startServer() {
  const server = http.createServer(async (req, res) => {

    // CORS SETTINGS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    try {

      // ---------------------------
      // 1️⃣ USER REGISTRATION
      // ---------------------------
      if (req.url === "/Users/register" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());

        req.on("end", async () => {
          const { username, email, password, degree } = JSON.parse(body);

          const existing = await db.collection("Users").findOne({ email });
          if (existing) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Email already registered" }));
            return;
          }

          await db.collection("Users").insertOne({ username, email, password, degree });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Registration successful" }));
        });

        return;
      }

      // ---------------------------
      // 2️⃣ USER LOGIN
      // ---------------------------
      if (req.url === "/Users/login" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());

        req.on("end", async () => {
          const { email, password } = JSON.parse(body);

          const user = await db.collection("Users").findOne({ email, password });
          if (!user) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid credentials" }));
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            message: "Login successful",
            username: user.username,
            email: user.email,
            degree: user.degree
          }));
        });

        return;
      }

      // ---------------------------
      // 3️⃣ FETCH STUDENT BY USERNAME
      // ---------------------------
      if (req.url.startsWith("/student/") && req.method === "GET") {
        const username = req.url.split("/")[2];

        const student = await db.collection("Users").findOne({ username });

        if (!student) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Student not found" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(student));
        return;
      }

      // ---------------------------
      // 4️⃣ GET ALL SUBJECTS
      // ---------------------------
      if ((req.url === "/subjects" || req.url === "/subjects/display") && req.method === "GET") {
        const subjectsCollection = db.collection("subjects");
        const subjects = await subjectsCollection.find({}).toArray();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(subjects));
        return;
      }

      // ---------------------------
      // 5️⃣ GET QUIZ QUESTIONS BY SUBJECT
      // ---------------------------
      if (req.url.startsWith("/quiz/questions/") && req.method === "GET") {
        const subject = decodeURI(req.url.split("/")[3]);

        const questions = await db.collection("quiz").find({ subject }).toArray();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(questions));
        return;
      }

      // ---------------------------
      // ❌ DEFAULT ROUTE
      // ---------------------------
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));

    } catch (err) {
      console.log("❌ SERVER ERROR:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Server error" }));
    }

  });

  server.listen(5003, () => {
    console.log("🚀 Server running on PORT 5003");
  });
}
