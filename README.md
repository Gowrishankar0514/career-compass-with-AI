# 🚀 CareerSync AI

**An intelligent career assistance platform powered by AI**

CareerSync AI helps job seekers analyze their resumes against job descriptions, identify skill gaps, and receive personalized recommendations for interview preparation.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)

---

## 🎯 About

CareerSync AI solves a critical problem for job seekers: understanding why resumes get rejected by ATS (Applicant Tracking Systems) and what skills are missing for their target roles.

**The Solution:**
- Upload your resume PDF
- Paste the job description
- Get instant AI-powered analysis with:
  - ATS compatibility score
  - Skill match rating
  - Identified skill gaps
  - Personalized interview questions
  - Learning recommendations

---

## ✨ Features

### Core Functionality
- 📄 **PDF Resume Processing** - Automatic text extraction from uploaded resumes
- 🤖 **AI-Powered Analysis** - Uses Groq's Llama 3.1 model for intelligent recommendations
- 📊 **ATS Score Calculation** - Percentage match against job requirements
- 🎯 **Skill Gap Identification** - Highlights missing skills with learning paths
- 💬 **Interview Question Generation** - AI creates role-specific technical questions
- 📈 **Visual Analytics** - Interactive pie charts for skill distribution

### User Experience
- 🔐 **Secure Authentication** - JWT-based login system with bcrypt encryption
- 🎨 **Modern UI/UX** - Dark theme with glassmorphism design and cyan accents
- 📱 **Responsive Design** - Works seamlessly across devices
- 💾 **Persistent Sessions** - LocalStorage integration for saved analysis
- ⚡ **Real-time Feedback** - Instant analysis results

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Groq SDK (Llama 3.1 8B Instant)
- **Authentication**: JWT + bcrypt
- **File Processing**: Multer, pdf-parse

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Charts**: Chart.js, react-chartjs-2
- **HTTP Client**: Axios
- **PDF Processing**: pdfjs-dist

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Groq API Key ([Get one here](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Gowrishankar0514/career-compass-with-AI.git
cd CareerCompass_Route
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up Environment Variables**

Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

5. **Run the Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📁 Project Structure

```
CareerCompass_Route/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── resumeController.js   # Resume analysis logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT validation
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── resumeRoutes.js       # Analysis endpoints
│   ├── uploads/                  # Uploaded files
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Homepage
│   │   │   ├── Register.jsx      # Sign up
│   │   │   ├── Login.jsx         # Sign in
│   │   │   ├── Resume.jsx        # Main analysis page
│   │   │   └── FinalReview.jsx   # Results summary
│   │   ├── utils/
│   │   │   └── pdfReader.js      # PDF text extraction
│   │   ├── api.js                # Axios configuration
│   │   ├── App.jsx               # Main component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, msg }
```

```
POST /api/auth/login
Body: { email, password }
Response: { success, msg, token, name }
```

### Resume Analysis
```
POST /api/resumes/analyze
Body: { resumeText, jdText }
Response: {
  success,
  atsScore,
  skillMatchScore,
  matchedSkills,
  missingSkills,
  recommendedSkills,
  technicalQuestions,
  finalReview
}
```

---

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/careercompass` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key_here` |
| `GROQ_API_KEY` | Groq API key for AI | `gsk_...` |

---

## 📖 Usage

### Step 1: Create Account
- Navigate to the landing page
- Click "Start Your Journey"
- Register with name, email, and password

### Step 2: Analyze Resume
- Login to your account
- Upload your resume PDF
- Paste the job description
- Click "Analyze Resume"

### Step 3: Review Results
- View your ATS score
- Check matched and missing skills
- Review AI-generated interview questions
- Note recommended skills to learn
- Navigate to Final Review for complete summary

### Step 4: Iterate
- Upload different resumes for different positions
- Compare results across analyses
- Track your skill improvement

---

## 🎨 Key Features Deep Dive

### AI-Powered Skill Matching
The system uses a sophisticated skill bank with aliases:
- Recognizes variations (JavaScript, JS, ECMAScript)
- Context-aware matching
- Industry-standard skill taxonomy

### ATS Score Calculation
```
ATS Score = (Matched Skills / Required Skills) × 100
Capped at 95% for realism
```

### AI Question Generation
Uses Groq's Llama 3.1 with:
- Low temperature (0.15) for focused responses
- Context-aware prompts
- Fallback system for reliability

---

## 🔮 Future Enhancements

- [ ] Save analysis history to database
- [ ] Compare multiple resumes side-by-side
- [ ] Generate custom cover letters
- [ ] Resume optimization suggestions
- [ ] LinkedIn profile analysis
- [ ] Interview preparation modules
- [ ] Career path recommendations
- [ ] Export reports as PDF
- [ ] Email notifications
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Gowrishankar**

- GitHub: [@Gowrishankar0514](https://github.com/Gowrishankar0514)
- Repository: [career-compass-with-AI](https://github.com/Gowrishankar0514/career-compass-with-AI)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for AI infrastructure
- [MongoDB](https://www.mongodb.com) for database services
- [Vite](https://vitejs.dev) for lightning-fast build tool
- [React](https://react.dev) for the UI framework

---

## 📧 Support

If you have any questions or need assistance, please open an issue in the GitHub repository.

---

<div align="center">
Made with ❤️ by Gowrishankar
</div>
