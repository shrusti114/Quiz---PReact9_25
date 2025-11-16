const http = require("http");
const { MongoClient, ObjectId } = require("mongodb");

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
  const server = http.createServer((req, res) => {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));

    const sendJSON = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    req.on("end", async () => {
      try {
        let parsed = {};
        if (body.length > 0) parsed = JSON.parse(body);

        // --------------------------------------------------------
        // 1️⃣ AUTO-INCREMENT STUDENT ID
        // --------------------------------------------------------
        if (req.url === "/Users/nextId" && req.method === "GET") {
          const collection = db.collection("Users");
          const last = await collection.find().sort({ studentId: -1 }).limit(1).toArray();
          const nextId = last.length === 0 ? 1 : last[0].studentId + 1;
          return sendJSON(200, { nextId });
        }

        // --------------------------------------------------------
        // 2️⃣ USER REGISTRATION
        // --------------------------------------------------------
        if (req.url === "/Users/register" && req.method === "POST") {
          const { studentId, username, email, password, degree, collegeName } = parsed;
          const exists = await db.collection("Students").findOne({ email });
          if (exists) return sendJSON(400, { message: "Email already registered" });

          await db.collection("Users").insertOne({ studentId, username, email, password, degree, collegeName });
          return sendJSON(200, { message: "Registration successful" });
        }

        // --------------------------------------------------------
        // 3️⃣ USER LOGIN
        // --------------------------------------------------------
        if (req.url === "/Users/login" && req.method === "POST") {
          const { email, password } = parsed;
          const user = await db.collection("Users").findOne({ email, password });
          if (!user) return sendJSON(401, { message: "Invalid credentials" });

          return sendJSON(200, {
            message: "Login successful",
            username: user.username,
            degree: user.degree,
            email: user.email,
            studentId: user.studentId
          });
        }

        // --------------------------------------------------------
        // 4️⃣ DISPLAY SUBJECTS
        // --------------------------------------------------------
        if (req.url === "/subjects/display" && req.method === "GET") {
          const subjects = await db.collection("subjects").find({}).toArray();
          return sendJSON(200, subjects);
        }

        // --------------------------------------------------------
        // 5️⃣ QUIZZES BY SUBJECT
        // --------------------------------------------------------
        if (req.url.startsWith("/quizzes/by-subject/") && req.method === "GET") {
          const subjectId = req.url.split("/")[3];
          const quizzes = await db.collection("quizzes").find({ subjectId }).toArray();
          return sendJSON(200, quizzes);
        }

        // --------------------------------------------------------
        // 6️⃣ GET QUESTIONS BY QUIZ ID
        // --------------------------------------------------------
        if (req.url.startsWith("/quiz/questions/") && req.method === "GET") {
          let quizId = req.url.split("/")[3];
          try { quizId = new ObjectId(quizId); } catch { return sendJSON(400, { error: "Invalid quiz ID" }); }
          const questions = await db.collection("questions").find({ quizRef: quizId }).toArray();
          return sendJSON(200, questions);
        }

        // --------------------------------------------------------
        // 7️⃣ FULL QUIZ DETAILS (Quiz + Questions)
        // --------------------------------------------------------
        if (req.url.startsWith("/quizzes/full/") && req.method === "GET") {
          let quizId = req.url.split("/")[3];
          let objId;
          try { objId = new ObjectId(quizId); } catch { return sendJSON(400, { error: "Invalid quiz ID" }); }

          const quiz = await db.collection("quizzes").findOne({ _id: objId });
          if (!quiz) return sendJSON(404, { error: "Quiz not found" });

          const questions = await db.collection("questions").find({ quizRef: objId }).toArray();
          return sendJSON(200, { quizName: quiz.quizName, totalMarks: quiz.totalMarks, questions });
        }

        // --------------------------------------------------------
        // 8️⃣ SUBMIT QUIZ
        // --------------------------------------------------------
        if (req.url === "/submit-quiz" && req.method === "POST") {
          const { userAnswers, questions } = parsed;
          let score = 0;
          questions.forEach((q, i) => { if (userAnswers[i] === q.correctAnswer) score += q.marks; });
          return sendJSON(200, { score });
        }

        // --------------------------------------------------------
        // 9️⃣ SAVE RESULT
        // --------------------------------------------------------
        if (req.url === "/save-result" && req.method === "POST") {
          const resultData = {
            studentName: parsed.studentName,
            quizName: parsed.quizName,
            subject: parsed.subject,
            score: parsed.score,
            totalMarks: parsed.totalMarks,
            quizId: parsed.quizId,
            submittedAt: new Date()
          };
          await db.collection("result").insertOne(resultData);
          return sendJSON(200, { message: "Result saved successfully" });
        }

        // --------------------------------------------------------
        // 🔟 GET SINGLE SUBJECT BY ID
        // --------------------------------------------------------
        if (req.url.startsWith("/subject/") && req.method === "GET") {
          const subjectId = req.url.split("/")[2];

          try {
            // Convert to ObjectId if needed
            let objId;
            try { objId = new ObjectId(subjectId); } catch { return sendJSON(400, { error: "Invalid subject ID" }); }

            const subject = await db.collection("subjects").findOne({ _id: objId });
            if (!subject) return sendJSON(404, { error: "Subject not found" });

            return sendJSON(200, subject);
          } catch (err) {
            return sendJSON(500, { error: "Failed to fetch subject" });
          }
        }

        // --------------------------------------------------------
        // ❌ UNKNOWN ROUTE
        // --------------------------------------------------------
        sendJSON(404, { message: "Route not found" });

      } catch (err) {
        console.log("❌ SERVER ERROR:", err);
        sendJSON(500, { error: "Internal Server Error" });
      }
    });
  });

  server.listen(5003, () => {
    console.log("🚀 Server running on PORT 5003");
  });
}
