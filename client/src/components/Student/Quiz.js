import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bcaSubjects from "./bcaSubjects";
import mcsSubjects from "./mcsSubjects";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, department } = location.state || {};

  let questions = [];
  if (department === "BCA" && bcaSubjects[subject]) questions = bcaSubjects[subject];
  else if (department === "MSc CA" && mcsSubjects[subject]) questions = mcsSubjects[subject];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 min

  useEffect(() => {
    if (timeLeft <= 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!subject || questions.length === 0) return <h2>No questions available for {subject}</h2>;

  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => currentQ < questions.length - 1 && setCurrentQ(currentQ + 1);
  const handlePrev = () => currentQ > 0 && setCurrentQ(currentQ - 1);

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => { if (answers[idx] === q.answer) score += 2; });
    navigate("/student/result", {
      state: { score, total: questions.length * 2, subject, department },
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        {department} - {subject} Quiz
      </h2>
      <h3 style={{ marginBottom: "20px", color: "#ffcc00" }}>
        Time Left: {formatTime(timeLeft)}
      </h3>

      <div
        style={{
          margin: "20px auto",
          maxWidth: "700px",
          padding: "20px",
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h4 style={{ marginBottom: "15px" }}>
          Question {currentQ + 1} of {questions.length}
        </h4>
        <p style={{ fontSize: "18px", fontWeight: "500" }}>
          {questions[currentQ].question}
        </p>

        {questions[currentQ].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              display: "block",
              margin: "12px auto",
              padding: "12px 20px",
              borderRadius: "8px",
              background: answers[currentQ] === opt ? "#2196f3" : "#f7f7f7",
              color: answers[currentQ] === opt ? "#fff" : "#000",
              border: "2px solid #2196f3",
              cursor: "pointer",
              width: "90%",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "25px" }}>
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: currentQ === 0 ? "#ccc" : "#ff9800",
            color: "#fff",
            cursor: currentQ === 0 ? "not-allowed" : "pointer",
            marginRight: "10px",
            fontSize: "15px",
          }}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentQ === questions.length - 1}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: currentQ === questions.length - 1 ? "#ccc" : "#2196f3",
            color: "#fff",
            cursor: currentQ === questions.length - 1 ? "not-allowed" : "pointer",
            marginRight: "10px",
            fontSize: "15px",
          }}
        >
          Next
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "green",
            color: "#fff",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Quiz;
