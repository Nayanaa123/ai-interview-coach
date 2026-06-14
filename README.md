# 🤖 AI Interview Coach

A full-stack AI-powered interview preparation platform built for BTech IT students. Practice technical interviews with voice/text answers, get real-time AI feedback, and check your resume's ATS compatibility — all in one app.

![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-purple)
![Status](https://img.shields.io/badge/Status-Working-success)

---

## 🚀 Overview

AI Interview Coach helps BTech IT students prepare for technical interviews by:
- Analyzing their resume for ATS compatibility
- Conducting realistic mock interviews with voice or text
- Providing instant AI-generated feedback on each answer
- Highlighting missing skills based on the selected job role

---

## ✨ Features

### 📄 Resume ATS Analyzer
- Upload resume as PDF
- Get ATS compatibility score
- See skills found vs missing for your selected role
- Get tips to improve your resume

### 🎤 Mock Interview
- 10 job roles to choose from
- 5 role-specific questions per session
- Answer using **voice** (speech-to-text) or **text**
- AI reads questions aloud (text-to-speech)
- Progress bar tracks interview progress

### 🤖 AI Feedback (Powered by Groq + Llama 3.3)
- Score (0-100%) for each answer
- Clarity and confidence rating
- Good points and areas to improve
- Suggested better answer for each question
- Overall session score summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Speech | Web Speech API (Recognition + Synthesis) |
| Resume Parsing | PDF.js |
| Backend | FastAPI (Python) |
| AI Model | Groq API — Llama 3.3 70B |
| Validation | Pydantic |

---

---

## ⚙️ How To Run This Project (Step-by-Step)

> 📌 Follow these steps every time you set up the project on a new machine.

### Prerequisites — Install these first

| Tool | Check version | Download |
|------|--------------|----------|
| Node.js (v18+) | `node --version` | [nodejs.org](https://nodejs.org) |
| Python (3.10+) | `python --version` | [python.org](https://python.org) |
| Git | `git --version` | [git-scm.com](https://git-scm.com) |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Nayanaa123/ai-interview-coach.git
cd ai-interview-coach
```

---

### Step 2 — Get a FREE Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign in with Google
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

---

### Step 3 — Setup Backend (FastAPI)

```bash
cd interview-backend
pip install -r requirements.txt --break-system-packages
```

Create a new file called `.env` inside `interview-backend/`:
GROQ_API_KEY=paste_your_groq_key_here
Run the backend server:
```bash
uvicorn main:app --reload
```

✅ Backend should now be running at:
http://127.0.0.1:8000
Test it by opening that URL in browser — you should see:
```json
{"message": "Interview Coach API is running!"}
```

---

### Step 4 — Setup Frontend (React)

Open a **new terminal** (keep backend running in the first one):

```bash
cd interview-coach
npm install
npm start
```

✅ Frontend should now be running at:http://localhost:3000
Your browser will open automatically.

---

### ⚠️ Important Notes for Future Setup

- **Both servers must run together** — backend (port 8000) AND frontend (port 3000)
- If you get CORS errors, check that backend `main.py` has:
```python
  allow_origins=["http://localhost:3000"]
```
- If `npm install` shows vulnerabilities — ignore them, they're normal
- If Groq gives quota errors — check [console.groq.com](https://console.groq.com) for usage limits
- `.env` file is never pushed to GitHub (for security) — you must create it manually each time you clone

---

## ▶️ How to Use the App

1. Open `http://localhost:3000`
2. Click **Start Interview**
3. Select your target job role (e.g., Python Developer)
4. Upload your resume (PDF) → view ATS score and missing skills
5. Click **Start Interview Practice**
6. Answer 5 questions using:
   - 🎤 **Start Speaking** (voice input), or
   - ⌨️ Type in the text box
7. Click **Next Question** → AI analyzes your answer instantly
8. After Q5, view your complete performance report

---
## 📸 Project Screenshots

### Home Page
![Home Page](./screenshot/Screenshot%202026-06-14%20141539.png)

### Job Role Selection
![Job Role Selection](./screenshot/Screenshot%202026-06-14%20141615.png)

### Resume Upload
![Resume Upload](./screenshot/Screenshot%202026-06-14%20141633.png)

### Performance Analysis
![Performance Analysis](./screenshot/Screenshot%202026-06-14%20141648.png)

### AI Feedback
![Example question](./screenshot/Screenshot%202026-06-14%20141708.png)

### Interview Feedback
![Example 2](./screenshot/Screenshot%202026-06-14%20141725.png)

### Detailed Evaluation
![Example 3](./screenshot/Screenshot%202026-06-14%20141741.png)

### Technical Feedback
![AI Feedback](./screenshot/Screenshot%202026-06-14%20141757.png)


## 🎯 Supported Job Roles
Frontend Developer
Backend Developer
Full Stack Developer
Data Analyst
Machine Learning Engineer
Python Developer
Java Developer
DevOps Engineer
Android Developer
Cybersecurity Analyst
---

## 🔌 API Endpoints (Backend Reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check — confirms API is running |
| POST | `/analyze-answer` | Analyzes one Q&A, returns score + feedback |
| POST | `/final-feedback` | Analyzes full session, returns overall report |

### Example request to `/analyze-answer`:
```json
{
  "role": "Python Developer",
  "question": "What are Python decorators?",
  "answer": "Decorators modify function behavior..."
}
```

### Example response:
```json
{
  "score": 75,
  "clarity": "Good",
  "confidence": "High",
  "good_points": ["..."],
  "improvements": ["..."],
  "better_answer": "..."
}
```

---

## 🔮 Future Enhancements

- [ ] User authentication and saved history
- [ ] PDF report download of interview results
- [ ] AI-generated questions based on uploaded resume
- [ ] Video-based body language analysis
- [ ] Multi-language support
- [ ] Cloud deployment (Render + Vercel)

---

## 🧠 What I Learned Building This

- Building full-stack applications with React + FastAPI
- Working with Web Speech API (speech recognition & synthesis)
- Integrating LLM APIs (Groq/Llama) for real-time feedback
- PDF parsing and text analysis using PDF.js
- REST API design and handling CORS
- Environment variables and API key security
- Git/GitHub workflow for full-stack multi-folder projects

---

## 👩‍💻 Developed By

**Nayana N S**
BTech IT Student

---

## 📝 License

This project is for educational purposes as part of academic portfolio development.
