import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";

import AdventureBirthPage from "./pages/adventure/AdventureBirthPage";
import AdventureIntroPage from "./pages/adventure/AdventureIntroPage";
import AdventureNicknamePage from "./pages/adventure/AdventureNicknamePage";
import AdventureQuestionPage from "./pages/adventure/AdventureQuestionPage";
import AdventureResultPage from "./pages/adventure/AdventureResultPage";
import AdventureTestIntroPage from "./pages/adventure/AdventureTestIntroPage";

import StoryRecommendPage from "./pages/story/StoryRecommendPage";

import StoryReadPage from "./pages/story/StoryReadPage";

import QuizIntroPage from "./pages/quiz/QuizIntroPage";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResult from "./pages/quiz/QuizResult";
import ReportPage from "./pages/quiz/ReportPage";
import QuizExtraPage from "./pages/quiz/QuizExtraPage";
import QuizFinalResult from "./pages/quiz/QuizFinalResult";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/adventure/intro" element={<AdventureIntroPage />} />
        <Route path="/adventure/nickname" element={<AdventureNicknamePage />} />
        <Route path="/adventure/birth" element={<AdventureBirthPage />} />
        <Route path="/adventure/test-intro" element={<AdventureTestIntroPage />} />
        <Route path="/adventure/test/:id" element={<AdventureQuestionPage />} />
        <Route path="/adventure/result" element={<AdventureResultPage />} />
        
        <Route path="/stories" element={<StoryRecommendPage />} />
        <Route path="/stories/read" element={<StoryReadPage />} />

        <Route path="/quiz/intro" element={<QuizIntroPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/quiz/result" element={<QuizResult />} />
        <Route path="/quiz/report" element={<ReportPage />} />
        <Route path="/quiz/extra/:id" element={<QuizExtraPage />} />
        <Route path="/quiz/extra/result" element={<QuizFinalResult />} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}