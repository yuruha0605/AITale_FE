import { useNavigate } from "react-router-dom";
import "./QuizIntroPage.css";
import { useEffect } from "react";

export default function QuizIntroPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  useEffect(() => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");

    localStorage.setItem("difficulty", "하"); //나중에 삭제
  }, []);

  const handleStart = () => {
    localStorage.setItem("quizScore", "0");
    localStorage.setItem("quizExp", "0");
    navigate("/quiz/1");
  };

  return (
    <div className="adventure-page test-intro-page">
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-bg-cloud cloud-3" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        <div className="adventure-character">📖</div>

        <div className="adventure-step">
          <span className="adventure-step-dot active" />
          <span className="adventure-step-dot active" />
          <span className="adventure-step-dot active" />
          <span className="adventure-step-dot active" />
        </div>

        <h1 className="adventure-title">
          {nickname}의 <br /> 동화 퀴즈에 도전해볼까?
        </h1>

        <p className="adventure-subtitle">
          동화를 읽고 내용을 잘 이해했는지 확인해보자!
        </p>

        <div className="adventure-speech">
          📚 동화를 읽은 뒤,
          <br />
          내용과 주제에 맞는 퀴즈가 나와!
          <br />
          정답이면 응원 메시지와 점수를 얻고
          <br />
          틀리면 AI가 친절하게 설명해줄 거야 😊
        </div>

        <p className="adventure-progress-text">
          총 5문제 · 난이도별 점수 제공
        </p>

        <div className="adventure-button-row">
          <button
            className="adventure-button secondary"
            onClick={() => navigate("/")}
          >
            ← 홈으로
          </button>
          <button className="adventure-button" onClick={handleStart}>
            퀴즈 시작 →
          </button>
        </div>
      </div>
    </div>
  );
}
