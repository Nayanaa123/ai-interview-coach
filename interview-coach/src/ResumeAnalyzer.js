import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";


pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const roleSkills = {
  "Frontend Developer": ["html", "css", "javascript", "react", "typescript", "git", "responsive", "bootstrap", "tailwind", "figma"],
  "Backend Developer": ["python", "java", "node", "express", "sql", "mysql", "mongodb", "rest", "api", "git", "docker"],
  "Full Stack Developer": ["html", "css", "javascript", "react", "node", "python", "sql", "git", "api", "mongodb"],
  "Data Analyst": ["python", "sql", "excel", "tableau", "pandas", "numpy", "matplotlib", "statistics", "powerbi", "data"],
  "Machine Learning Engineer": ["python", "tensorflow", "pytorch", "sklearn", "pandas", "numpy", "deep learning", "neural", "opencv", "git"],
  "Python Developer": ["python", "django", "flask", "sql", "rest", "api", "git", "pandas", "numpy", "docker"],
  "Java Developer": ["java", "spring", "springboot", "sql", "mysql", "maven", "git", "rest", "api", "hibernate"],
  "DevOps Engineer": ["docker", "kubernetes", "jenkins", "git", "linux", "aws", "ci/cd", "ansible", "terraform", "bash"],
  "Android Developer": ["java", "kotlin", "android", "xml", "firebase", "git", "sql", "rest", "api", "gradle"],
  "Cybersecurity Analyst": ["network", "linux", "python", "firewall", "encryption", "sql", "git", "security", "ethical hacking", "kali"]
};

export default function ResumeAnalyzer({ selectedRole, onDone, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ").toLowerCase();
        }
        analyzeResume(text);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setLoading(false);
    }
  };

  const analyzeResume = (text) => {
    const required = roleSkills[selectedRole] || [];
    const found = required.filter(skill => text.includes(skill.toLowerCase()));
    const missing = required.filter(skill => !text.includes(skill.toLowerCase()));
    const score = Math.round((found.length / required.length) * 100);
    setAnalysis({ found, missing, score });
  };

  const scoreColor = analysis
    ? analysis.score >= 70 ? "#10b981"
    : analysis.score >= 40 ? "#f59e0b"
    : "#ef4444"
    : "#ffffff";

  const scoreLabel = analysis
    ? analysis.score >= 70 ? "ATS Friendly ✓"
    : analysis.score >= 40 ? "Needs Improvement"
    : "Not ATS Friendly ✗"
    : "";

  const btnSecondary = {
    background: "transparent", color: "#6b7280",
    border: "1px solid #2d2f3e", padding: "10px 24px",
    borderRadius: "10px", fontSize: "14px", cursor: "pointer"
  };

  return (
    <div style={{ textAlign: "center", maxWidth: "640px", width: "100%" }}>

      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
         Resume ATS Analyzer
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "4px" }}>
        Analyzing for: <span style={{ color: "#3b82f6", fontWeight: "600" }}>{selectedRole}</span>
      </p>
      <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "24px" }}>
        Upload your resume to check ATS compatibility
      </p>

      <button onClick={onBack} style={{ ...btnSecondary, marginBottom: "16px" }}>
        ← Back
      </button>

      <label style={{
        display: "block",
        background: "#1a1d27",
        border: "2px dashed #2d2f3e",
        borderRadius: "12px",
        padding: "40px 24px",
        cursor: "pointer",
        marginBottom: "24px"
      }}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📁</div>
        <p style={{ color: "#9ca3af", margin: 0, fontSize: "15px" }}>
          {fileName ? `✓ ${fileName}` : "Click to upload your Resume (PDF only)"}
        </p>
        {fileName && (
          <p style={{ color: "#3b82f6", margin: "8px 0 0", fontSize: "13px" }}>
            Click again to upload a different file
          </p>
        )}
      </label>

      {loading && (
        <div style={{
          background: "#1a1d27", border: "1px solid #2d2f3e",
          borderRadius: "12px", padding: "24px", marginBottom: "20px"
        }}>
          <p style={{ color: "#3b82f6", margin: 0, fontSize: "15px" }}>
            ⏳ Analyzing your resume...
          </p>
        </div>
      )}

      {analysis && (
        <>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px", marginBottom: "16px"
          }}>
            <div style={{
              background: "#1a1d27", border: "1px solid #2d2f3e",
              borderRadius: "12px", padding: "16px"
            }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>ATS SCORE</p>
              <p style={{ color: scoreColor, fontSize: "28px", fontWeight: "700", margin: 0 }}>
                {analysis.score}%
              </p>
            </div>
            <div style={{
              background: "#1a1d27", border: "1px solid #2d2f3e",
              borderRadius: "12px", padding: "16px"
            }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>FOUND</p>
              <p style={{ color: "#10b981", fontSize: "28px", fontWeight: "700", margin: 0 }}>
                {analysis.found.length}
              </p>
            </div>
            <div style={{
              background: "#1a1d27", border: "1px solid #2d2f3e",
              borderRadius: "12px", padding: "16px"
            }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>MISSING</p>
              <p style={{ color: "#ef4444", fontSize: "28px", fontWeight: "700", margin: 0 }}>
                {analysis.missing.length}
              </p>
            </div>
          </div>

          <div style={{
            background: "#1a1d27",
            border: `1px solid ${scoreColor}`,
            borderRadius: "12px", padding: "14px",
            marginBottom: "20px"
          }}>
            <p style={{ color: scoreColor, fontWeight: "700", fontSize: "16px", margin: 0 }}>
              {scoreLabel}
            </p>
          </div>

          <div style={{
            background: "#1a1d27", border: "1px solid #2d2f3e",
            borderRadius: "12px", padding: "24px",
            textAlign: "left", marginBottom: "20px"
          }}>
            <p style={{ color: "#10b981", fontWeight: "600", marginTop: 0 }}>
              ✓ Skills Found in Resume
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {analysis.found.length > 0
                ? analysis.found.map(skill => (
                  <span key={skill} style={{
                    background: "rgba(16,185,129,0.15)", color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.3)",
                    padding: "4px 12px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: "600"
                  }}>
                    {skill}
                  </span>
                ))
                : <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>No matching skills found</p>
              }
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #2d2f3e", margin: "16px 0" }} />

            <p style={{ color: "#ef4444", fontWeight: "600" }}>
              ✗ Missing Skills — Add these to your Resume!
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {analysis.missing.length > 0
                ? analysis.missing.map(skill => (
                  <span key={skill} style={{
                    background: "rgba(239,68,68,0.15)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.3)",
                    padding: "4px 12px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: "600"
                  }}>
                    {skill}
                  </span>
                ))
                : <p style={{ color: "#10b981", fontSize: "13px", margin: 0 }}>All skills present! 🎉</p>
              }
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #2d2f3e", margin: "16px 0" }} />

            <p style={{ color: "#f59e0b", fontWeight: "600" }}>
              💡 Tips to improve your ATS score
            </p>
            <ul style={{ color: "#9ca3af", fontSize: "13px", paddingLeft: "20px", margin: 0 }}>
              <li style={{ marginBottom: "6px" }}>Add missing skills to your Skills section</li>
              <li style={{ marginBottom: "6px" }}>Use exact keywords from the job description</li>
              <li style={{ marginBottom: "6px" }}>Avoid tables and graphics — ATS can't read them</li>
              <li style={{ marginBottom: "6px" }}>Use a simple single column resume format</li>
              <li>Include project names that use these technologies</li>
            </ul>
          </div>

          <button
            onClick={onDone}
            style={{
              background: "#3b82f6", color: "white", border: "none",
              padding: "14px 32px", borderRadius: "10px",
              fontSize: "15px", fontWeight: "600",
              cursor: "pointer", width: "100%"
            }}
          >
            Start Interview Practice →
          </button>
        </>
      )}

      {!analysis && !loading && (
        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          💡 Upload your resume above to see your ATS score and missing skills
        </p>
      )}
    </div>
  );
}