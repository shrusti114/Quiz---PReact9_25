const http = require("http");
const { MongoClient } = require("mongodb");
const yup = require("yup");

const uri = "mongodb://127.0.0.1:27017";
const dbName = "Quiz";
const client = new MongoClient(uri);

// ✅ Validation Schemas
const adminLoginSchema = yup.object({
  username: yup.string().email().required(),
  password: yup.string().required(),
});

const departmentSchema = yup.object({
  department_id: yup.string().required(),
  department_name: yup.string().required(),
});

const subjectSchema = yup.object({
  subject_id: yup.string(),
  subject_name: yup.string().required(),
  department_id: yup.string().required(),
});

const teacherSchema = yup.object({
  teacher_id: yup.string(),
  teacherName: yup.string().required(),
  teacherEmail: yup.string().email().required(),
  teacherPassword: yup.string().required(),
  department_id: yup.string().required(),
  subject_id: yup.string().nullable(),
});

async function runServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const adminCollection = db.collection("Admin");
    const departmentCollection = db.collection("departments");
    const subjectCollection = db.collection("subjects");
    const teacherCollection = db.collection("teachers");

    // ✅ Default admin
    const defaultAdmin = await adminCollection.findOne({ email: "Admin@gmail.com" });
    if (!defaultAdmin) {
      await adminCollection.insertOne({ email: "Admin@gmail.com", password: "admin@123" });
      console.log("✅ Default admin created");
    }

    const server = http.createServer(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const getBody = async (req) =>
        new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (chunk) => (data += chunk));
          req.on("end", () => {
            try {
              resolve(JSON.parse(data || "{}"));
            } catch (err) {
              reject(err);
            }
          });
        });

      // ---------- ADMIN LOGIN ----------
      if (req.url === "/admin/login" && req.method === "POST") {
        const body = await getBody(req);
        try {
          await adminLoginSchema.validate(body);
          const adminUser = await adminCollection.findOne({
            email: body.username,
            password: body.password,
          });
          if (adminUser) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Login successful" }));
          } else {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid credentials" }));
          }
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      // ---------- DEPARTMENTS ----------
      else if (req.url === "/departments/insert" && req.method === "POST") {
        const body = await getBody(req);
        try {
          await departmentSchema.validate(body);
          await departmentCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Department added successfully" }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      else if (req.url === "/departments/display" && req.method === "GET") {
        const departments = await departmentCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(departments));
      }

      else if (req.url === "/departments/update" && req.method === "PUT") {
        const body = await getBody(req);
        await departmentCollection.updateOne(
          { department_id: body.department_id },
          { $set: { department_name: body.department_name } }
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Department updated successfully" }));
      }

      else if (req.url.startsWith("/departments/delete") && req.method === "DELETE") {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const id = urlObj.searchParams.get("id");
        await departmentCollection.deleteOne({ department_id: id });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Department deleted successfully" }));
      }

      // ---------- SUBJECTS ----------
      else if (req.url === "/subjects/insert" && req.method === "POST") {
        const body = await getBody(req);
        try {
          await subjectSchema.validate(body);

          if (!body.subject_id) {
            const last = await subjectCollection.find({}).sort({ subject_id: -1 }).limit(1).toArray();
            const lastNum = last[0] ? parseInt(last[0].subject_id.slice(1)) : 0;
            body.subject_id = "S" + String(lastNum + 1).padStart(3, "0");
          }

          const dept = await departmentCollection.findOne({ department_id: body.department_id });
          if (!dept) return res.end(JSON.stringify({ message: "Invalid department_id" }));

          body.department_name = dept.department_name;

          await subjectCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Subject added successfully" }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      else if (req.url === "/subjects/display" && req.method === "GET") {
        const subjects = await subjectCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(subjects));
      }

      else if (req.url === "/subjects/update" && req.method === "PUT") {
        const body = await getBody(req);
        try {
          await subjectSchema.validate(body);
          const dept = await departmentCollection.findOne({ department_id: body.department_id });
          if (!dept) return res.end(JSON.stringify({ message: "Invalid department_id" }));

          await subjectCollection.updateOne(
            { subject_id: body.subject_id },
            {
              $set: {
                subject_name: body.subject_name,
                department_id: body.department_id,
                department_name: dept.department_name,
              },
            }
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Subject updated successfully" }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      else if (req.url.startsWith("/subjects/delete") && req.method === "DELETE") {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const id = urlObj.searchParams.get("id");
        await subjectCollection.deleteOne({ subject_id: id });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Subject deleted successfully" }));
      }

      // ---------- TEACHERS ----------
      else if (req.url === "/teachers/display" && req.method === "GET") {
        const teachers = await teacherCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(teachers));
      }

      else if (req.url === "/teachers/insert" && req.method === "POST") {
        const body = await getBody(req);
        try {
          await teacherSchema.validate(body);

          const last = await teacherCollection.find({}).sort({ teacher_id: -1 }).limit(1).toArray();
          const lastNum = last[0] ? parseInt(last[0].teacher_id.slice(1)) : 0;
          body.teacher_id = "T" + String(lastNum + 1).padStart(3, "0");

          const dept = await departmentCollection.findOne({ department_id: body.department_id });
          if (!dept) return res.end(JSON.stringify({ message: "Invalid department_id" }));
          body.department_name = dept.department_name;

          await teacherCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Teacher added successfully" }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      else if (req.url === "/teachers/update" && req.method === "PUT") {
        const body = await getBody(req);
        try {
          await teacherSchema.validate(body);
          await teacherCollection.updateOne(
            { teacher_id: body.teacher_id },
            {
              $set: {
                teacherName: body.teacherName,
                teacherEmail: body.teacherEmail,
                teacherPassword: body.teacherPassword,
                department_id: body.department_id,
              },
            }
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Teacher updated successfully" }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message }));
        }
      }

      else if (req.url.startsWith("/teachers/delete") && req.method === "DELETE") {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const id = urlObj.searchParams.get("id");
        await teacherCollection.deleteOne({ teacher_id: id });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Teacher deleted successfully" }));
      }

      // ---------- NOT FOUND ----------
      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });

    server.listen(5000, () =>
      console.log("🚀 Server running at http://localhost:5000")
    );
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

runServer();
