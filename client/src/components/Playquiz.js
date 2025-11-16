import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Playquiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  // ---------------- STUDENT DETAILS ----------------
  const storedStudentId = localStorage.getItem("studentId");

  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!storedStudentId) return;

    axios
      .get(`http://localhost:5003/student/${storedStudentId}`)
      .then((res) => setStudent(res.data))
      .catch(() => console.log("Cannot fetch student"));
  }, [storedStudentId]);

  // ------------------ FETCH QUIZ -------------------
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/quizzes/full/${quizId}`);
        setQuiz(res.data);
        setUserAnswers(Array(res.data.questions.length).fill(""));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz.");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // ---------------- SAVE RESULT --------------------
  const saveResult = async (finalScore) => {
    try {
      await axios.post("http://localhost:5003/save-result", {
        studentName: student?.username,
        studentId: storedStudentId,
        quizName: quiz.quizName,
        subject: quiz.subjectId,
        score: finalScore,
        totalMarks: quiz.totalMarks,
        quizId,
      });
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  // ---------------- SUBMIT QUIZ ---------------------
  const autoSubmit = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:5003/submit-quiz", {
        userAnswers,
        questions: quiz.questions,
      });

      const finalScore = res.data.score;
      setScore(finalScore);

      await saveResult(finalScore);

      // Navigate to Result page
      navigate("/result", {
        state: {
          studentName: student?.username,
          quizName: quiz.quizName,
          subject: quiz.subjectId,
          score: finalScore,
          totalMarks: quiz.totalMarks,
        },
      });
    } catch (err) {
      console.error("Auto-submit error:", err);
    }
  }, [userAnswers, quiz, student, navigate]);

  // ---------------- TIMER ---------------------------
  useEffect(() => {
    if (score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          autoSubmit();
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, autoSubmit]);

  // ---------------- CHANGE ANSWERS -------------------
  const handleAnswerChange = (index, answer) => {
    const updated = [...userAnswers];
    updated[index] = answer;
    setUserAnswers(updated);
  };

  // Manual Submit
  const submitQuiz = async () => {
    autoSubmit();
  };

  // ---------------- TIME FORMAT ---------------------
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---------------- UI RENDER ------------------------
  if (loading) return <p className="whiteText pad20">Loading quiz...</p>;
  if (error) return <p className="whiteText pad20">{error}</p>;

  return (
    <div className="quizContainer">
      <style>{`
        body { background-color: #001f3f; }
        .quizContainer {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 20px;
          color: white;
        }
        .quizBox {
          width: 90%;
          max-width: 700px;
          background: #003366;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 0 15px rgba(0,255,255,0.3);
        }
        .stepper {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }
        .step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #004080;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-weight: bold;
          color: white;
          transition: 0.2s;
        }
        .step.active { background: aqua; color: black; }
        .step.answered { background: #0099cc; }
        .question { margin-bottom: 15px; font-size: 18px; line-height: 1.4; }
        .optionBox {
          margin-bottom: 10px;
          padding: 10px;
          background: #00284d;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }
        .optionBox label { margin-left: 10px; cursor: pointer; }
        .navButtons {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .btn {
          background: aqua;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          color: black;
          transition: 0.2s;
        }
        .btn:hover { transform: scale(1.05); }
        .timer {
          border: 3px solid aqua;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          box-shadow: 0 0 12px aqua;
        }
      `}</style>

      {student && (
        <div style={{ fontSize: "20px", marginBottom: "10px" }}>
          👤 Student: <b>{student.username}</b> ({student.email})
        </div>
      )}

      <div className="timer">⏳ Time Left: {formatTime(timeLeft)}</div>

      <div className="quizBox">
        <h2 style={{ textAlign: "center" }}>📝 {quiz.quizName}</h2>

        <div className="stepper">
          {quiz.questions.map((q, index) => (
            <div
              key={index}
              className={`step ${index === currentStep ? "active" : ""} ${
                userAnswers[index] ? "answered" : ""
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <p className="question">
          <strong>Q{currentStep + 1}:</strong> {quiz.questions[currentStep].question_text}
        </p>

        {quiz.questions[currentStep].options.map((opt, i) => (
          <div className="optionBox" key={i}>
            <input
              type="radio"
              id={`q${currentStep}a${i}`}
              name={`q${currentStep}`}
              checked={userAnswers[currentStep] === opt}
              onChange={() => handleAnswerChange(currentStep, opt)}
            />
            <label htmlFor={`q${currentStep}a${i}`}>{opt}</label>
          </div>
        ))}

        <div className="navButtons">
          <button
            className="btn"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous
          </button>

          {currentStep < quiz.questions.length - 1 ? (
            <button className="btn" onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </button>
          ) : (
            <button className="btn" onClick={submitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
