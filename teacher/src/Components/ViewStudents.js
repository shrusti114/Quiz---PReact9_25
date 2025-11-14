import React, { useEffect, useState } from "react";

export default function ViewStudents({
  teacher,
  onBack,
  onViewStudentProfile,
  onDashboard,
  onLogout,
}) {
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState("");

  // Fetch all students (initial load)
  useEffect(() => {
    fetch(`http://localhost:5002/quiz/results?teacher_id=${teacher.teacher_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudents(data.results);
      })
      .catch((err) => console.log("Error fetching students:", err));
  }, [teacher]);

  const handleSearch = () => {
    if (!email.trim()) {
      alert("Please enter a student email.");
      return;
    }

    fetch(`http://localhost:5002/quiz/resultsByEmail?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.results.length > 0) {
          setStudents(data.results);
        } else {
          setStudents([]);
          alert("No results found for this student.");
        }
      })
      .catch((err) => console.log("Error searching student:", err));
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Poppins', sans-serif",
    },
    navbar: {
      background: "#1e40af",
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    },
    navButton: {
      background: "#2563eb",
      borderRadius: "6px",
      padding: "6px 14px",
      fontSize: "14px",
      cursor: "pointer",
      color: "white",
      border: "1px solid rgba(255,255,255,0.4)",
    },
    backButton: {
      background: "transparent",
      color: "white",
      border: "none",
      fontSize: "22px",
      cursor: "pointer",
      marginRight: "10px",
    },
    container: {
      padding: "20px",
      color: "#1e293b",
    },

    searchBox: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },

    input: {
      padding: "10px",
      fontSize: "15px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      width: "260px",
    },

    searchBtn: {
      padding: "10px 15px",
      background: "#10b981",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      background: "white",
      borderRadius: "10px",
      overflow: "hidden",
    },
    thtd: {
      border: "1px solid #cbd5e1",
      padding: "10px",
      textAlign: "left",
    },
    noData: {
      marginTop: "20px",
      fontStyle: "italic",
      color: "#64748b",
    },
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={onBack}>←</button>

        <button style={styles.navButton} onClick={onDashboard}>
          Dashboard
        </button>

        <button style={styles.navButton} onClick={onViewStudentProfile}>
          View Student Profile
        </button>

        <button
          style={styles.navButton}
          onClick={() => {
            localStorage.removeItem("teacher");
            onLogout();
          }}
        >
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <div style={styles.container}>
        <h2>Search Student Quiz Results by Email</h2>

        {/* Search Box */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Enter Student Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button style={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>

        {students.length === 0 ? (
          <p style={styles.noData}>No results found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>Student Name</th>
                <th style={styles.thtd}>Email</th>
                <th style={styles.thtd}>Quiz Name</th>
                <th style={styles.thtd}>Score</th>
                <th style={styles.thtd}>Total Marks</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td style={styles.thtd}>{s.student_name}</td>
                  <td style={styles.thtd}>{s.email}</td>
                  <td style={styles.thtd}>{s.quiz_name}</td>
                  <td style={styles.thtd}>{s.score}</td>
                  <td style={styles.thtd}>{s.total_marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
