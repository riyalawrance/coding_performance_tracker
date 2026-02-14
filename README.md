

# 🤖 AI Interview Simulator

A full-stack web application that allows users to upload job descriptions (PDF) and undergo a real-time AI-powered interview simulation. The app provides instant, structured feedback, scoring, and expert advice to help candidates prepare for their dream jobs.

## 🌟 Features

* **PDF Job Analysis**: Automatically extracts key requirements and skill sets from uploaded job description PDFs.
* **Dynamic Question Generation**: Uses Groq (Llama-3.3-70b) to generate 5 tailored, high-quality interview questions based on the job title and description.
* **Glassmorphism UI**: A sleek, dark-themed interface with smooth transitions, centered layouts, and modern button designs.
* **Structured Performance Reports**: Provides a score out of 10, an overall summary, strengths, areas for improvement, and actionable advice.
* **Real-time Evaluation**: Instant feedback using bulk-processing AI logic to assess all answers simultaneously.

## 🛠️ Tech Stack

* **Frontend**: React.js, CSS3 (Glassmorphism), Lucide React (Icons).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (User Authentication & Data Storage).
* **AI Engine**: Groq SDK (Llama-3.3-70b-versatile).
* **PDF Processing**: PDF.js (Legacy build for Node environment).
* **Authentication**: Custom secure login/signup flow with `bcrypt` password hashing.

## 📐 Architecture

## 📂 Project Structure

```text
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ (Login, Home, Results)
│   │   └── styles/     (Login.css, Home.css, Results.css)
├── server/             # Backend Node/Express API
│   ├── server.js       (Express API, Groq Integration, PDF Logic)
│   └── .env            (Keys: MONGO_URL, GROQ_KEY)
└── README.md

```

## 🚀 Installation & Setup

### 1. Prerequisites

* Node.js (v16 or higher)
* MongoDB Atlas account
* Groq Cloud API Key

### 2. Backend Setup

1. Navigate to the `server` folder.
2. Create a `.env` file and add:
```env
MONGO_URL=your_mongodb_connection_string
GROQ_KEY=your_groq_api_key
PORT=5000

```


3. Install dependencies and start:
```bash
npm install
node server.js

```



### 3. Frontend Setup

1. Navigate to the `client` folder.
2. Install dependencies:
```bash
npm install

```


3. Start the application:
```bash
npm start

```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 📸 Screenshots

1. **Login Page**: Sleek dark-themed entry point for users.
2. **Home/Upload**: Intuitive "Click to Upload" zone that removes messy browser-default inputs.
3. **Report Card**: Circular score gauge and side-by-side feedback columns for easy readability.

## 🎥 Demo Video

[Click here to watch the working prototype](./media/my-react-app - Google Chrome 2026-02-14 06-42-16.mp4)


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

*Made with ❤️ for the TinkerHub Build Program.*
