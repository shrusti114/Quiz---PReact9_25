import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherLogin from "./Components/TeacherLogin";
import QuizPage from "./Components/QuizPage"; // ✅ Import QuizPage

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Default route (Login Page) */}
        <Route path="/" element={<TeacherLogin />} />

        {/* 🔹 Quiz Page route */}
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
