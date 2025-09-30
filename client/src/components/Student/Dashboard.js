import React, { useEffect } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Navbar from "../Navbar";

// Local images
import adminImg from "../../images/admin1.jpeg";
import teacherImg from "../../images/teacher1.jpeg";
import studentImg from "../../images/student1.jpeg";

// Gooey Card styled
const GooeyCard = styled(CardActionArea)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: "100%",
  borderRadius: "16px",
  transition: "transform 0.4s ease, box-shadow 0.4s ease, opacity 0.6s",
  opacity: 0,
  overflow: "hidden",
  "&.reveal": {
    opacity: 1,
    transform: "translateY(0) rotateX(0) rotateY(0) scale(1)",
  },
  "&:hover": {
    transform: "translateY(-10px) rotateX(5deg) rotateY(5deg) scale(1.05)",
    boxShadow: "0 25px 40px rgba(0,0,0,0.5)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-80%",
    width: "50%",
    height: "100%",
    background: "rgba(255,255,255,0.15)",
    transform: "skewX(-25deg)",
    transition: "all 0.5s",
  },
  "&:hover::after": {
    left: "120%",
  },
  "& img": {
    width: "40%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px 0 0 16px",
    transition: "transform 0.4s ease",
  },
  "&:hover img": {
    transform: "scale(1.1)",
  },
}));

function Dashboard() {
  const navigate = useNavigate();

  const roles = [
    { title: "Admin", img: adminImg, path: "/adminlogin" },
    { title: "Teacher", img: teacherImg, path: "/teacherlogin" },
    { title: "Student", img: studentImg, path: "/sregister" },
  ];

  // Cursor particles effect
  useEffect(() => {
    const createParticle = (x, y) => {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${x + Math.random() * 10 - 5}px`;
      particle.style.top = `${y + Math.random() * 10 - 5}px`;
      particle.style.width = `${6 + Math.random() * 6}px`;
      particle.style.height = particle.style.width;
      particle.style.background = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    };

    const handleMouseMove = (e) => {
      for (let i = 0; i < 3; i++) createParticle(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const revealElements = document.querySelectorAll(".MuiCardActionArea-root");
    const revealOnScroll = () => {
      revealElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight - 50) {
          el.classList.add("reveal");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(-45deg, #1a2a6c, #b21f1f, #fdbb2d, #22c1c3)",
          backgroundSize: "400% 400%",
          animation: "gradientBG 20s ease infinite",
          py: 5,
          overflowX: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ mb: 5, color: "#fff", textShadow: "2px 2px 10px rgba(0,0,0,0.4)" }}
          >
            👨‍💻 Dashboard
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {roles.map((role, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ borderRadius: 3, height: "200px", overflow: "hidden" }}>
                  <GooeyCard onClick={() => navigate(role.path)}>
                    <CardMedia component="img" image={role.img} alt={role.title} />
                    <CardContent sx={{ width: "60%", textAlign: "left" }}>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {role.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to manage {role.title.toLowerCase()} actions.
                      </Typography>
                    </CardContent>
                  </GooeyCard>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <style>
          {`
            @keyframes gradientBG {
              0% {background-position: 0% 50%;}
              50% {background-position: 100% 50%;}
              100% {background-position: 0% 50%;}
            }

            /* Cursor Particles */
            .particle {
              position: fixed;
              width: 8px;
              height: 8px;
              background: rgba(255,255,255,0.7);
              border-radius: 50%;
              pointer-events: none;
              transform: translate(-50%, -50%);
              animation: particleAnim 1s ease-out forwards;
              z-index: 9999;
            }
            @keyframes particleAnim {
              0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
            }
          `}
        </style>
      </Box>
    </>
  );
}

export default Dashboard;
