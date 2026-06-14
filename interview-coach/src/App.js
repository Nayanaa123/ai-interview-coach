import { useState, useEffect } from "react";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ResumeAnalyzer from "./ResumeAnalyzer";

const roleQuestions = {
  "Frontend Developer": [
    "Tell me about yourself and your experience as a Frontend Developer.",
    "Explain the difference between CSS Flexbox and Grid.",
    "What is React and why is it used?",
    "How do you make a website responsive?",
    "Explain what an API is and how you use it in frontend development."
  ],
  "Backend Developer": [
    "Tell me about yourself and your experience as a Backend Developer.",
    "What is REST API and how does it work?",
    "Explain the difference between SQL and NoSQL databases.",
    "How do you handle authentication in a backend application?",
    "What is middleware and how is it used?"
  ],
  "Full Stack Developer": [
    "Tell me about yourself and your experience as a Full Stack Developer.",
    "Explain the MVC architecture.",
    "How do you connect a React frontend to a Python backend?",
    "What is CORS and why does it occur?",
    "Describe a full stack project you have built."
  ],
  "Data Analyst": [
    "Tell me about yourself and your experience as a Data Analyst.",
    "What is the difference between mean, median, and mode?",
    "How do you handle missing data in a dataset?",
    "What tools have you used for data visualization?",
    "Explain what a pivot table is and when you use it."
  ],
  "Machine Learning Engineer": [
    "Tell me about yourself and your experience in Machine Learning.",
    "What is the difference between supervised and unsupervised learning?",
    "Explain overfitting and how to prevent it.",
    "What is the difference between classification and regression?",
    "Explain how a neural network works in simple terms."
  ],
  "Python Developer": [
    "Tell me about yourself and your experience as a Python Developer.",
    "What are Python decorators and how do you use them?",
    "Explain the difference between a list and a tuple in Python.",
    "What is object oriented programming in Python?",
    "How do you handle exceptions in Python?"
  ],
  "Java Developer": [
    "Tell me about yourself and your experience as a Java Developer.",
    "What is the difference between an interface and an abstract class?",
    "Explain the four pillars of OOP in Java.",
    "What is the difference between ArrayList and LinkedList?",
    "How does garbage collection work in Java?"
  ],
  "DevOps Engineer": [
    "Tell me about yourself and your experience in DevOps.",
    "What is CI/CD and why is it important?",
    "Explain the difference between Docker and a virtual machine.",
    "What is Kubernetes and what problem does it solve?",
    "How do you monitor an application in production?"
  ],
  "Android Developer": [
    "Tell me about yourself and your experience in Android Development.",
    "What is the difference between Activity and Fragment?",
    "Explain the Android Activity lifecycle.",
    "What is RecyclerView and why is it better than ListView?",
    "How do you store data locally in an Android app?"
  ],
  "Cybersecurity Analyst": [
    "Tell me about yourself and your experience in Cybersecurity.",
    "What is the difference between symmetric and asymmetric encryption?",
    "Explain what SQL injection is and how to prevent it.",
    "What is a firewall and how does it work?",
    "What is the difference between authentication and authorization?"
  ]
};

function App() {
  const [step, setStep] = useState("home");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [answerFeedbacks, setAnswerFeedbacks] = useState([]);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setAnswer(transcript);
  }, [transcript]);

  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentQ(0);
    setAnswers([]);
    setAnswer("");
    setAnswerFeedbacks([]);
    setFinalFeedback(null);
    setStep("resume");
  };

  const handleNext = async () => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setLoading(true);

    try {
      const res = await fetch("https://ai-interview-coach-backend-esgc.onrender.com/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          question: questions[currentQ],
          answer: answer
        })
      });
      const data = await res.json();
      setAnswerFeedbacks(prev => [...prev, data]);
    } catch (err) {
      setAnswerFeedbacks(prev => [...prev, null]);
    }

    setLoading(false);
    setAnswer("");
    resetTranscript();
    window.speechSynthesis.cancel();

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      speakQuestion(questions[currentQ + 1]);
    } else {
      setStep("feedback");
    }
  };

  const handleRestart = () => {
    setStep("home");
    setSelectedRole("");
    setCurrentQ(0);
    setAnswers([]);
    setAnswer("");
    setAnswerFeedbacks([]);
    setFinalFeedback(null);
    resetTranscript();
    window.speechSynthesis.cancel();
  };

  const startInterview = () => {
    setStep("interview");
    speakQuestion(roleQuestions[selectedRole][0]);
  };

  const roles = Object.keys(roleQuestions);
  const questions = roleQuestions[selectedRole] || [];
  const progress = ((currentQ + 1) / 5) * 100;

  const btnPrimary = {
    background: "#3b82f6", color: "white", border: "none",
    padding: "12px 32px", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer", flex: 1
  };
  const btnSecondary = {
    background: "transparent", color: "#6b7280",
    border: "1px solid #2d2f3e", padding: "12px 24px",
    borderRadius: "10px", fontSize: "14px", cursor: "pointer"
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f1117",
      color: "#ffffff", fontFamily: "sans-serif",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 20px"
    }}>

      {step === "home" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "64px", height: "64px", background: "#3b82f6",
            borderRadius: "16px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "32px", margin: "0 auto 24px"
          }}>🤖</div>
          <h1 style={{ fontSize: "40px", fontWeight: "700", margin: "0 0 12px" }}>
            AI Interview Coach
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "8px" }}>
            Practice interviews. Get AI feedback. Land your dream job.
          </p>
          <p style={{ color: "#3b82f6", fontSize: "14px", marginBottom: "32px" }}>
            Designed for BTech IT Students • 5 Questions per Role
          </p>
          <button onClick={() => setStep("setup")} style={{ ...btnPrimary, flex: "none" }}>
            Start Interview →
          </button>
          <p
            style={{
              marginTop: "30px",
              color: "#9ca3af",
              fontSize: "14px"
           }}
          >
           Developed by Nayana N S
          </p>
        </div>
      )}

      {step === "setup" && (
        <div style={{ textAlign: "center", maxWidth: "700px", width: "100%" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Select Job Role
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "32px" }}>
            Choose the role you want to practice for — 5 questions each
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px", marginBottom: "24px"
          }}>
            {roles.map(role => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                style={{
                  background: "#1a1d27", color: "white",
                  border: "1px solid #2d2f3e",
                  padding: "20px 16px", borderRadius: "12px",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer"
                }}
              >
                {role}
              </button>
            ))}
          </div>
          <button onClick={() => setStep("home")} style={btnSecondary}>
            ← Back
          </button>
        </div>
      )}

      {step === "resume" && (
        <ResumeAnalyzer
          selectedRole={selectedRole}
          onDone={startInterview}
          onBack={() => setStep("setup")}
        />
      )}

      {step === "interview" && (
        <div style={{ textAlign: "center", maxWidth: "640px", width: "100%" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "16px"
          }}>
            <span style={{
              background: "#1a1d27", border: "1px solid #2d2f3e",
              padding: "6px 14px", borderRadius: "20px",
              fontSize: "13px", color: "#3b82f6", fontWeight: "600"
            }}>
              {selectedRole}
            </span>
            <span style={{ color: "#6b7280", fontSize: "13px" }}>
              Question {currentQ + 1} of 5
            </span>
          </div>

          <div style={{
            background: "#2d2f3e", borderRadius: "8px",
            height: "6px", marginBottom: "20px", overflow: "hidden"
          }}>
            <div style={{
              background: "#3b82f6", height: "100%",
              width: `${progress}%`, transition: "width 0.3s ease"
            }} />
          </div>

          <div style={{
            background: "#1a1d27", border: "1px solid #2d2f3e",
            borderRadius: "12px", padding: "28px",
            margin: "0 0 20px", fontSize: "17px",
            lineHeight: "1.6", textAlign: "left"
          }}>
            💬 {questions[currentQ]}
            <button
              onClick={() => speakQuestion(questions[currentQ])}
              style={{
                background: "transparent", border: "none",
                color: "#3b82f6", cursor: "pointer",
                fontSize: "20px", marginLeft: "10px"
              }}
            >🔊</button>
          </div>

          <div style={{
            background: "#1a1d27",
            border: `2px solid ${listening ? "#10b981" : "#2d2f3e"}`,
            borderRadius: "12px", padding: "16px",
            marginBottom: "16px", minHeight: "80px",
            textAlign: "left", fontSize: "14px",
            color: answer ? "white" : "#6b7280"
          }}>
            {answer || (listening ? "🎤 Listening... speak your answer" : "Your answer will appear here...")}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            {!listening ? (
              <button onClick={startListening} style={{ ...btnPrimary, background: "#10b981" }}>
                🎤 Start Speaking
              </button>
            ) : (
              <button onClick={stopListening} style={{ ...btnPrimary, background: "#ef4444" }}>
                ⏹ Stop Recording
              </button>
            )}
            <button onClick={() => { setAnswer(""); resetTranscript(); }} style={btnSecondary}>
              🔄 Clear
            </button>
          </div>

          <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "12px" }}>
            Or type your answer below
          </p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: "100%", height: "100px",
              background: "#1a1d27", border: "1px solid #2d2f3e",
              borderRadius: "12px", color: "white",
              padding: "16px", fontSize: "14px",
              resize: "none", boxSizing: "border-box", outline: "none"
            }}
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button onClick={() => setStep("resume")} style={btnSecondary}>
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!answer || loading}
              style={{
                ...btnPrimary,
                opacity: answer && !loading ? 1 : 0.5,
                cursor: answer && !loading ? "pointer" : "not-allowed"
              }}
            >
              {loading ? "⏳ Analyzing..." : currentQ + 1 === 5 ? "Finish Interview →" : "Next Question →"}
            </button>
          </div>
        </div>
      )}

      {step === "feedback" && (
        <div style={{ textAlign: "center", maxWidth: "680px", width: "100%" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Interview Complete! 🎉
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            You answered all 5 questions for {selectedRole}
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px", marginBottom: "20px"
          }}>
            {[
              { label: "SCORE", value: answerFeedbacks.length > 0 ? `${Math.round(answerFeedbacks.filter(f => f).reduce((a, b) => a + b.score, 0) / answerFeedbacks.filter(f => f).length)}%` : "N/A", color: "#10b981" },
              { label: "CLARITY", value: answerFeedbacks[0]?.clarity || "N/A", color: "#3b82f6" },
              { label: "CONFIDENCE", value: answerFeedbacks[0]?.confidence || "N/A", color: "#f59e0b" }
            ].map(m => (
              <div key={m.label} style={{
                background: "#1a1d27", border: "1px solid #2d2f3e",
                borderRadius: "12px", padding: "16px"
              }}>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>{m.label}</p>
                <p style={{ color: m.color, fontSize: "24px", fontWeight: "700", margin: 0 }}>{m.value}</p>
              </div>
            ))}
          </div>

          {answerFeedbacks.map((fb, i) => fb && (
            <div key={i} style={{
              background: "#1a1d27", border: "1px solid #2d2f3e",
              borderRadius: "12px", padding: "20px",
              textAlign: "left", marginBottom: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ color: "#3b82f6", fontSize: "13px", fontWeight: "600", margin: 0 }}>
                  Q{i + 1}: {questions[i]}
                </p>
                <span style={{
                  background: fb.score >= 70 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: fb.score >= 70 ? "#10b981" : "#ef4444",
                  border: `1px solid ${fb.score >= 70 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  padding: "2px 10px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap"
                }}>
                  {fb.score}%
                </span>
              </div>

              <p style={{ color: "#10b981", fontWeight: "600", margin: "0 0 6px" }}>✓ Good Points</p>
              <ul style={{ color: "#9ca3af", fontSize: "13px", paddingLeft: "20px", margin: "0 0 12px" }}>
                {fb.good_points?.map((p, j) => <li key={j}>{p}</li>)}
              </ul>

              <p style={{ color: "#ef4444", fontWeight: "600", margin: "0 0 6px" }}>✗ Improvements</p>
              <ul style={{ color: "#9ca3af", fontSize: "13px", paddingLeft: "20px", margin: "0 0 12px" }}>
                {fb.improvements?.map((p, j) => <li key={j}>{p}</li>)}
              </ul>

              <p style={{ color: "#f59e0b", fontWeight: "600", margin: "0 0 4px" }}>💡 Tip</p>
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>{fb.better_answer}</p>
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button onClick={() => handleRoleSelect(selectedRole)} style={btnSecondary}>
              🔄 Retry Same Role
            </button>
            <button onClick={handleRestart} style={btnPrimary}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;