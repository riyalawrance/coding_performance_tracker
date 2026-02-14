const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { Groq } = require("groq-sdk");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_KEY });
const upload = multer({ storage: multer.memoryStorage() });

// --- MongoDB Connection ---
const connection = process.env.MONGO_URL; 
mongoose.connect(connection)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("ERROR", err));

// UPDATED: Added 'name' to the schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema, 'users');

// --- Helper: Extract text from PDF ---
async function extractTextFromBuffer(buffer) {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(" ") + "\n";
  }
  return fullText;
}

// --- Auth Routes ---

// 1. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (user) {
      res.status(200).json({ message: "Success", name: user.name });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// 2. NEW: SIGNUP ROUTE (JOIN)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create and save new user
    const newUser = new User({ name, email, password });
    await newUser.save(); // This saves the data to your MongoDB

    res.status(201).json({ message: "Credential saved successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Failed to create account" });
  }
});

// --- Analysis Routes ---

app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");
    const extractedText = await extractTextFromBuffer(req.file.buffer);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an HR assistant. Analyze the following text and provide a list of 5 tailored interview questions."
        },
        { role: "user", content: extractedText }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.status(200).json({ questions: completion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

app.post('/api/evaluate-bulk', async (req, res) => {
  const { results } = req.body;
  try {
    const interviewData = results.map((item, i) => `Q${i+1}: ${item.question}\nA${i+1}: ${item.answer}`).join("\n\n");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer. Provide a SHORT evaluation.
          1. Start EXACTLY with "Score: [X]/10" (Replace X with a number).
          2. Overall Summary: Max 2 sentences.
          3. Strengths: 2 short bullet points.
          4. Improvements: 2 short bullet points.
          5. Key Advice: 1 short sentence.`
        },
        { role: "user", content: interviewData }
      ],
      model: "llama-3.3-70b-versatile",
    });
    res.status(200).json({ evaluation: completion.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});