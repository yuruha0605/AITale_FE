import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./TestResultPage.css";

export default function TestResultPage() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") || "친구";
  const results = JSON.parse(localStorage.getItem("testResults") || "[]");

  const { correctCount } = useMemo(() => {
    let correct = 0;
    results.forEach((r) => {
      if (r.correct) correct += 1;
    });
    return { correctCount: correct };
  }, [results]);

  // ✅ 난이도 계산 + 캐릭터
  const resultInfo = useMemo(() => {
    if (correctCount <= 3) {
      localStorage.setItem("difficulty", "하");
      return {
        level: "🌱 기초 독해 단계",
        message: "천천히 읽으면 더 잘할 수 있어! 🌼",
        character: "🐰",
        color: "#86efac",
      };
    }

    if (correctCount <= 7) {
      localStorage.setItem("difficulty", "중");
      return {
        level: "📘 기본 독해 단계",
        message: "잘하고 있어! 조금만 더 도전해보자 💪",
        character: "🐶",
        color: "#93c5fd",
      };
    }

    localStorage.setItem("difficulty", "상");
    return {
      level: "🔥 고급 독해 단계",
      message: "와! 정말 대단해!! 최고 수준이야 👑",
      character: "🦁",
      color: "#fca5a5",
    };
  }, [correctCount]);

  return (
    <div className="adventure-page result-page">
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-ground" />
      <div className="adventure-card">

        {/* 캐릭터 */}
        <div className="result-character">
          {resultInfo.character}
        </div>

        <h1 className="adventure-title">
          {nickname}의 독해력 결과!
        </h1>

        {/* 점수 */}
        <div className="result-level-box">
          <p className="result-level">
            {correctCount} / 10 문제 성공!
          </p>
        </div>

        {/* 레벨 카드 */}
        <div
          className="result-badge-box"
          style={{ borderColor: resultInfo.color }}
        >
          <p
            className="result-badge-title"
            style={{ color: resultInfo.color }}
          >
            {resultInfo.level}
          </p>

          <p className="result-message">
            {resultInfo.message}
          </p>
        </div>

        {/* 설명 */}
        <div className="adventure-speech">
          이제 {resultInfo.level} 난이도로<br />
          맞춤 퀴즈가 시작돼요! 🚀
        </div>

        {/* 버튼 */}
        <div className="adventure-button-row">
          <button
            className="adventure-button"
            onClick={() => navigate("/quiz-intro")}
          >
            퀴즈 시작하기 🎮
          </button>

          <button
            className="adventure-button secondary"
            onClick={() => navigate("/")}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}