import React, { useEffect, useState } from "react";

function Dashboard({ teacher }) {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await fetch("http://localhost:5000/api/departments");
        const subjRes = await fetch("http://localhost:5000/api/subjects");
        setDepartments(await deptRes.json());
        setSubjects(await subjRes.json());
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter(
    (s) => s.department === selectedDept
  );

  return (
    <div style={styles.container}>
      <h2>Welcome, {teacher.name}</h2>
      <p>Department: {teacher.department}</p>

      <div style={styles.dropdownContainer}>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <select style={styles.dropdown}>
          <option value="">Select Subject</option>
          {filteredSubjects.map((sub, index) => (
            <option key={index} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.cardContainer}>
        <div style={styles.card} onClick={() => alert("Go to Create Quiz Page")}>
          Create Quiz
        </div>
        <div style={styles.card} onClick={() => alert("View Profile Page")}>
          Teacher Profile
        </div>
        <div style={styles.card} onClick={() => alert("View Student Page")}>
          View Students
        </div>
        <div style={styles.card} onClick={() => alert("View Results Page")}>
          Student Results
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    color: "#fff",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  dropdownContainer: { display: "flex", gap: "20px", marginTop: "20px" },
  dropdown: { padding: "10px", borderRadius: "6px" },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "40px",
  },
  card: {
    backgroundColor: "#333",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
};

export default Dashboard;
