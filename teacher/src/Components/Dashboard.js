import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherDashboard({ teacher, onCreateQuiz, onViewStudents, approach = "normalized" }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    if (!teacher.department_id) return;

    if (approach === "embedded") {
      // Fetch department document with embedded subjects
      fetch(`http://localhost:5002/departments/${teacher.department_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.department && data.department.subjects.length > 0) {
            setSubjects(data.department.subjects);
            setSelectedSubject(data.department.subjects[0].subject_id);
          } else {
            setSubjects([]);
            setSelectedSubject("");
          }
        })
        .catch((err) => {
          console.error("Error fetching embedded subjects:", err);
          toast.error("Failed to fetch subjects. Please try again.");
        });
    } else {
      // Normalized approach: fetch subjects by department_id
      fetch(`http://localhost:5002/subjects/byDepartment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_id: teacher.department_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subjects && data.subjects.length > 0) {
            setSubjects(data.subjects);
            setSelectedSubject(data.subjects[0].subject_id);
          } else {
            setSubjects([]);
            setSelectedSubject("");
          }
        })
        .catch((err) => {
          console.error("Error fetching subjects:", err);
          toast.error("Failed to fetch subjects. Please try again.");
        });
    }
  }, [teacher, approach]);

  const handleCreateQuiz = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject first.");
      return;
    }
    const subject = subjects.find((s) => s.subject_id === selectedSubject);
    if (subject) {
      onCreateQuiz(subject);
      toast.success(`Quiz for "${subject.subject_name}" created successfully!`);
    }
  };

  const styles = {
    container: { padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial" },
    dropdown: { padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" },
    button: { marginLeft: "10px", padding: "8px 15px", fontSize: "16px", borderRadius: "4px", border: "none", cursor: "pointer" },
    createBtn: { backgroundColor: "#4caf50", color: "#fff" },
    viewBtn: { backgroundColor: "#2196f3", color: "#fff", marginTop: "20px" },
    noSubjects: { color: "red", fontWeight: "bold" },
    section: { marginTop: "20px" }
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {teacher.teacherName}</h2>
      <p><strong>Teacher ID:</strong> {teacher.teacher_id}</p>
      <p><strong>Department:</strong> {teacher.department_name}</p>

      <div style={styles.section}>
        <h4>Select a Subject to Create Quiz:</h4>
        {subjects.length === 0 ? (
          <p style={styles.noSubjects}>No subjects available for your department.</p>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              style={styles.dropdown}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name}
                </option>
              ))}
            </select>
            <button style={{ ...styles.button, ...styles.createBtn }} onClick={handleCreateQuiz}>
              Create Quiz
            </button>
          </div>
        )}
      </div>

      <button style={{ ...styles.button, ...styles.viewBtn }} onClick={onViewStudents}>
        👨‍🎓 View Student Scores
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
