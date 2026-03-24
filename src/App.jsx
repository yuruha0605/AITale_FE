import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import JoinPage from "./pages/join/JoinPage";
import LoginPage from "./pages/login/LoginPage";
import RecommendedPage from "./pages/recommend/RecommendedPage";
import TestIntroPage from "./pages/test/TestIntroPage";
import TestPage from "./pages/test/TestPage";
import TestResultPage from "./pages/test/TestResultPage";

import MainPage from "./pages/main/MainPage";

import StoryReadPage from "./pages/story/StoryReadPage";

import QuizExtraPage from "./pages/quiz/QuizExtraPage";
import QuizFinalResult from "./pages/quiz/QuizFinalResult";
import QuizIntroPage from "./pages/quiz/QuizIntroPage";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResult from "./pages/quiz/QuizResult";
import QuizExplanationPage from "./pages/quiz/QuizExplanationPage";


import MyReport from "./pages/myreport/MyReport";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />

        <Route element={<MainLayout />}>
          <Route
            path="/test/intro"
            element={
              <ProtectedRoute>
                <TestIntroPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/start"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/result"
            element={
              <ProtectedRoute>
                <TestResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommended"
            element={
              <ProtectedRoute>
                <RecommendedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/story/:id"
            element={
              <ProtectedRoute>
                <StoryReadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/intro"
            element={
              <ProtectedRoute>
                <QuizIntroPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/result"
            element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/extra/:id"
            element={
              <ProtectedRoute>
                <QuizExtraPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/extra/result"
            element={
              <ProtectedRoute>
                <QuizFinalResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myreport"
            element={
              <ProtectedRoute>
                <MyReport />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}