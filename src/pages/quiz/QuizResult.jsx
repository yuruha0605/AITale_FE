import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

export default function QuizResultPage() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") || "친구";
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
  const difficulty = localStorage.getItem("difficulty") || "중";

  const { totalScore, correctCount } = useMemo(() => {
    let total = 0;
    let correct = 0;

    results.forEach((r) => {
      total += r.score;
      if (r.correct) correct += 1;
    });

    return { totalScore: total, correctCount: correct };
  }, [results]);

  // ✅ 배지 로직
  const result = useMemo(() => {
    if (correctCount === 5 && difficulty === "상") {
      return {
        badge: "💎 기본 플래티넘 책벌레",
        description: "최고 난이도에서 완벽하게 성공했어 👑",
      };
    }

    if (correctCount === 5) {
      return {
        badge: "🟡 금색 책벌레",
        description: "추가 문제에 도전할 수 있어!",
      };
    }

    if (correctCount >= 3) {
      return {
        badge: "⚪ 은색 책벌레",
        description: "조금만 더 하면 완벽해!",
      };
    }

    return {
      badge: "🟤 동화 완독 배지",
      description: "끝까지 해낸 것도 대단해!",
    };
  }, [correctCount, difficulty]);

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    navigate("/quiz/1");
  };

  const handleGoReport = () => {
    navigate("/report");
  };

  const handleUpgrade = () => {
    navigate("/quiz/extra/1");
  };

  return (
    <div className="adventure-page result-page">
      {/* 배경 요소 */}
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-bg-cloud cloud-3" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        {/* 캐릭터 */}
        <div className="adventure-character">🏆</div>

        {/* 타이틀 */}
        <h1 className="adventure-title">
          퀴즈 완료!
          <br />
          {nickname}의 결과는
        </h1>

        {/* 배지 + 점수 */}
        <div className="result-level-box">
          <p className="result-level">{result.badge}</p>
          <p className="result-exp">{totalScore} EXP</p>
        </div>

        {/* 설명 */}
        <div className="adventure-speech result-description">
          {result.description}
        </div>

        {/* 추가 문제 */}
        {correctCount === 5 && difficulty !== "상" && (
          <div className="adventure-speech" style={{ marginTop: "20px" }}>
            <p>문제가 쉬웠나요?</p>

            <div className="adventure-button-row">
              <button className="adventure-button" onClick={handleUpgrade}>
                👉 더 어려운 문제 도전
              </button>

              <button
                className="adventure-button secondary"
                onClick={() => {}}
              >
                괜찮아요
              </button>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="adventure-button-row">
          <button className="adventure-button secondary" onClick={handleRestart}>
            다시 풀기
          </button>

          <button className="adventure-button" onClick={handleGoReport}>
            리포트 보기
          </button>
        </div>
      </div>
    </div>
  );
}