import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({
    title: '', company: '', location: '', description: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', pdfFile);
    // You can also append job details if you want Groq to use them
    formData.append('title', jobDetails.title);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to results page and pass the questions via state
        navigate('/results', { state: { questions: data.questions, job: jobDetails } });
      } else {
        alert("Analysis failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <form className="home-form" onSubmit={handleProcess}>
        <h2>Update Job Simulator</h2>
        <div className="input-grid">
          <input name="title" placeholder="Job Title" onChange={handleChange} required />
          <input name="company" placeholder="Company Name" onChange={handleChange} required />
          <input name="location" placeholder="Location" onChange={handleChange} required />
          <textarea name="description" placeholder="Short Job Description" onChange={handleChange} />
        </div>

        <div className="file-upload-section">
          <input type="file" 
          id="pdf-upload" 
          accept=".pdf" 
          onChange={handleFileChange} 
          required />
          <label htmlFor="pdf-upload" className="custom-file-upload">
            {pdfFile ? `📄 ${pdfFile.name}` : "Click to Upload Job PDF"}
          </label>
        </div>

        <button type="submit" className="home-btn" disabled={loading}>
          {loading ? "Analyzing with AI..." : "Generate Questions"}
        </button>
      </form>
    </div>
  );
};

export default Home;