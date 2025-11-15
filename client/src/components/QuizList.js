import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QuizList() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const navigate = useNavigate();

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5003/subjects/display");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error loading subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Load quizzes for selected subject
  const loadQuizzes = async (subject) => {
    setSelectedSubject(subject);
    setQuizzes([]);
    setLoadingQuizzes(true);

    const subjectId = subject.subject_id; // Use correct field
    try {
      const res = await axios.get(
        `http://localhost:5003/quizzes/by-subject/${subjectId}`
      );
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error loading quizzes:", err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // Navigate to PlayQuiz page
  const startQuiz = (quiz) => {
    navigate(`/start-quiz/${quiz._id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Quiz Selection</h1>

      {!selectedSubject && (
        <>
          <h2 style={styles.subTitle}>Select a Subject</h2>
          <div style={styles.grid}>
            {subjects.map((sub) => (
              <div
                key={sub._id}
                style={styles.subjectCard}
                onClick={() => loadQuizzes(sub)}
              >
                <h3 style={styles.subjectName}>{sub.subject_name}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedSubject && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => {
              setSelectedSubject(null);
              setQuizzes([]);
            }}
          >
            ⬅ Back to Subjects
          </button>

          <h2 style={styles.subTitle}>
            📝 Quizzes for {selectedSubject.subject_name}
          </h2>

          {loadingQuizzes ? (
            <p>Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p style={styles.noQuiz}>No quizzes available.</p>
          ) : (
            <div style={styles.quizGrid}>
              {quizzes.map((quiz) => (
                <div key={quiz._id} style={styles.quizCard}>
                  <h3>{quiz.quizName}</h3>
                  <p>Marks: {quiz.totalMarks}</p>
                  <button
                    style={styles.startBtn}
                    onClick={() => startQuiz(quiz)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: { width: "850px", margin: "40px auto", padding: "20px", background: "#111", color: "white", borderRadius: "12px" },
  title: { textAlign: "center", marginBottom: "25px" },
  subTitle: { marginBottom: "20px", borderBottom: "1px solid white", paddingBottom: "5px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" },
  subjectCard: { background: "#222", padding: "15px", borderRadius: "8px", border: "1px solid white", cursor: "pointer", textAlign: "center", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" },
  subjectName: { fontSize: "16px", fontWeight: "bold" },
  backBtn: { background: "black", border: "1px solid white", padding: "8px 15px", color: "white", borderRadius: "6px", cursor: "pointer", marginBottom: "20px" },
  quizGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
  quizCard: { background: "#222", padding: "15px", borderRadius: "10px", border: "1px solid white", textAlign: "center" },
  startBtn: { marginTop: "10px", padding: "10px", width: "100%", background: "black", color: "white", border: "1px solid white", borderRadius: "8px", cursor: "pointer" },
  noQuiz: { textAlign: "center", opacity: 0.6 },
};
