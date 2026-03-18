import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

export default function QuizFinalResult() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") || "친구";

  const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
  const extraResults = JSON.parse(localStorage.getItem("extraResults") || "[]");

  // ✅ 총 점수 + 정답 개수
  const { totalScore, correctCount, extraCorrect } = useMemo(() => {
    let total = 0;
    let correct = 0;
    let extraCorrect = 0;

    quizResults.forEach((r) => {
      total += r.score;
      if (r.correct) correct += 1;
    });

    extraResults.forEach((r) => {
      total += r.score;
      if (r.correct) extraCorrect += 1;
    });

    return { totalScore: total, correctCount: correct, extraCorrect };
  }, [quizResults, extraResults]);

  // ✅ 최종 배지 로직
  const result = useMemo(() => {
    // 🔥 플래티넘 조건
    if (correctCount === 5 && extraCorrect === 2) {
      return {
        badge: "💎 플래티넘 책벌레",
        description: "모든 문제를 완벽하게 정복했어 👑🔥",
      };
    }

    if (correctCount === 5) {
      return {
        badge: "🟡 금색 책벌레",
        description: "추가 문제까지 도전하면 플래티넘 가능!",
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
  }, [correctCount, extraCorrect]);

  // ✅ 다시 시작
  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");
    navigate("/quiz/1");
  };

  const handleGoReport = () => {
    navigate("/report");
  };

  return (
    <div className="adventure-page result-page">
      {/* 배경 */}
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-bg-cloud cloud-3" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        {/* 캐릭터 */}
        <div className="adventure-character">👑</div>

        {/* 타이틀 */}
        <h1 className="adventure-title">
          최종 결과!
          <br />
          {nickname}의 도전 결과
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

        {/* 버튼 */}
        <div className="adventure-button-row">
          <button className="adventure-button secondary" onClick={handleRestart}>
            다시 도전하기
          </button>

          <button className="adventure-button" onClick={handleGoReport}>
            리포트 보기
          </button>
        </div>
      </div>
    </div>
  );
}