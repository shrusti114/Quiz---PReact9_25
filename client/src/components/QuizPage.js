// src/components/QuizPage.js
import React, { useState } from "react";

const QuizPage = () => {
  // Updated quiz questions
  const questions = [
    // Web Development
    {
      question: "Which language is primarily used for building interactive web pages?",
      options: ["HTML", "CSS", "JavaScript", "Python"],
      answer: "JavaScript",
    },
    {
      question: "Which HTML tag is used to link an external CSS file?",
      options: ["<link>", "<style>", "<css>", "<script>"],
      answer: "<link>",
    },

    // Cybersecurity
    {
      question: "What does HTTPS stand for?",
      options: [
        "HyperText Transfer Protocol Secure",
        "HyperText Transfer Protocol Simple",
        "High Transfer Protocol Security",
        "Hyperlink Text Protocol Secure",
      ],
      answer: "HyperText Transfer Protocol Secure",
    },
    {
      question: "Which type of attack tricks users into revealing sensitive information?",
      options: ["Phishing", "Brute Force", "DDoS", "Spoofing"],
      answer: "Phishing",
    },

    // Microbiology
    {
      question: "Which microorganism is used to make yogurt?",
      options: ["E. coli", "Lactobacillus", "Salmonella", "Staphylococcus"],
      answer: "Lactobacillus",
    },
    {
      question: "Which of the following is a virus?",
      options: ["Influenza", "Escherichia coli", "Saccharomyces cerevisiae", "Bacillus subtilis"],
      answer: "Influenza",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Quiz Page</h1>
      {!showScore ? (
        <div style={styles.quizBox}>
          <h2>{questions[current].question}</h2>
          <div style={styles.options}>
            {questions[current].options.map((option, index) => (
              <button
                key={index}
                style={styles.optionButton}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p>
            Question {current + 1} of {questions.length}
          </p>
        </div>
      ) : (
        <div style={styles.quizBox}>
          <h2>Quiz Completed!</h2>
          <p>
            You scored {score} out of {questions.length}
          </p>
          <a href="/" style={styles.homeLink}>Go Back Home</a>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    paddingTop: "100px",
    textAlign: "center",
    background: "#111",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  quizBox: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "#222",
    padding: "30px",
    borderRadius: "10px",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  optionButton: {
    padding: "12px 20px",
    background: "#ffcc00",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  homeLink: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    background: "#ffcc00",
    color: "#000",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default QuizPage;
