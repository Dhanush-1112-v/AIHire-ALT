import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeScreening from "./pages/ResumeScreening";
import AIInterview from "./pages/AIInterview";
import CodingAssessment from "./pages/CodingAssessment";
import Results from "./pages/Results";
import CandidateReport from "./pages/CandidateReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/resume-screening"
          element={<ResumeScreening />}
        />

        <Route
          path="/ai-interview"
          element={<AIInterview />}
        />

        <Route
          path="/coding-assessment"
          element={<CodingAssessment />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/candidate-report"
          element={<CandidateReport />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;