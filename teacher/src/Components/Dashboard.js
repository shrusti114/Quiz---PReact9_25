import React, { useEffect, useState } from "react"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherDashboard({
  teacher: initialTeacher,
  onCreateQuiz,
  onViewStudents,
  onViewStudentProfile, // This will be called when profile button is clicked
  onLogout,
  approach = "normalized",
}) {
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Persist teacher in localStorage
  useEffect(() => {
    if (initialTeacher) {
      localStorage.setItem("teacher", JSON.stringify(initialTeacher));
      setTeacher(initialTeacher);
    } else {
      const saved = localStorage.getItem("teacher");
      if (saved) setTeacher(JSON.parse(saved));
    }
  }, [initialTeacher]);

  // Dashboard styling
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.background = "#eef3fb";
    document.body.style.fontFamily = "'Poppins', sans-serif";

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      button:hover {
        opacity: 0.9;
      }
      select:hover {
        border-color: #3b82f6;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Fetch subjects
  useEffect(() => {
    if (!teacher?.department_id) return;

    const fetchSubjects = async () => {
      try {
        let data;
        if (approach === "embedded") {
          const res = await fetch(
            `http://localhost:5002/departments/${teacher.department_id}`
          );
          data = await res.json();
          if (data.success && data.department?.subjects?.length > 0) {
            setSubjects(data.department.subjects);
            setSelectedSubject(data.department.subjects[0].subject_id);
          } else {
            setSubjects([]);
            setSelectedSubject("");
          }
        } else {
          const res = await fetch(`http://localhost:5002/subjects/byDepartment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ department_id: teacher.department_id }),
          });
          data = await res.json();
          if (data.success && data.subjects?.length > 0) {
            setSubjects(data.subjects);
            setSelectedSubject(data.subjects[0].subject_id);
          } else {
            setSubjects([]);
            setSelectedSubject("");
          }
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("Failed to fetch subjects. Please try again.");
      }
    };

    fetchSubjects();
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

  // Styles
  const styles = {
    page: { minHeight: "100vh", color: "#1e293b", display: "flex", flexDirection: "column", animation: "fadeIn 0.8s ease-in-out" },
    navbar: { background: "#1e40af", padding: "18px 0", display: "flex", justifyContent: "center", gap: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.2)", alignItems: "center" },
    navButton: { background: "#2563eb", color: "white", border: "1px solid rgba(255,255,255,0.7)", borderRadius: "6px", padding: "8px 20px", fontSize: "15px", cursor: "pointer", fontWeight: "500", transition: "0.3s" },
    container: { background: "white", margin: "40px auto", padding: "40px", borderRadius: "12px", width: "90%", maxWidth: "700px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" },
    heading: { color: "#0f172a", fontSize: "26px", marginBottom: "10px", fontWeight: "600" },
    info: { fontSize: "16px", marginBottom: "8px", color: "#334155" },
    dropdown: { padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#1e293b", outline: "none", transition: "0.3s" },
    button: { marginLeft: "10px", padding: "10px 18px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", transition: "0.3s" },
    createBtn: { background: "#3b82f6", color: "white" },
    viewBtn: { background: "#10b981", color: "white", marginTop: "25px", display: "inline-block" },
    noSubjects: { color: "#dc2626", fontWeight: "600" },
  };

  if (!teacher) return null;

  return (
    <>
      <div style={styles.page}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <button style={styles.navButton} onClick={() => window.location.reload()}>Dashboard</button>
          <button style={styles.navButton} onClick={onViewStudents}>👨‍🎓 View Student Scores</button>
          <button style={styles.navButton} onClick={onViewStudentProfile}>👤 View Student Profile</button>
          <button style={styles.navButton} onClick={() => { localStorage.removeItem("teacher"); onLogout(); }}>Logout</button>
        </div>

        {/* MAIN CONTAINER */}
        <div style={styles.container}>
          <h2 style={styles.heading}>Welcome, {teacher.teacherName}</h2>
          <p style={styles.info}><strong>Teacher ID:</strong> {teacher.teacher_id}</p>
          <p style={styles.info}><strong>Department:</strong> {teacher.department_name}</p>

          {/* SUBJECT SELECT */}
          <div>
            <h4 style={{ color: "#1e293b", marginBottom: "10px" }}>Select a Subject to Create Quiz:</h4>
            {subjects.length === 0 ? (
              <p style={styles.noSubjects}>No subjects available for your department.</p>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <select style={styles.dropdown} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                </select>
                <button style={{ ...styles.button, ...styles.createBtn }} onClick={handleCreateQuiz}>➕ Create Quiz</button>
              </div>
            )}
          </div>

          {/* BOTTOM GREEN BUTTONS */}
          <button style={{ ...styles.button, ...styles.viewBtn }} onClick={onViewStudents}>👨‍🎓 View Student Scores</button>
          <button style={{ ...styles.button, ...styles.viewBtn }} onClick={onViewStudentProfile}>👤 View Student Profile</button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}
