// StudRegister.js
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar"; // Navbar component

const StudRegister = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [studyLevel, setStudyLevel] = useState("Bachelor");
  const [cardVisible, setCardVisible] = useState(false);

  const bachelorDegrees = [
    "BCA - Bachelor of Computer Applications",
    "BSc Computer Science - Bachelor of Science in Computer Science",
    "BTech CS - Bachelor of Technology in Computer Science",
    "BSc IT - Bachelor of Science in Information Technology",
    "BSc AI - Bachelor of Science in Artificial Intelligence",
    "BSc Data Science - Bachelor of Science in Data Science",
    "BSc Cyber Security - Bachelor of Science in Cyber Security",
  ];

  const postgraduateDegrees = [
    "MSc Computer Science - Master of Science in Computer Science",
    "MSc IT - Master of Science in Information Technology",
    "MSc AI - Master of Science in Artificial Intelligence",
    "MSc Data Science - Master of Science in Data Science",
    "MCA - Master of Computer Applications",
    "MTech CS - Master of Technology in Computer Science",
    "MBA IT - Master of Business Administration in IT",
  ];

  const generateStudentId = (name) => {
    if (!name || name.length < 3) return "";
    const prefix = name.substring(0, 3).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    return prefix + randomDigits;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      studyLevel: "Bachelor",
      collegeName: "",
      degree: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Minimum 3 characters").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      collegeName: Yup.string().required("Required"),
      degree: Yup.string().required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const check = await axios.get(
          `http://localhost:5000/api/students?email=${values.email}`
        );

        if (check.data.exists) {
          alert("Email already registered!");
          return;
        }

        const finalData = {
          studentId,
          username: values.name,
          email: values.email,
          studyLevel,
          collegeName: values.collegeName,
          degree: values.degree,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };

        await axios.post("http://localhost:5000/api/students", finalData);

        if (
          window.confirm(
            "✅ Student Registered Successfully! Click OK to go to Login page."
          )
        ) {
          navigate("/student/login"); // Correct login link
        }

        resetForm();
        setStudentId("");
      } catch (error) {
        console.error(error);
        alert("Registration failed!");
      }
    },
  });

  useEffect(() => {
    if (formik.values.name.length >= 3) {
      setStudentId(generateStudentId(formik.values.name));
    } else {
      setStudentId("");
    }
  }, [formik.values.name]);

  useEffect(() => {
    const timer = setTimeout(() => setCardVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const degreeOptions = studyLevel === "Bachelor" ? bachelorDegrees : postgraduateDegrees;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1a1a1a", // Dark background
        p: 2,
      }}
    >
      <Navbar />

      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box
          className={cardVisible ? "card visible" : "card"}
          sx={{
            p: 5,
            borderRadius: "20px",
            transition: "transform 0.5s ease, opacity 0.5s ease",
            bgcolor: "transparent", // Transparent box
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              textShadow: "2px 2px 10px rgba(0,0,0,0.5)"
            }}
          >
            🎓 Student Registration
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            {/* Student ID */}
            <TextField
              fullWidth
              margin="normal"
              label="Student ID"
              name="studentId"
              value={studentId}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            {/* Username */}
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            {/* Email */}
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            {/* Study Level */}
            <FormControl component="fieldset" margin="normal">
              <Typography sx={{ fontWeight: "medium", color: "#fff", fontSize: '16px' }}>
                Study Level
              </Typography>
              <RadioGroup
                row
                name="studyLevel"
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
              >
                <FormControlLabel
                  value="Bachelor"
                  control={<Radio color="primary" />}
                  label="Bachelor"
                  sx={{ color: "#fff" }}
                />
                <FormControlLabel
                  value="Postgraduate"
                  control={<Radio color="secondary" />}
                  label="Postgraduate"
                  sx={{ color: "#fff" }}
                />
              </RadioGroup>
            </FormControl>

            {/* College Name */}
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: "#fff", fontSize: '16px' }}>College Name</InputLabel>
              <Select
                name="collegeName"
                value={formik.values.collegeName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ color: "#fff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" } }}
              >
                {[
                  "Dolat-Usha Institute of Applied Sciences",
                  "Dhiru-Sarla Institute of Management and Commerce",
                  "Rofel Shri G M Bilakhia College of Pharmacy",
                  "GIDC Degree Engineering College",
                  "Narmada College of Science",
                  "Universal College of Engineering",
                  "Vapi Polytechnic College",
                  "Shree Ramkrishna Institute of Computer Education and Applied Sciences",
                  "Sarvajanik College of Engineering and Technology",
                  "Sardar Vallabhbhai National Institute of Technology (SVNIT)",
                ].map((college) => (
                  <MenuItem key={college} value={college}>
                    {college}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Degree */}
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: "#fff", fontSize: '16px' }}>Degree</InputLabel>
              <Select
                name="degree"
                value={formik.values.degree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ color: "#fff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" } }}
              >
                {degreeOptions.map((deg) => (
                  <MenuItem key={deg} value={deg}>
                    {deg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Password */}
            <TextField
              fullWidth
              type="password"
              margin="normal"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              type="password"
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "10px",
                textTransform: "none",
                background: "#00bcd4",
                "&:hover": { background: "#0097a7" },
              }}
              disabled={!studentId}
            >
              Register
            </Button>

            <Box textAlign="center" mt={2}>
              <Link
                href="/student/login" // Correct link to login page
                sx={{ color: "#00bcd4", textDecoration: "underline", cursor: "pointer" }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Box>
      </Container>

      <Box
        sx={{
          mt: 4,
          py: 2,
          textAlign: "center",
          width: "100%",
          color: "white",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Student Portal | All Rights Reserved
      </Box>

      <style>{`
        .card {
          opacity: 0;
          transform: translateY(-40px);
        }
        .card.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </Box>
  );
};

export default StudRegister;
