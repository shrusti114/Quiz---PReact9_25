import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  // Get student from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("studentData"));
    if (!data) {
      navigate("/login");
      return;
    }
    setStudent(data);
  }, [navigate]);

  if (!state || !student) {
    return <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#001f3f", minHeight: "100vh", color: "white", textAlign: "center" }}>
      <h1>📝 Quiz Result</h1>

      {/* Student Info */}
      <div style={{ fontSize: "22px", margin: "20px 0" }}>
        <p>👤 <strong>Name:</strong> {student.username}</p>
        <p>🎓 <strong>Degree:</strong> {student.degree}</p>
        <p>📧 <strong>Email:</strong> {student.email}</p>
      </div>

      {/* Quiz Info */}
      <div style={{ fontSize: "22px", margin: "20px 0" }}>
        <p>📚 <strong>Quiz Name:</strong> {state.quizName}</p>
        <p>✅ <strong>Score:</strong> {state.score} / {state.totalMarks}</p>
      </div>

      <button
        style={{
          padding: "12px 25px",
          background: "aqua",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          color: "black",
          fontWeight: "bold",
          fontSize: "18px",
          marginTop: "30px",
        }}
        onClick={() => navigate("/quiz-list")}
      >
        Back to Quiz List
      </button>
    </div>
  );
}
