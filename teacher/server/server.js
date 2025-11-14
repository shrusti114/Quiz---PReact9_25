const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
let db,
  teacherCollection,
  subjectCollection,
  departmentCollection,
  quizCollection,
  questionCollection,
  userCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("Quiz");
    teacherCollection = db.collection("teachers");
    subjectCollection = db.collection("subjects");
    departmentCollection = db.collection("departments");
    quizCollection = db.collection("quizzes");
    questionCollection = db.collection("questions");
    userCollection = db.collection("users"); // <-- Added users collection
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}
connectDB();

// ---------- TEACHER LOGIN ----------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const teacher = await teacherCollection.findOne({
      teacherEmail: email,
      teacherPassword: password,
    });
    if (!teacher)
      return res
        .status(200)
        .json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- FETCH TEACHER BY EMAIL & SUBJECTS ----------
app.post("/teachers/fetchByEmail", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const teacher = await teacherCollection.findOne({ teacherEmail: email });
    if (!teacher)
      return res.status(200).json({ success: false, message: "Teacher not found" });

    // Fetch subjects from teacher's department
    const subjects = await subjectCollection
      .find({ department_id: teacher.department_id })
      .toArray();

    res.json({
      success: true,
      teacher: {
        teacher_id: teacher.teacher_id,
        teacherName: teacher.teacherName,
        teacherEmail: teacher.teacherEmail,
        department_id: teacher.department_id,
        department_name: teacher.department_name,
      },
      subjects,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- FETCH SUBJECTS BY DEPARTMENT ----------
app.post("/subjects/byDepartment", async (req, res) => {
  try {
    const { department_id } = req.body;
    if (!department_id)
      return res
        .status(400)
        .json({ success: false, message: "department_id is required" });

    const subjects = await subjectCollection
      .find({ department_id })
      .project({ _id: 0, subject_id: 1, subject_name: 1 })
      .toArray();

    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- FETCH ALL SUBJECTS ----------
app.get("/subjects/display", async (req, res) => {
  try {
    const subjects = await subjectCollection.find({}).toArray();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- FETCH DEPARTMENT ----------
app.get("/departments/:department_id", async (req, res) => {
  try {
    const { department_id } = req.params;
    const department = await departmentCollection.findOne({ department_id });
    if (!department)
      return res.json({ success: false, message: "Department not found" });

    res.json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- CREATE QUIZ + STORE QUESTIONS SEPARATELY ----------
app.post("/quizzes/create", async (req, res) => {
  try {
    const { quizName, teacherId, subjectId, questions, totalMarks } = req.body;

    if (!quizName || !questions || !teacherId || !subjectId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // Create quiz record
    const quizDoc = {
      quizName,
      teacherId,
      subjectId,
      totalMarks,
      createdAt: new Date(),
    };

    const quizResult = await quizCollection.insertOne(quizDoc);
    const quizId = quizResult.insertedId;

    // Insert each question into "questions" collection
    const questionDocs = questions.map((q) => ({
      quizRef: quizId,
      question: q.question,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
    }));

    await questionCollection.insertMany(questionDocs);

    res.json({ success: true, quizId });
  } catch (err) {
    console.error("❌ Quiz creation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- FETCH STUDENT BY EMAIL ----------
app.get("/getStudent/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const student = await userCollection.findOne({ email });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
