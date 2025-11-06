// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">QuizMaster</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#quiz">Quiz</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/register" className="btn-nav">Register</Link></li>
          <li><Link to="/login" className="btn-nav">Login</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Challenge Your Knowledge!</h1>
        <p>Test yourself, learn new skills, and enjoy interactive quizzes.</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn">Register</Link>
          <Link to="/login" className="btn">Login</Link>
          <Link to="/quizpage" className="btn start-btn">Start Quiz</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-text">
          <h2>About QuizMaster</h2>
          <p>
            QuizMaster is an engaging platform that encourages learners to challenge themselves and expand their knowledge.  
            With a variety of quizzes covering multiple disciplines, users can improve problem-solving skills,  
            critical thinking, and practical knowledge in an interactive and fun way.
          </p>
        </div>
        <div className="about-image">
          <img src="https://source.unsplash.com/400x300/?learning,books" alt="About Illustration" />
        </div>
      </section>

      {/* Quiz Section */}
      <section className="quiz-section" id="quiz">
        <div className="quiz-text">
          <h2>Take a Quiz</h2>
          <p>
            Ready to test your skills? Select a quiz and start challenging yourself today.  
            Improve your knowledge, learn new concepts, and have fun along the way!
          </p>
          <Link to="/quizpage" className="btn start-btn">Start Quiz Now</Link>
        </div>
        <div className="quiz-image">
          <img src="https://source.unsplash.com/400x300/?quiz,challenge" alt="Quiz Illustration" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-text">
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? Reach out to us and we'll get back to you promptly.  
            Your input helps us make QuizMaster better for everyone!
          </p>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
        <div className="contact-image">
          <img src="https://source.unsplash.com/400x300/?contact,message" alt="Contact Illustration" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 QuizMaster. All rights reserved.</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#quiz">Quiz</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>

      {/* Background Animation */}
      <div className="bg-animation">
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      {/* CSS */}
      <style>{`
        .home-container {
          font-family: 'Arial', sans-serif;
          color: #f5f5f5;
          position: relative;
          overflow-x: hidden;
          background-color: #0d0d0d;
        }

        /* Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 25px;
          background: rgba(10,10,10,0.95);
          border-bottom: 2px solid #ffd700;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          font-weight: 500;
          position: fixed;
          width: 95%;
          top: 0;
          z-index: 100;
        }
        .navbar .logo { font-size: 20px; font-weight: 400; color: #ffd700; letter-spacing: 1px; }
        .navbar .nav-links { list-style: none; display: flex; gap: 5px; }
        .navbar .nav-links li a {
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          transition: 0.3s;
        }
        .navbar .nav-links li a:hover { color: #ffd700; text-shadow: 0 0 5px #ffd700; }
        .btn-nav {
          background: #ffd700;
          color: #0d0d0d;
          padding: 5px 10px;
          border-radius: 6px;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn-nav:hover { background: #e6c200; transform: scale(1.05); }

        /* Hero Section */
        .hero-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                      url('https://source.unsplash.com/1600x900/?quiz,learning') center/cover no-repeat;
          padding-top: 55px;
        }
        .hero-section h1 { font-size: 48px; margin-bottom: 20px; animation: fadeIn 2s ease-in-out; text-shadow: 0 0 15px #ffd700; }
        .hero-section p { font-size: 18px; margin-bottom: 30px; color: #e0e0e0; }
        .hero-buttons { display: flex; gap: 20px; flex-wrap: wrap; }
        .btn {
          padding: 12px 28px;
          background-color: #ffd700;
          color: #0d0d0d;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          transition: 0.3s;
          box-shadow: 0 5px 20px rgba(255,215,0,0.4);
        }
        .btn:hover { background-color: #e6c200; transform: scale(1.08); box-shadow: 0 8px 25px rgba(255,215,0,0.6); }

        /* Sections */
        .about-section, .quiz-section, .contact-section { display: flex; align-items: center; justify-content: center; gap: 50px; padding: 80px 50px; flex-wrap: wrap; }
        .about-section { background: #111111; }
        .quiz-section { background: #1a1a1a; }
        .contact-section { background: #111111; }
        .about-text, .quiz-text, .contact-text { max-width: 500px; }
        h2 { font-size: 36px; margin-bottom: 20px; color: #ffd700; text-shadow: 0 0 5px #ffd700; }
        p { font-size: 16px; line-height: 1.5; color: #e0e0e0; }
        .about-image img, .quiz-image img, .contact-image img { width: 400px; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.6); transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .about-image img:hover, .quiz-image img:hover, .contact-image img:hover { transform: scale(1.06); box-shadow: 0 8px 35px rgba(255,215,0,0.4); }
        .quiz-section .start-btn { margin-top: 20px; }

        /* Contact Form */
        .contact-form { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
        .contact-form input, .contact-form textarea { padding: 12px; border-radius: 10px; border: none; font-size: 15px; background: #222; color: #fff; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
        .contact-form input::placeholder, .contact-form textarea::placeholder { color: #ccc; }
        .contact-form button { cursor: pointer; }

        /* Footer */
        .footer { background: #000; padding: 25px 50px; text-align: center; }
        .footer-links a { color: #ffd700; margin: 0 12px; text-decoration: none; transition: 0.3s; }
        .footer-links a:hover { text-decoration: underline; }

        /* Background Animation */
        .bg-animation span { position: absolute; display: block; width: 20px; height: 20px; background: rgba(255, 215, 0, 0.25); animation: animate 18s linear infinite; bottom: -150px; }
        .bg-animation span:nth-child(1) { left: 10%; animation-delay: 0s; }
        .bg-animation span:nth-child(2) { left: 30%; animation-delay: 3s; }
        .bg-animation span:nth-child(3) { left: 50%; animation-delay: 6s; }
        .bg-animation span:nth-child(4) { left: 70%; animation-delay: 9s; }
        .bg-animation span:nth-child(5) { left: 90%; animation-delay: 12s; }

        @keyframes animate { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; } }
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }

        @media screen and (max-width: 768px) {
          .about-section, .quiz-section, .contact-section { flex-direction: column; text-align: center; }
          .about-image img, .quiz-image img, .contact-image img { width: 300px; }
          .hero-section h1 { font-size: 36px; }
          .hero-buttons { flex-direction: column; gap: 15px; }
          .navbar .nav-links { gap: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
