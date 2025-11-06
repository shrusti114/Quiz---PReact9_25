import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuizPage from "./components/QuizPage";
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizpage" element={<QuizPage />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
