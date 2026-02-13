const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB (local for now)

const connection = process.env.MONGO_URL ; 

mongoose.connect(connection)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("ERROR", err));

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String // Note: In a real app, hash this!
}), 'users');

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Look for the user in MongoDB
  const user = await User.findOne({ email: email, password: password });

  if (user) {
    res.status(200).send("Success"); // This makes response.ok = true in React
  } else {
    res.status(401).send("Invalid credentials"); // This triggers your alert
  }
});


app.listen(5000, ()=>{
  console.log("Server started on port 5000");
});
