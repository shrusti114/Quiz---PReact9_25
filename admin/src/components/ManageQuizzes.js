import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    quizName: "",
    teacherId: "",
    subjectId: "",
    totalMarks: ""
  });
  const [editingQuizId, setEditingQuizId] = useState(null);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [quizRes, teacherRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/admin/quizzes"),
        axios.get("http://localhost:5000/admin/teachers"),
        axios.get("http://localhost:5000/admin/subjects")
      ]);
      setQuizzes(quizRes.data);
      setTeachers(teacherRes.data);
      setSubjects(subjectRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        totalMarks: Number(formData.totalMarks)
      };

      if (editingQuizId) {
        await axios.put(`http://localhost:5000/admin/quizzes/${editingQuizId}`, payload);
        setEditingQuizId(null);
      } else {
        await axios.post("http://localhost:5000/admin/quizzes", payload);
      }

      setFormData({ quizName: "", teacherId: "", subjectId: "", totalMarks: "" });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle edit
  const handleEdit = (quiz) => {
    setEditingQuizId(quiz._id);
    setFormData({
      quizName: quiz.quizName,
      teacherId: quiz.teacherId, // Directly use teacherId from quiz
      subjectId: quiz.subjectId, // Directly use subjectId from quiz
      totalMarks: quiz.totalMarks
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:5000/admin/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id)); // Optimistic update
    } catch (err) {
      console.error(err);
    }
  };

  // Filter quizzes by search
  const filteredQuizzes = quizzes.filter(q =>
    q.quizName.toLowerCase().includes(search.toLowerCase()) ||
    q.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    q.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2>Manage Quizzes</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by quiz, teacher, or subject"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Quiz Name"
          value={formData.quizName}
          onChange={(e) => setFormData({ ...formData, quizName: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <select
          value={formData.teacherId}
          onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t._id} value={t._id}>{t.username}</option>
          ))}
        </select>

        <select
          value={formData.subjectId}
          onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Total Marks"
          value={formData.totalMarks}
          onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
          required
          style={{ padding: "8px", marginRight: "10px", width: "120px" }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#00b894",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {editingQuizId ? "Update Quiz" : "Add Quiz"}
        </button>
      </form>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#003366", color: "white" }}>
            <th style={thStyle}>Sr No</th>
            <th style={thStyle}>Quiz Name</th>
            <th style={thStyle}>Teacher</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Total Marks</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map((q, idx) => (
            <tr key={q._id} style={{ backgroundColor: idx % 2 === 0 ? "#f0f0f0" : "#ffffff" }}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdStyle}>{q.quizName}</td>
              <td style={tdStyle}>{q.teacherName}</td>
              <td style={tdStyle}>{q.teacherEmail}</td>
              <td style={tdStyle}>{q.subjectName}</td>
              <td style={tdStyle}>{q.totalMarks}</td>
              <td style={tdStyle}>{new Date(q.createdAt).toLocaleString()}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(q)} style={editBtnStyle}>Edit</button>
                <button onClick={() => handleDelete(q._id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredQuizzes.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "10px" }}>
                No quizzes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const thStyle = { padding: "10px", border: "1px solid #fff" };
const tdStyle = { padding: "8px", border: "1px solid #ccc", textAlign: "center" };
const editBtnStyle = { backgroundColor: "#0984e3", color: "#fff", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "5px", cursor: "pointer" };
const deleteBtnStyle = { backgroundColor: "#d63031", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" };
