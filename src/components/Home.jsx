import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleProcess = (e) => {
    e.preventDefault();
    // Simulate processing
    console.log("Job Columns:", jobDetails);
    console.log("Uploaded PDF:", pdfFile?.name);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="home-wrapper">
        <div className="success-card">
          <h2>✅ Details Saved</h2>
          <p><strong>Job:</strong> {jobDetails.title} at {jobDetails.company}</p>
          <p><strong>File:</strong> {pdfFile?.name}</p>
          <button className="home-btn" onClick={() => setIsSuccess(false)}>Edit Details</button>
        </div>
      </div>
    );
  }

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
          <label htmlFor="pdf-upload" className="custom-file-upload">
            {pdfFile ? `📄 ${pdfFile.name}` : "Upload Job PDF"}
          </label>
          <input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} required />
        </div>

        <button type="submit" className="home-btn">Update Simulator</button>
      </form>
    </div>
  );
};

export default Home;