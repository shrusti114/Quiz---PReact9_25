// server.js
const http = require("http");
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, adminCollection, departments;

async function connectDB() {
  await client.connect();
  db = client.db("admin");
  adminCollection = db.collection("admin");
  departments = db.collection("departments");

  // Ensure default admin exists
  const existingAdmin = await adminCollection.findOne({ username: "Admin@gmail.com" });
  if (!existingAdmin) {
    await adminCollection.insertOne({
      username: "Admin@gmail.com",
      password: "admin@1234",
    });
    console.log("Default admin created: Admin@gmail.com / admin@1234");
  }

  console.log("✅ MongoDB connected to 'admin' database");
}

connectDB();

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.end();

  // ---------- Admin Login ----------
  if (req.url === "/admin/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const { username, password } = JSON.parse(body);
      const admin = await adminCollection.findOne({ username, password });
      if (admin) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Login successful" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid credentials" }));
      }
    });
  }

  // ---------- Get All Departments ----------
  else if (req.url === "/departments" && req.method === "GET") {
    const data = await departments.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  // ---------- Add Department ----------
  else if (req.url === "/departments" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const { department_name } = JSON.parse(body);

      // Auto-generate department_id: D001, D002...
      const lastDept = await departments.find().sort({ department_id: -1 }).limit(1).toArray();
      let newId = "D001";
      if (lastDept.length > 0) {
        const lastNum = parseInt(lastDept[0].department_id.slice(1));
        newId = "D" + String(lastNum + 1).padStart(3, "0");
      }

      const newDept = { department_id: newId, department_name };
      await departments.insertOne(newDept);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newDept));
    });
  }

  // ---------- Update Department ----------
  else if (req.url.startsWith("/departments/") && req.method === "PUT") {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const { department_name } = JSON.parse(body);
      await departments.updateOne({ department_id: id }, { $set: { department_name } });
      const updatedDept = await departments.findOne({ department_id: id });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updatedDept));
    });
  }

  // ---------- Delete Department ----------
  else if (req.url.startsWith("/departments/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    await departments.deleteOne({ department_id: id });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ deletedId: id }));
  }

  // ---------- Not Found ----------
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
