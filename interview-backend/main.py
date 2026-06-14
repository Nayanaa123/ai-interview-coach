from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json


load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnswerRequest(BaseModel):
    role: str
    question: str
    answer: str


class FeedbackRequest(BaseModel):
    role: str
    questions: list
    answers: list


@app.post("/analyze-answer")
async def analyze_answer(req: AnswerRequest):

    prompt = f"""
You are an expert technical interviewer for {req.role} positions.

Question asked: {req.question}

Candidate's answer:
{req.answer}

Analyze this answer and respond ONLY in valid JSON format:

{{
    "score": 85,
    "clarity": "Good",
    "confidence": "High",
    "good_points": [
        "point1",
        "point2",
        "point3"
    ],
    "improvements": [
        "improvement1",
        "improvement2"
    ],
    "better_answer": "one sentence tip"
}}

Do not include markdown.
Do not include explanation.
Only output JSON.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        print("\n========== GROQ RESPONSE ==========")
        print(text)
        print("=====================================\n")

        return json.loads(text)

    except Exception as e:
        print("ERROR:", str(e))

        return {
            "score": 0,
            "clarity": "N/A",
            "confidence": "N/A",
            "good_points": ["Error generating feedback"],
            "improvements": ["Check backend logs"],
            "better_answer": str(e)
        }


@app.post("/final-feedback")
async def final_feedback(req: FeedbackRequest):

    qa_pairs = ""

    for i, (q, a) in enumerate(zip(req.questions, req.answers)):
        qa_pairs += f"Q{i+1}: {q}\nA{i+1}: {a}\n\n"

    prompt = f"""
You are an expert interviewer for {req.role} positions.

Here are all interview questions and answers:

{qa_pairs}

Return ONLY valid JSON:

{{
    "overall_score": 85,
    "overall_clarity": "Good",
    "overall_confidence": "High",
    "top_strengths": [
        "strength1",
        "strength2",
        "strength3"
    ],
    "top_improvements": [
        "improvement1",
        "improvement2",
        "improvement3"
    ],
    "hiring_recommendation": "Yes",
    "summary": "Overall summary"
}}

Only output JSON.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        print("\n========== FINAL FEEDBACK ==========")
        print(text)
        print("====================================\n")

        return json.loads(text)

    except Exception as e:
        print("ERROR:", str(e))

        return {
            "overall_score": 0,
            "overall_clarity": "N/A",
            "overall_confidence": "N/A",
            "top_strengths": ["Error generating feedback"],
            "top_improvements": ["Check backend logs"],
            "hiring_recommendation": "N/A",
            "summary": str(e)
        }


@app.get("/")
async def root():
    return {
        "message": "Interview Coach API is running!"
    }