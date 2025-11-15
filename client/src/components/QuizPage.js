import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentQuiz() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get student data from localStorage
    const data = JSON.parse(localStorage.getItem("studentData"));

    if (!data) {
      navigate("/StudentLogin"); // Redirect if not logged in
      return;
    }

    setStudent(data);
  }, [navigate]);

  const goToQuizList = () => {
    navigate("/quiz-list"); // Navigate straight to quiz list page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Student Dashboard</h2>

      {student && (
        <div style={styles.studentBox}>
          <p><strong>Name:</strong> {student.username}</p>
          <p><strong>Degree:</strong> {student.degree}</p>
          <p><strong>Email:</strong> {student.email}</p>
        </div>
      )}

      <button style={styles.startBtn} onClick={goToQuizList}>
        🎮 Play Quizzes
      </button>
    </div>
  );
}

// Inline CSS
const styles = {
  container: {
    width: "700px",
    margin: "50px auto",
    padding: "25px",
    background: "#111",
    color: "white",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  studentBox: {
    background: "#222",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  startBtn: {
    width: "100%",
    padding: "12px",
    background: "black",
    border: "2px solid white",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
  },
};


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function StudentQuiz() {
//   const [student, setStudent] = useState(null);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get student data from localStorage
//     const data = JSON.parse(localStorage.getItem("studentData"));

//     if (!data) {
//       navigate("/StudentLogin"); // Redirect if not logged in
//       return;
//     }

//     setStudent(data);

//     // Fetch all subjects from backend
//     axios
//       .get("http://localhost:5003/subjects/display") // Matches updated backend route
//       .then((res) => setSubjects(res.data))
//       .catch((err) => console.log("Error fetching subjects:", err));
//   }, [navigate]);

//   const startQuiz = () => {
//     if (!selectedSubject) {
//       alert("Please select a subject!");
//       return;
//     }
//     navigate(`/quiz/start/${selectedSubject}`);
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>📚 Student Dashboard</h2>

//       {student && (
//         <div style={styles.studentBox}>
//           <p><strong>Name:</strong> {student.username}</p>
//           <p><strong>Degree:</strong> {student.degree}</p>
//           <p><strong>Email:</strong> {student.email}</p>
//         </div>
//       )}

//       <h3 style={styles.subHeading}>Select Subject</h3>

//       {/* Dropdown Box */}
//       <select
//         style={styles.dropdown}
//         value={selectedSubject}
//         onChange={(e) => setSelectedSubject(e.target.value)}
//       >
//         <option value="">-- Choose Subject --</option>
//         {subjects.map((sub) => (
//           <option key={sub._id} value={sub.subject_name}>
//             {sub.subject_name}
//           </option>
//         ))}
//       </select>

//       <button style={styles.startBtn} onClick={startQuiz}>
//         Start Quiz
//       </button>
//     </div>
//   );
// }

// // Inline CSS
// const styles = {
//   container: {
//     width: "700px",
//     margin: "50px auto",
//     padding: "25px",
//     background: "#111",
//     color: "white",
//     borderRadius: "12px",
//     boxShadow: "0 0 10px rgba(255,255,255,0.2)",
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   studentBox: {
//     background: "#222",
//     padding: "15px",
//     borderRadius: "8px",
//     marginBottom: "20px",
//     lineHeight: "1.6",
//   },
//   subHeading: {
//     marginTop: "20px",
//     marginBottom: "10px",
//     borderBottom: "1px solid white",
//     paddingBottom: "5px",
//   },
//   dropdown: {
//     width: "100%",
//     padding: "12px",
//     fontSize: "16px",
//     borderRadius: "8px",
//     background: "#333",
//     color: "white",
//     border: "1px solid white",
//     marginBottom: "20px",
//   },
//   startBtn: {
//     width: "100%",
//     padding: "12px",
//     background: "black",
//     border: "2px solid white",
//     color: "white",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontSize: "18px",
//   },
// };
