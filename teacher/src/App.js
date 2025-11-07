import React, { useState } from "react";
import TeacherLogin from "./Components/TeacherLogin";
import Dashboard from "./Components/Dashboard";  // Use Dashboard.js
import CreateQuiz from "./Components/CreateQuiz";
import ViewStudents from "./Components/ViewStudents";

export default function App() {
  const [teacher, setTeacher] = useState(null);
  const [subject, setSubject] = useState(null);
  const [page, setPage] = useState("login");

  if (page === "login")
    return (
      <TeacherLogin
        onLogin={(t) => {
          setTeacher(t);
          setPage("dashboard");
        }}
      />
    );

  if (page === "dashboard")
    return (
      <Dashboard
        teacher={teacher}
        onCreateQuiz={(s) => {
          setSubject(s);
          setPage("createQuiz");
        }}
        onViewStudents={() => setPage("students")}
      />
    );

  if (page === "createQuiz")
    return (
      <CreateQuiz
        teacher={teacher}
        subject={subject}
        onBack={() => setPage("dashboard")}
      />
    );

  if (page === "students")
    return <ViewStudents teacher={teacher} onBack={() => setPage("dashboard")} />;

  return null;
}
