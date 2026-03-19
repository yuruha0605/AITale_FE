import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./TestIntroPage.css";

export default function TestIntroPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  useEffect(() => {
    localStorage.removeItem("testResults");
  }, []);

  const handleStart = () => {
    navigate("/test/1");
  };

  return (
    <div className="adventure-page test-intro-page">
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-bg-cloud cloud-3" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        <div className="adventure-character">🧠✨</div>

        {/* 진행 느낌 */}
        <div className="adventure-step">
          <span className="adventure-step-dot active" />
          <span className="adventure-step-dot" />
          <span className="adventure-step-dot" />
        </div>

        <h1 className="adventure-title">
          {nickname}의 독해력 테스트!
        </h1>

        <p className="adventure-subtitle">
          지금 나의 독해 실력을 알아보자 🚀
        </p>

        {/* ⭐ 설명 카드 */}
        <div className="test-info-box">
          <p>📖 총 10문제!</p>
          <p>🧩 5문제씩 2단계로 진행</p>
          <p>🎯 정답을 맞히면 점수 획득!</p>
          <p>🤖 틀리면 AI가 쉽게 설명해줘요!</p>
        </div>

        {/* ⭐ 말풍선 */}
        <div className="adventure-speech">
          문제를 풀면서 실력이 점점 성장해요 💡<br />
          끝나면 나에게 맞는 난이도가 자동으로 정해져요!
        </div>

        {/* 버튼 */}
        <div className="adventure-button-row">
          <button
            className="adventure-button secondary"
            onClick={() => navigate("/")}
          >
            ← 홈으로
          </button>

          <button className="adventure-button" onClick={handleStart}>
            테스트 시작 🎮
          </button>
        </div>
      </div>
    </div>
  );
}