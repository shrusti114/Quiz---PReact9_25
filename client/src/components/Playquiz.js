import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Playquiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/quizzes/full/${quizId}`);
        setQuiz(res.data);
        setUserAnswers(new Array(res.data.questions.length).fill(""));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post("http://localhost:5003/submit-quiz", {
        userAnswers,
        questions: quiz.questions
      });
      setScore(res.data.score);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Try again.");
    }
  };

  const goToStep = (index) => setCurrentStep(index);

  if (loading) return <p style={{ color: "white", padding: "20px" }}>Loading quiz...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ color: "black", padding: "20px" }}>
      <h2>📝 Play Quiz</h2>
      <p><strong>Quiz Name:</strong> {quiz.quizName}</p>

      {quiz.questions.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No questions found for this quiz.</p>
      ) : (
        <div>
          {/* Horizontal Stepper */}
          <div style={{ display: "flex", marginBottom: "20px", flexWrap: "wrap" }}>
            {quiz.questions.map((q, index) => (
              <div
                key={index}
                onClick={() => goToStep(index)}
                style={{
                  cursor: "pointer",
                  padding: "10px 15px",
                  marginRight: "5px",
                  borderRadius: "50%",
                  backgroundColor: index === currentStep ? "#4caf50" : userAnswers[index] ? "#2196f3" : "#ddd",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  minWidth: "40px"
                }}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Current Question */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ marginBottom: "20px" }}>
              <p><strong>Q{currentStep + 1}:</strong> {quiz.questions[currentStep].question_text}</p>
              {quiz.questions[currentStep].options.map((opt, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    id={`q${currentStep}a${i}`}
                    name={`q${currentStep}`}
                    value={opt}
                    checked={userAnswers[currentStep] === opt}
                    onChange={() => handleAnswerChange(currentStep, opt)}
                  />
                  <label htmlFor={`q${currentStep}a${i}`}>{opt}</label>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div style={{ marginTop: "10px" }}>
              <button type="button" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0} style={{ marginRight: "10px" }}>
                Previous
              </button>

              {currentStep < quiz.questions.length - 1 ? (
                <button type="button" onClick={() => goToStep(currentStep + 1)}>Next</button>
              ) : (
                <button type="button" onClick={submitQuiz}>Submit Quiz</button>
              )}
            </div>

            <p style={{ marginTop: "10px", opacity: 0.7 }}>
              Question {currentStep + 1} of {quiz.questions.length}
            </p>
          </form>
        </div>
      )}

      {score !== null && <h2>Your Score: {score} / {quiz.totalMarks}</h2>}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// export default function Playquiz() {
//   const { quizId } = useParams();
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [score, setScore] = useState(null);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5003/quizzes/full/${quizId}`);
//         console.log("Full Quiz object:", res.data);

//         setQuiz(res.data);
//         setUserAnswers(new Array(res.data.questions.length).fill("")); // initialize answers
//         setLoading(false);

//         if (res.data.questions.length === 0) {
//           console.warn("No questions found for this quiz!");
//         } else {
//           console.log("Questions:", res.data.questions);
//         }
//       } catch (err) {
//         console.error("Error fetching quiz:", err);
//         setError("Failed to load quiz. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [quizId]);

//   const handleAnswerChange = (index, answer) => {
//     const updatedAnswers = [...userAnswers];
//     updatedAnswers[index] = answer;
//     setUserAnswers(updatedAnswers);
//   };

//   const submitQuiz = async () => {
//     try {
//       const res = await axios.post("http://localhost:5003/submit-quiz", {
//         userAnswers,
//         questions: quiz.questions
//       });
//       setScore(res.data.score);
//     } catch (err) {
//       console.error("Error submitting quiz:", err);
//       alert("Failed to submit quiz. Try again.");
//     }
//   };

//   if (loading) return <p style={{ color: "white", padding: "20px" }}>Loading quiz...</p>;
//   if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

//   return (
//     <div style={{ color: "black", padding: "20px" }}>
//       <h2>📝 Play Quiz</h2>
//       <p><strong>Quiz Name:</strong> {quiz.quizName}</p>

//       {quiz.questions.length === 0 ? (
//         <p style={{ opacity: 0.7 }}>No questions found for this quiz.</p>
//       ) : (
//         <form onSubmit={(e) => e.preventDefault()}>
//           {quiz.questions.map((q, index) => (
//             <div key={q._id} style={{ marginBottom: "20px" }}>
//               <p><strong>Q{index + 1}:</strong> {q.question_text}</p>
//               {q.options.map((opt, i) => (
//                 <div key={i}>
//                   <input
//                     type="radio"
//                     id={`q${index}a${i}`}
//                     name={`q${index}`}
//                     value={opt}
//                     checked={userAnswers[index] === opt}
//                     onChange={() => handleAnswerChange(index, opt)}
//                   />
//                   <label htmlFor={`q${index}a${i}`}>{opt}</label>
//                 </div>
//               ))}
//             </div>
//           ))}

//           <button type="button" onClick={submitQuiz} style={{ marginTop: "10px" }}>
//             Submit Quiz
//           </button>
//         </form>
//       )}

//       {score !== null && <h2>Your Score: {score} / {quiz.totalMarks}</h2>}
//     </div>
//   );
// }
