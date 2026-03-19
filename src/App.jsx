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
import StoryReadPage from "./pages/story/StoryReadPage";

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
      </Routes>
    </BrowserRouter>
  );
}