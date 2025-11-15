import React, { useState } from "react";

export default function CreateQuiz({ teacher, subject, onBack }) {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 2,
      },
    ]);
  };

  // Remove question
  const removeQuestion = (index) => {
    const newQ = questions.filter((_, idx) => idx !== index);
    setQuestions(newQ);
  };

  // Update question text
  const handleChangeQuestion = (index, value) => {
    const newQ = [...questions];
    newQ[index].question_text = value;
    setQuestions(newQ);
  };

  // Update individual option
  const handleChangeOption = (qIndex, optIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].options[optIndex] = value;
    setQuestions(newQ);
  };

  // Update correct answer
  const handleChangeCorrectAnswer = (index, value) => {
    const newQ = [...questions];
    newQ[index].correctAnswer = value;
    setQuestions(newQ);
  };

  // Update marks dynamically
  const handleChangeMarks = (index, value) => {
    const newQ = [...questions];
    newQ[index].marks = Number(value) || 0;
    setQuestions(newQ);
  };

  const handleSubmit = async () => {
    // Filter out empty questions
    const cleanQuestions = questions.filter((q) => q.question_text.trim() !== "");

    if (!quizName || cleanQuestions.length === 0) {
      alert("Please enter quiz name and at least one question.");
      return;
    }

    const totalMarks = cleanQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quizData = {
      quizName,
      teacherId: teacher._id,
      subjectId: subject.subject_id,
      questions: cleanQuestions,
      totalMarks,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("http://localhost:5002/quizzes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Quiz created successfully!");
        onBack();
      } else {
        alert("❌ Error creating quiz");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Quiz for {subject.subject_name}</h2>

      <input
        type="text"
        placeholder="Enter Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        style={styles.quizInput}
      />

      <hr style={styles.divider} />

      <button style={styles.addBtn} onClick={addQuestion}>
        ➕ Add Question
      </button>

      {questions.map((q, i) => (
        <div key={i} style={styles.questionBlock}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label style={styles.label}>Q{i + 1}</label>
            <button style={styles.removeBtn} onClick={() => removeQuestion(i)}>
              ❌ Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question_text}
            onChange={(e) => handleChangeQuestion(i, e.target.value)}
            style={styles.questionInput}
          />

          <div style={styles.optionsContainer}>
            {q.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                value={opt}
                onChange={(e) => handleChangeOption(i, idx, e.target.value)}
                style={styles.optionInput}
              />
            ))}
          </div>

          <div style={styles.answerRow}>
            <label>Correct Answer:</label>
            <select
              value={q.correctAnswer}
              onChange={(e) => handleChangeCorrectAnswer(i, e.target.value)}
              style={styles.select}
            >
              <option value="">Select</option>
              {q.options.map((_, idx) => (
                <option key={idx} value={String.fromCharCode(65 + idx)}>
                  {String.fromCharCode(65 + idx)}
                </option>
              ))}
            </select>

            <label style={{ marginLeft: "10px" }}>
              Marks:
              <input
                type="number"
                value={q.marks}
                min={1}
                onChange={(e) => handleChangeMarks(i, e.target.value)}
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </label>
          </div>
        </div>
      ))}

      <hr style={styles.divider} />
      <div style={styles.btnContainer}>
        <button style={styles.submitBtn} onClick={handleSubmit}>
          🚀 Submit Quiz
        </button>
        <button style={styles.backBtn} onClick={onBack}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "25px",
    background: "linear-gradient(135deg, #120625ff, #7597de)",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
  },
  heading: { textAlign: "center", fontSize: "26px", fontWeight: "bold", color: "#f1c40f" },
  quizInput: { width: "100%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "none", outline: "none", marginBottom: "15px" },
  addBtn: { backgroundColor: "#00cec9", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "8px", marginBottom: "15px", cursor: "pointer" },
  questionBlock: { backgroundColor: "rgba(22, 10, 10, 0.15)", padding: "15px", borderRadius: "10px", marginBottom: "20px" },
  label: { fontWeight: "bold", fontSize: "18px" },
  removeBtn: { backgroundColor: "#d63031", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  questionInput: { width: "100%", padding: "10px", borderRadius: "8px", border: "none", outline: "none", marginTop: "5px", marginBottom: "10px", backgroundColor: "#fff", color: "#333" },
  optionsContainer: { display: "grid", gap: "6px", marginTop: "10px" },
  optionInput: { padding: "8px", borderRadius: "8px", border: "none", outline: "none", backgroundColor: "#f8f9fa", color: "#333" },
  answerRow: { display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "10px", gap: "15px" },
  select: { padding: "6px", borderRadius: "8px", border: "none", backgroundColor: "#fff", color: "#333" },
  divider: { margin: "20px 0", border: "1px solid rgba(255,255,255,0.3)" },
  btnContainer: { display: "flex", justifyContent: "center", gap: "15px" },
  submitBtn: { backgroundColor: "#00b894", color: "#fff", padding: "12px 25px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" },
  backBtn: { backgroundColor: "#0984e3", color: "#fff", padding: "12px 25px", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" },
};


// import React, { useState } from "react";

// export default function CreateQuiz({ teacher, subject, onBack }) {
//   const [quizName, setQuizName] = useState("");
//   const [questions, setQuestions] = useState(
//     Array.from({ length: 15 }, (_, idx) => ({
//       question: "",
//       options: ["", "", "", ""],
//       correctAnswer: "",
//       marks: 2,
//     }))
//   );

//   // Update question text
//   const handleChangeQuestion = (index, value) => {
//     const newQ = [...questions];
//     newQ[index].question = value;
//     setQuestions(newQ);
//   };

//   // Update individual option
//   const handleChangeOption = (qIndex, optIndex, value) => {
//     const newQ = [...questions];
//     newQ[qIndex].options[optIndex] = value;
//     setQuestions(newQ);
//   };

//   // Update correct answer
//   const handleChangeCorrectAnswer = (index, value) => {
//     const newQ = [...questions];
//     newQ[index].correctAnswer = value;
//     setQuestions(newQ);
//   };

//   const handleSubmit = async () => {
//     const cleanQuestions = questions.map((q) => ({
//       question_text: q.question,
//       options: q.options,
//       correctAnswer: q.correctAnswer,
//       marks: Number(q.marks) || 0,
//     }));

//     const totalMarks = cleanQuestions.reduce((sum, q) => sum + q.marks, 0);

//     const quizData = {
//       quizName,
//       teacherId: teacher._id,
//       subjectId: subject.subject_id,
//       questions: cleanQuestions,
//       totalMarks,
//       createdAt: new Date(),
//     };

//     try {
//       const res = await fetch("http://localhost:5002/quizzes/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quizData),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert("✅ Quiz created successfully!");
//         onBack();
//       } else {
//         alert("❌ Error creating quiz");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Server error");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Create Quiz for {subject.subject_name}</h2>

//       <input
//         type="text"
//         placeholder="Enter Quiz Name"
//         value={quizName}
//         onChange={(e) => setQuizName(e.target.value)}
//         style={styles.quizInput}
//       />

//       <hr style={styles.divider} />

//       {questions.map((q, i) => (
//         <div key={i} style={styles.questionBlock}>
//           <label style={styles.label}>Q{i + 1}</label>
//           <input
//             type="text"
//             placeholder="Enter question"
//             value={q.question}
//             onChange={(e) => handleChangeQuestion(i, e.target.value)}
//             style={styles.questionInput}
//           />

//           <div style={styles.optionsContainer}>
//             {q.options.map((opt, idx) => (
//               <input
//                 key={idx}
//                 type="text"
//                 placeholder={`Option ${String.fromCharCode(65 + idx)}`}
//                 value={opt}
//                 onChange={(e) => handleChangeOption(i, idx, e.target.value)}
//                 style={styles.optionInput}
//               />
//             ))}
//           </div>

//           <div style={styles.answerRow}>
//             <label>Correct Answer:</label>
//             <select
//               value={q.correctAnswer}
//               onChange={(e) => handleChangeCorrectAnswer(i, e.target.value)}
//               style={styles.select}
//             >
//               <option value="">Select</option>
//               {q.options.map((_, idx) => (
//                 <option key={idx} value={String.fromCharCode(65 + idx)}>
//                   {String.fromCharCode(65 + idx)}
//                 </option>
//               ))}
//             </select>
//             <span style={styles.marks}>Marks: {q.marks}</span>
//           </div>
//         </div>
//       ))}

//       <hr style={styles.divider} />
//       <div style={styles.btnContainer}>
//         <button style={styles.submitBtn} onClick={handleSubmit}>
//           🚀 Submit Quiz
//         </button>
//         <button style={styles.backBtn} onClick={onBack}>
//           ⬅ Back
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: "25px",
//     background: "linear-gradient(135deg, #120625ff, #7597de)",
//     color: "#fff",
//     fontFamily: "Poppins, sans-serif",
//   },
//   heading: {
//     textAlign: "center",
//     fontSize: "26px",
//     fontWeight: "bold",
//     color: "#f1c40f",
//   },
//   quizInput: {
//     width: "100%",
//     padding: "12px",
//     fontSize: "16px",
//     borderRadius: "8px",
//     border: "none",
//     outline: "none",
//     marginBottom: "15px",
//   },
//   questionBlock: {
//     backgroundColor: "rgba(22, 10, 10, 0.15)",
//     padding: "15px",
//     borderRadius: "10px",
//     marginBottom: "20px",
//   },
//   label: {
//     fontWeight: "bold",
//     fontSize: "18px",
//   },
//   questionInput: {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "none",
//     outline: "none",
//     marginTop: "5px",
//     marginBottom: "10px",
//     backgroundColor: "#fff",
//     color: "#333",
//   },
//   optionsContainer: {
//     display: "grid",
//     gap: "6px",
//     marginTop: "10px",
//   },
//   optionInput: {
//     padding: "8px",
//     borderRadius: "8px",
//     border: "none",
//     outline: "none",
//     backgroundColor: "#f8f9fa",
//     color: "#333",
//   },
//   answerRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "10px",
//   },
//   select: {
//     padding: "6px",
//     borderRadius: "8px",
//     border: "none",
//     backgroundColor: "#fff",
//     color: "#333",
//   },
//   marks: {
//     color: "#f1c40f",
//     fontWeight: "bold",
//   },
//   divider: { margin: "20px 0", border: "1px solid rgba(255,255,255,0.3)" },
//   btnContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "15px",
//   },
//   submitBtn: {
//     backgroundColor: "#00b894",
//     color: "#fff",
//     padding: "12px 25px",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   backBtn: {
//     backgroundColor: "#0984e3",
//     color: "#fff",
//     padding: "12px 25px",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
// };