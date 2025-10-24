const http = require("http");
const { MongoClient } = require("mongodb");
const yup = require("yup");

const uri = "mongodb://127.0.0.1:27017";
const dbName = "Quiz";
const client = new MongoClient(uri);

// Validation Schemas
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
  teacher_name: yup.string().required(),
  password: yup.string().required(),
  subject_id: yup.string().required(),
});

async function runServer() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const adminCollection = db.collection("Admin");
    const departmentCollection = db.collection("departments");
    const subjectCollection = db.collection("subjects");
    const teacherCollection = db.collection("teachers"); // <-- added

    // Preload default admin
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

      const getRequestBody = async (req) => {
        return new Promise((resolve, reject) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk.toString()));
          req.on("end", () => {
            try {
              resolve(JSON.parse(body || "{}"));
            } catch (err) {
              reject(err);
            }
          });
        });
      };

      // ---------- Admin Login ----------
      if (req.url === "/admin/login" && req.method === "POST") {
        const body = await getRequestBody(req);
        try {
          await adminLoginSchema.validate(body);
          const adminUser = await adminCollection.findOne({ email: body.username, password: body.password });
          if (adminUser) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Login successful" }));
          } else {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid email or password" }));
          }
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      // ---------- Departments ----------
      else if (req.url === "/departments/insert" && req.method === "POST") {
        const body = await getRequestBody(req);
        try {
          await departmentSchema.validate(body);
          await departmentCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Department inserted successfully" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url === "/departments/update" && req.method === "PUT") {
        const body = await getRequestBody(req);
        try {
          await departmentSchema.validate(body);
          const result = await departmentCollection.updateOne(
            { department_id: body.department_id },
            { $set: { department_name: body.department_name } }
          );
          res.writeHead(result.matchedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: result.matchedCount > 0 ? "Department updated successfully" : "Department not found" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url.startsWith("/departments/delete") && req.method === "DELETE") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) return res.end(JSON.stringify({ message: "Department ID required" }));
        const result = await departmentCollection.deleteOne({ department_id: id });
        res.writeHead(result.deletedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: result.deletedCount > 0 ? "Department deleted successfully" : "Department not found" }));
      }

      else if (req.url === "/departments/display" && req.method === "GET") {
        const departments = await departmentCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(departments));
      }

      // ---------- Subjects ----------
      else if (req.url === "/subjects/insert" && req.method === "POST") {
        const body = await getRequestBody(req);
        try {
          await subjectSchema.validate(body);
          if (!body.subject_id) {
            const lastSubj = await subjectCollection.find({}).sort({ subject_id: -1 }).limit(1).toArray();
            const lastNum = lastSubj[0] ? parseInt(lastSubj[0].subject_id.slice(1)) || 0 : 0;
            body.subject_id = "S" + String(lastNum + 1).padStart(3, "0");
          }

          const department = await departmentCollection.findOne({ department_id: body.department_id });
          if (!department) return res.end(JSON.stringify({ message: "Invalid department_id" }));
          body.department_name = department.department_name;

          await subjectCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Subject inserted successfully" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url === "/subjects/update" && req.method === "PUT") {
        const body = await getRequestBody(req);
        try {
          await subjectSchema.validate(body);
          const department = await departmentCollection.findOne({ department_id: body.department_id });
          if (!department) return res.end(JSON.stringify({ message: "Invalid department_id" }));
          body.department_name = department.department_name;

          const result = await subjectCollection.updateOne(
            { subject_id: body.subject_id },
            { $set: { subject_name: body.subject_name, department_id: body.department_id, department_name: body.department_name } }
          );

          res.writeHead(result.matchedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: result.matchedCount > 0 ? "Subject updated successfully" : "Subject not found" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url.startsWith("/subjects/delete") && req.method === "DELETE") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) return res.end(JSON.stringify({ message: "Subject ID required" }));
        const result = await subjectCollection.deleteOne({ subject_id: id });
        res.writeHead(result.deletedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: result.deletedCount > 0 ? "Subject deleted successfully" : "Subject not found" }));
      }

      else if (req.url === "/subjects/display" && req.method === "GET") {
        const subjects = await subjectCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(subjects));
      }

      // ---------- Teachers ----------
      else if (req.url === "/api/teachers" && req.method === "GET") {
        const teachers = await teacherCollection.find({}).toArray();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(teachers));
      }

      else if (req.url === "/api/teachers/insert" && req.method === "POST") {
        const body = await getRequestBody(req);
        try {
          await teacherSchema.validate(body);

          // Auto-generate Teacher_Id like T001, T002...
          const lastTeacher = await teacherCollection.find({}).sort({ teacher_id: -1 }).limit(1).toArray();
          const lastNum = lastTeacher[0] ? parseInt(lastTeacher[0].teacher_id.slice(1)) || 0 : 0;
          body.teacher_id = "T" + String(lastNum + 1).padStart(3, "0");

          // Get department from subject
          const subject = await subjectCollection.findOne({ subject_id: body.subject_id });
          if (!subject) return res.end(JSON.stringify({ message: "Invalid subject_id" }));
          body.department_id = subject.department_id;
          body.department_name = subject.department_name;

          await teacherCollection.insertOne(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Teacher inserted successfully" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url === "/api/teachers/update" && req.method === "PUT") {
        const body = await getRequestBody(req);
        try {
          await teacherSchema.validate(body);

          // Get department from subject
          const subject = await subjectCollection.findOne({ subject_id: body.subject_id });
          if (!subject) return res.end(JSON.stringify({ message: "Invalid subject_id" }));
          body.department_id = subject.department_id;
          body.department_name = subject.department_name;

          const result = await teacherCollection.updateOne(
            { teacher_id: body.teacher_id },
            { $set: {
              teacher_name: body.teacher_name,
              password: body.password,
              subject_id: body.subject_id,
              department_id: body.department_id,
              department_name: body.department_name
            } }
          );
          res.writeHead(result.matchedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: result.matchedCount > 0 ? "Teacher updated successfully" : "Teacher not found" }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      else if (req.url.startsWith("/api/teachers/delete") && req.method === "DELETE") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) return res.end(JSON.stringify({ message: "Teacher ID required" }));
        const result = await teacherCollection.deleteOne({ teacher_id: id });
        res.writeHead(result.deletedCount > 0 ? 200 : 404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: result.deletedCount > 0 ? "Teacher deleted successfully" : "Teacher not found" }));
      }

      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });

    server.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

runServer();
