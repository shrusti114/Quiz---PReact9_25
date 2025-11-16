import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";
import Playquiz from "./components/Playquiz";
import QuizList from "./components/QuizList";
import ResultPage from "./components/ResultPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizpage" element={<QuizPage />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/start-quiz/:quizId" element={<Playquiz />} />
        <Route path="/result" element={<ResultPage />} /> {/* Fixed route */}
      </Routes>
    </Router>
  );
}

export default App;
