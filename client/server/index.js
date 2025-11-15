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

    let body = "";
    req.on("data", chunk => body += chunk.toString());

    // Helper to send JSON response
    const sendJSON = (code, data) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    try {
      // ---------------------------
      // 1️⃣ USER REGISTRATION
      // ---------------------------
      if (req.url === "/Users/register" && req.method === "POST") {
        req.on("end", async () => {
          const { username, email, password, degree } = JSON.parse(body);

          const existing = await db.collection("Users").findOne({ email });
          if (existing) return sendJSON(400, { message: "Email already registered" });

          await db.collection("Users").insertOne({ username, email, password, degree });

          sendJSON(200, { message: "Registration successful" });
        });
        return;
      }

      // ---------------------------
      // 2️⃣ USER LOGIN
      // ---------------------------
      if (req.url === "/Users/login" && req.method === "POST") {
        req.on("end", async () => {
          const { email, password } = JSON.parse(body);

          const user = await db.collection("Users").findOne({ email, password });
          if (!user) return sendJSON(401, { message: "Invalid credentials" });

          sendJSON(200, {
            message: "Login successful",
            username: user.username,
            email: user.email,
            degree: user.degree
          });
        });
        return;
      }

      // ---------------------------
      // 3️⃣ FETCH ALL SUBJECTS
      // ---------------------------
      if (req.url === "/subjects/display" && req.method === "GET") {
        const subjects = await db.collection("subjects").find({}).toArray();
        return sendJSON(200, subjects);
      }

      // ---------------------------
      // 4️⃣ GET QUIZZES BY SUBJECT (FROM QUIZ MASTER)
      // ---------------------------
      if (req.url.startsWith("/quizzes/by-subject/") && req.method === "GET") {
        const subjectId = req.url.split("/")[3];

        const quizzes = await db.collection("quizzes").find({ subjectId }).toArray();

        return sendJSON(200, quizzes);
      }

      // ---------------------------
      // 5️⃣ GET QUESTIONS BY QUIZ (using quizRef)
      // ---------------------------
      if (req.url.startsWith("/quiz/questions/") && req.method === "GET") {
        let quizId = req.url.split("/")[3];

        try {
          quizId = new ObjectId(quizId);
        } catch {
          return sendJSON(400, { error: "Invalid quiz ID" });
        }

        const questions = await db.collection("questions").find({
          quizRef: quizId
        }).toArray();

        return sendJSON(200, questions);
      }

      // ---------------------------
      // 6️⃣ GET QUIZ FULL DETAILS (name + questions)
      // ---------------------------
      if (req.url.startsWith("/quizzes/full/") && req.method === "GET") {
        const quizId = req.url.split("/")[3];

        let objId;
        try {
          objId = new ObjectId(quizId);
        } catch {
          return sendJSON(400, { error: "Invalid quiz ID" });
        }

        const quiz = await db.collection("quizzes").findOne({ _id: objId });
        if (!quiz) return sendJSON(404, { error: "Quiz not found" });

        const questions = await db.collection("questions").find({ quizRef: objId }).toArray();

        return sendJSON(200, {
          quizName: quiz.quizName,
          totalMarks: quiz.totalMarks,
          questions
        });
      }

      // ---------------------------
      // 7️⃣ SUBMIT QUIZ & CALCULATE SCORE
      // ---------------------------
      if (req.url === "/submit-quiz" && req.method === "POST") {
        req.on("end", async () => {
          const { userAnswers, questions } = JSON.parse(body);

          let score = 0;

          questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
              score += q.marks;
            }
          });

          return sendJSON(200, { score });
        });
        return;
      }

      // ---------------------------
      // ❌ DEFAULT ROUTE
      // ---------------------------
      sendJSON(404, { error: "Route not found" });

    } catch (err) {
      console.log("❌ SERVER ERROR:", err);
      sendJSON(500, { error: "Internal Server Error" });
    }
  });

  server.listen(5003, () => {
    console.log("🚀 Server running on PORT 5003");
  });
}


// const http = require("http");
// const { MongoClient, ObjectId } = require("mongodb");

// // ---- MONGO CONNECTION ----
// const url = "mongodb://127.0.0.1:27017";
// const dbName = "Quiz";
// let db;

// MongoClient.connect(url)
//   .then((client) => {
//     db = client.db(dbName);
//     console.log("✅ MongoDB connected to:", dbName);
//     startServer();
//   })
//   .catch((err) => console.log("❌ MongoDB Error:", err));

// // ---- START SERVER ----
// function startServer() {
//   const server = http.createServer(async (req, res) => {

//     // CORS SETTINGS
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//     if (req.method === "OPTIONS") {
//       res.writeHead(200);
//       res.end();
//       return;
//     }

//     let body = "";
//     req.on("data", chunk => body += chunk.toString());

//     // Helper to send JSON response
//     const sendJSON = (code, data) => {
//       res.writeHead(code, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(data));
//     };

//     try {
//       // ---------------------------
//       // 1️⃣ USER REGISTRATION
//       // ---------------------------
//       if (req.url === "/Users/register" && req.method === "POST") {
//         req.on("end", async () => {
//           const { username, email, password, degree } = JSON.parse(body);

//           const existing = await db.collection("Users").findOne({ email });
//           if (existing) return sendJSON(400, { message: "Email already registered" });

//           await db.collection("Users").insertOne({ username, email, password, degree });

//           sendJSON(200, { message: "Registration successful" });
//         });
//         return;
//       }

//       // ---------------------------
//       // 2️⃣ USER LOGIN
//       // ---------------------------
//       if (req.url === "/Users/login" && req.method === "POST") {
//         req.on("end", async () => {
//           const { email, password } = JSON.parse(body);

//           const user = await db.collection("Users").findOne({ email, password });
//           if (!user) return sendJSON(401, { message: "Invalid credentials" });

//           sendJSON(200, {
//             message: "Login successful",
//             username: user.username,
//             email: user.email,
//             degree: user.degree
//           });
//         });
//         return;
//       }

//       // ---------------------------
//       // 3️⃣ FETCH ALL SUBJECTS
//       // ---------------------------
//       if (req.url === "/subjects/display" && req.method === "GET") {
//         const subjects = await db.collection("subjects").find({}).toArray();
//         return sendJSON(200, subjects);
//       }

//       // ---------------------------
//       // 4️⃣ GET QUIZZES BY SUBJECT (FROM QUIZ MASTER)
//       // ---------------------------
//       if (req.url.startsWith("/quizzes/by-subject/") && req.method === "GET") {
//         const subjectId = req.url.split("/")[3];

//         const quizzes = await db.collection("quizzes").find({ subjectId }).toArray();

//         return sendJSON(200, quizzes);
//       }

//       // ---------------------------
//       // 5️⃣ GET QUESTIONS BY QUIZ (using quizRef)
//       // ---------------------------
//       if (req.url.startsWith("/quiz/questions/") && req.method === "GET") {
//         let quizId = req.url.split("/")[3];

//         try {
//           quizId = new ObjectId(quizId);
//         } catch {
//           return sendJSON(400, { error: "Invalid quiz ID" });
//         }

//         const questions = await db.collection("questions").find({
//           quizRef: quizId
//         }).toArray();

//         return sendJSON(200, questions);
//       }

//       // ---------------------------
//       // 6️⃣ SUBMIT QUIZ & CALCULATE SCORE
//       // ---------------------------
//       if (req.url === "/submit-quiz" && req.method === "POST") {
//         req.on("end", async () => {
//           const { userAnswers, questions } = JSON.parse(body);

//           let score = 0;

//           questions.forEach((q, index) => {
//             if (userAnswers[index] === q.correctAnswer) {
//               score += q.marks;
//             }
//           });

//           return sendJSON(200, { score });
//         });
//         return;
//       }

//       // ---------------------------
//       // ❌ DEFAULT ROUTE
//       // ---------------------------
//       sendJSON(404, { error: "Route not found" });

//     } catch (err) {
//       console.log("❌ SERVER ERROR:", err);
//       sendJSON(500, { error: "Internal Server Error" });
//     }
//   });

//   server.listen(5003, () => {
//     console.log("🚀 Server running on PORT 5003");
//   });
// }