// src/components/TeacherManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    teacher_name: "",
    password: "",
    subject_id: "",
    department_name: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch teachers from MongoDB
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      toast.error("❌ Failed to fetch teachers");
    }
  };

  // Fetch subjects for dropdown
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/subjects/display");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      toast.error("❌ Failed to fetch subjects");
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    // Auto-fill department based on selected subject
    if (name === "subject_id") {
      const subj = subjects.find((s) => s.subject_id === value);
      newForm.department_name = subj ? subj.department_name : "";
    }

    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/teachers/update`, { ...form, teacher_id: editId });
        toast.success("✅ Teacher updated successfully");
      } else {
        await axios.post(`http://localhost:5000/api/teachers/insert`, form);
        toast.success("✅ Teacher added successfully");
      }
      setForm({ teacher_name: "", password: "", subject_id: "", department_name: "" });
      setEditId(null);
      fetchTeachers();
    } catch (err) {
      console.error("Error saving teacher:", err);
      toast.error("❌ Failed to save teacher");
    }
  };

  const handleEdit = (t) => {
    setEditId(t.teacher_id);
    setForm({
      teacher_name: t.teacher_name,
      password: t.password,
      subject_id: t.subject_id,
      department_name: t.department_name,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/teachers/delete?id=${id}`);
      toast.info("🗑️ Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
      toast.error("❌ Failed to delete teacher");
    }
  };

  // CSS in JS
  const styles = {
    container: { maxWidth: "900px", margin: "20px auto", padding: "20px", background: "#2e2e4f", color: "white", borderRadius: "12px", fontFamily: "Poppins, sans-serif" },
    title: { textAlign: "center", color: "#00e0ff", marginBottom: "20px" },
    form: { display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px" },
    input: { flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "none", fontSize: "16px" },
    readonly: { background: "#555" },
    button: { padding: "10px 20px", background: "#00bfff", border: "none", borderRadius: "6px", color: "white", fontSize: "16px", cursor: "pointer" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { border: "1px solid #555", padding: "10px", textAlign: "left", background: "#1c1c2f", color: "#00e0ff" },
    td: { border: "1px solid #555", padding: "10px", textAlign: "left" },
    editButton: { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#1cc88a", color: "white" },
    deleteButton: { padding: "5px 10px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#e74a3b", color: "white" },
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 style={styles.title}>Teacher Management</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="teacher_name" placeholder="Teacher Name" value={form.teacher_name} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
        <select name="subject_id" value={form.subject_id} onChange={handleChange} required style={styles.input}>
          <option value="">Select Subject</option>
          {subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
        </select>
        <input type="text" value={form.department_name} placeholder="Department" readOnly style={{ ...styles.input, ...styles.readonly }} />
        <button type="submit" style={styles.button}>{editId ? "Update Teacher" : "Add Teacher"}</button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Teacher ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Subject</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.teacher_id}>
              <td style={styles.td}>{t.teacher_id}</td>
              <td style={styles.td}>{t.teacher_name}</td>
              <td style={styles.td}>{subjects.find((s) => s.subject_id === t.subject_id)?.subject_name}</td>
              <td style={styles.td}>{t.department_name}</td>
              <td style={styles.td}>
                <button style={styles.editButton} onClick={() => handleEdit(t)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(t.teacher_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherManagement;
