import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all results
  const fetchResults = () => {
    axios.get("http://localhost:5000/admin/results")
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Delete a result
  const deleteResult = (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    axios.delete(`http://localhost:5000/admin/results/${id}`)
      .then(() => fetchResults())
      .catch(err => console.error(err));
  };

  // Filter results by student email
  const filteredResults = results.filter(r =>
    r.studentEmail?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading results...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2>Quiz Results</h2>

      <input
        type="text"
        placeholder="Search by student email"
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

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#003366", color: "white" }}>
            <th style={thStyle}>Student Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Quiz Name</th>
            <th style={thStyle}>Score</th>
            <th style={thStyle}>Total Marks</th>
            <th style={thStyle}>Submitted At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((r, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f0f0f0" : "#ffffff" }}>
              <td style={tdStyle}>{r.studentName}</td>
              <td style={tdStyle}>{r.studentEmail || "N/A"}</td>
              <td style={tdStyle}>{r.quizName}</td>
              <td style={tdStyle}>{r.score}</td>
              <td style={tdStyle}>{r.totalMarks}</td>
              <td style={tdStyle}>{new Date(r.submittedAt).toLocaleString()}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => deleteResult(r._id)}
                  style={{
                    backgroundColor: "#d63031",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredResults.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "10px" }}>
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px", border: "1px solid #fff" };
const tdStyle = { padding: "8px", border: "1px solid #ccc" };
