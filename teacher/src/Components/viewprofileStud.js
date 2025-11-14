import React, { useState } from "react";

export default function TeacherViewStudent() {
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchStudent = async () => {
    // Reset previous state
    setStudent(null);
    setError("");

    if (!email) {
      setError("Please enter a student email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5002/getStudent/${email}`);

      if (!res.ok) {
        if (res.status === 404) {
          setError("Student not found");
        } else {
          setError("Server error");
        }
        setStudent(null);
        return;
      }

      const data = await res.json();
      setStudent(data);
      setError("");
    } catch (err) {
      setError("Unable to connect to server");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Teacher – View Student Profile</h2>

      <input
        type="text"
        placeholder="Enter student email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #444",
        }}
      />

      <button
        onClick={searchStudent}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Student Profile Display */}
      {student && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          <h3>Student Profile</h3>
          <p>
            <strong>Name:</strong> {student.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {student.email || "N/A"}
          </p>
          <p>
            <strong>Study Level:</strong> {student.studyLevel || "N/A"}
          </p>
          <p>
            <strong>College:</strong> {student.collegeName || "N/A"}
          </p>
          <p>
            <strong>Degree:</strong> {student.degree || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
