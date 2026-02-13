const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { Groq } = require("groq-sdk");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js"); // Node-friendly version of your pdf.mjs

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_KEY });

// Setup Multer for PDF uploads (stored in memory)
const upload = multer({ storage: multer.memoryStorage() });

// --- MongoDB Connection ---
const connection = process.env.MONGO_URL; 
mongoose.connect(connection)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("ERROR", err));

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String 
}), 'users');

// --- Helper: Extract text using logic from your pdf.mjs ---
async function extractTextFromBuffer(buffer) {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Joins the text items found in the PDF
    fullText += content.items.map(item => item.str).join(" ") + "\n";
  }
  return fullText;
}

// --- Routes ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.status(200).send("Success");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// NEW: Combined PDF Extraction + Groq Analysis
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    // 1. Extract Text using PDF.js logic
    const extractedText = await extractTextFromBuffer(req.file.buffer);

    // 2. Groq API Call
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an HR assistant. Analyze the following text and provide a list of 5 tailored interview questions."
        },
        {
          role: "user",
          content: extractedText
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.status(200).json({ 
      questions: completion.choices[0]?.message?.content 
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});