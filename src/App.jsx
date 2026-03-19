import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/home/HomePage";
import JoinPage from "./pages/join/JoinPage";
import LoginPage from "./pages/login/LoginPage";
import RecommendedPage from "./pages/recommend/RecommendedPage";
import SignPage from "./pages/sign/SignPage";
import TestIntroPage from "./pages/test/TestIntroPage";
import TestPage from "./pages/test/TestPage";
import TestResultPage from "./pages/test/TestResultPage";

import MyPage from "./pages/mypage/MyPage";
import MainPage from "./pages/main/MainPage";

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
import QuizExtraPage from "./pages/quiz/QuizExtraPage";
import QuizFinalResult from "./pages/quiz/QuizFinalResult";

import ReportPage from "./pages/report/ReportPage";

import TestIntroPage from "./pages/test/TestIntroPage";
import TestQuizPage from "./pages/test/TestQuizPage";
import TestResultPage from "./pages/test/TestResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/sign" element={<SignPage />} />
          <Route path="/test/intro" element={<TestIntroPage />} />
          <Route path="/test/start" element={<TestPage />} />
          <Route path="/test/result" element={<TestResultPage />} />
          <Route path="/recommended" element={<RecommendedPage />} />

          <Route path="/story/:id" element={<StoryReadPage />} />

          <Route path="/mypage" element={<MyPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/main" element={<MainPage />} />

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
        <Route path="/quiz/extra/:id" element={<QuizExtraPage />} />
        <Route path="/quiz/extra/result" element={<QuizFinalResult />} />

        <Route path="/report" element={<ReportPage />} />

        <Route path="/test/intro" element={<TestIntroPage />} />
        <Route path="/test/:id" element={<TestQuizPage />} />
        <Route path="/test/result" element={<TestResultPage />} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}