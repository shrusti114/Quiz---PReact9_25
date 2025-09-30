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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>{department} - {subject} Quiz</h2>
      <h3>Time Left: {formatTime(timeLeft)}</h3>

      <div style={{ margin: "20px auto", maxWidth: "600px" }}>
        <h4>Question {currentQ + 1} of {questions.length}</h4>
        <p>{questions[currentQ].question}</p>

        {questions[currentQ].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              display: "block",
              margin: "8px auto",
              padding: "10px 20px",
              borderRadius: "8px",
              background: answers[currentQ] === opt ? "#2196f3" : "#f0f0f0",
              color: answers[currentQ] === opt ? "#fff" : "#000",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "80%",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrev} disabled={currentQ === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentQ === questions.length - 1} style={{ marginLeft: "10px" }}>Next</button>
        <button onClick={handleSubmit} style={{ marginLeft: "10px", background: "green", color: "#fff" }}>Submit</button>
      </div>
    </div>
  );
};

export default Quiz;
