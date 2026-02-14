import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState({});
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Parse raw questions into an array
  const questionsList = state?.questions
    ?.split(/\n?\d+\.\s+/)
    ?.map(q => q.trim())
    ?.filter(q => q.length > 10 && !q.toLowerCase().includes("here are")) || [];

  const handleAnswerChange = (index, value) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  const submitFinalAnswers = async () => {
    setLoading(true);
    const resultsPayload = questionsList.map((q, i) => ({
      question: q,
      answer: userAnswers[i] || "No answer provided."
    }));

    try {
      const response = await fetch('http://localhost:5000/api/evaluate-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: resultsPayload }),
      });
      const data = await response.json();
      setFinalReport(data.evaluation);
    } catch (err) {
      console.error("Evaluation Error:", err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // HELPER: Parses the AI string into a structured object
  const parseReport = (text) => {
  if (!text) return null;

  // Improved Regex to be more flexible with headings and bolding
  const scoreMatch = text.match(/Score:\s*(\d+)\/10/i);
  const summaryMatch = text.match(/(?:Overall Summary|Summary):\s*([\s\S]*?)(?=Strengths:|✅|$)/i);
  const strengthsMatch = text.match(/(?:Strengths):\s*([\s\S]*?)(?=Areas for Improvement:|Improvements:|🚀|$)/i);
  const improvementsMatch = text.match(/(?:Areas for Improvement|Improvements):\s*([\s\S]*?)(?=Key Advice:|Advice:|$)/i);
  const adviceMatch = text.match(/(?:Key Advice|Advice):\s*([\s\S]*?)$/i);

  const getList = (str) => {
    if (!str) return [];
    // Removes dash, numbers, and asterisks used for bolding
    return str
      .split(/\n/)
      .map(s => s.replace(/^\d+\.\s*|-\s*|\*/g, '').trim())
      .filter(s => s.length > 2);
  };

  return {
    score: scoreMatch ? scoreMatch[1] : "N/A",
    summary: summaryMatch ? summaryMatch[1].trim() : "No summary available.",
    strengths: getList(strengthsMatch?.[1]),
    improvements: getList(improvementsMatch?.[1]), // This will now catch "Improvements:" or "Areas for Improvement:"
    advice: adviceMatch ? adviceMatch[1].trim() : "Keep practicing!"
  };
};

  if (finalReport) {
    const report = parseReport(finalReport);
    return (
      <div className="results-wrapper">
        <div className="report-card">
          <div className="report-header">
            <div className="score-ring">
              <span className="big-score">{report.score}</span>
              <span className="small-total">/10</span>
            </div>
            <h2>Performance Report</h2>
            <p className="summary-text">{report.summary}</p>
          </div>

          

          <div className="report-grid">
            <div className="report-col strengths">
              <h4>✅ Key Strengths</h4>
              <ul>
                {report.strengths.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="report-col improvements">
              <h4>🚀 Areas to Improve</h4>
              <ul>
                {report.improvements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="report-footer">
            <div className="advice-box">
              <strong>Expert Advice:</strong> {report.advice}
            </div>
            <div className="advice-btn-group">
              <button className="edit-btn" onClick={() => setFinalReport(null)}>Edit Answers</button>
              <button className="new-sim-btn" onClick={() => navigate('/home')}>New Simulation</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      <div className="results-container">
        <h1>Interview Simulation</h1>
        <p className="subtitle">Answer the questions below to test your readiness.</p>
        
        {questionsList.map((q, index) => (
          <div key={index} className="question-card">
            <p className="question-text"><strong>Q{index + 1}:</strong> {q}</p>
            <textarea 
              placeholder="Type your response here..." 
              onChange={(e) => handleAnswerChange(index, e.target.value)} 
            />
          </div>
        ))}

        <button 
          className="submit-all-btn" 
          onClick={submitFinalAnswers}
          disabled={loading}
        >
          {loading ? "Analyzing Responses..." : "Submit Final Answers"}
        </button>
      </div>
    </div>
  );
};

export default Results;