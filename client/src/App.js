// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Student Pages
import Home from "./components/Student/Home";
import Dashboard from "./components/Student/Dashboard";
import StudRegister from "./components/Student/StudRegister";
import StudLogin from "./components/Student/studLogin"; // lowercase 's'
import About from "./components/Student/About";
import Quiz from "./components/Student/Quiz";
import ThankYou from "./components/Student/ThankYou";
import ChooseSubject from "./components/Student/ChooseSubject";
import Result from "./components/Student/Result"; // <-- Import Result page

// Admin Pages
import AdminLogin from "./components/Admin/AdminLogin";
import TeacherLogin from "./components/Admin/TeacherLogin";
import Contact from "./components/Admin/Contact";
import Department from "./components/Admin/Department";
import Footer from "./components/Admin/Footer";

function App() {
  return (
    <>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sregister" element={<StudRegister />} />
        <Route path="/student/login" element={<StudLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/student/choose-subject" element={<ChooseSubject />} />
        <Route path="/student/quiz" element={<Quiz />} />
        <Route path="/student/result" element={<Result />} /> {/* <-- Add Result route */}
        <Route path="/thankyou" element={<ThankYou />} />

        {/* Admin Routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/teacherlogin" element={<TeacherLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/department" element={<Department />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
