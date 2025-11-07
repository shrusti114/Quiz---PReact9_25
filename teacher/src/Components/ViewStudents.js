import React, { useEffect, useState } from "react";

export default function ViewStudents({ teacher, onBack }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5002/quiz/results?teacher_id=${teacher.teacher_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudents(data.results);
      });
  }, [teacher]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Profiles & Scores</h2>
      {students.length === 0 ? (
        <p>No quiz attempts yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Quiz Name</th>
              <th>Department</th>
              <th>Score</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.student_name}</td>
                <td>{s.quiz_name}</td>
                <td>{s.department_name}</td>
                <td>{s.score}</td>
                <td>{s.total_marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={onBack}>Back</button>
    </div>
  );
}
