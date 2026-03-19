import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

const BADGE_INFO = {
  "🟤 동화 완독 배지": { emoji: "🟤", color: "#cd7f32", label: "동화 완독 배지" },
  "⚪ 은색 책벌레": { emoji: "⚪", color: "#aaaaaa", label: "은색 책벌레" },
  "🟡 금색 책벌레": { emoji: "🟡", color: "#f5c518", label: "금색 책벌레" },
  "💎 기본 플래티넘 책벌레": { emoji: "💎", color: "#5eead4", label: "기본 플래티넘 책벌레" },
  "💎 플래티넘 책벌레": { emoji: "💎", color: "#5eead4", label: "플래티넘 책벌레" },
};

export function getBadge(correctCount, difficulty) {
  if (correctCount <= 2) return "🟤 동화 완독 배지";
  if (correctCount >= 3 && correctCount <= 4) return "⚪ 은색 책벌레";
  if (correctCount === 5) return "🟡 금색 책벌레";
  return "🟤 동화 완독 배지";
}

export default function QuizResultPage() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") || "친구";
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
  const difficulty = localStorage.getItem("difficulty") || "중";

  // ✅ 5문제까지만 계산 (누적 방지)
  const { totalScore, correctCount } = useMemo(() => {
    let total = 0;
    let correct = 0;

    const limitedResults = results.slice(0, 5);

    limitedResults.forEach((r) => {
      total += r.score;
      if (r.correct) correct += 1;
    });

    return { totalScore: total, correctCount: correct };
  }, [results]);

  const canUpgrade = correctCount === 5 && difficulty !== "상";
  useEffect(() => {
  // ✅ 추가 문제로 안 가는 경우만 저장
  if (canUpgrade) return;

  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

  const existingIndex = history.findIndex((h) => h.date === today);

  if (existingIndex !== -1) {
    history[existingIndex].score = correctCount;
  } else {
    history.push({
      date: today,
      score: correctCount,
    });
  }

  localStorage.setItem("quizHistory", JSON.stringify(history));
}, [correctCount, canUpgrade]);

  const badge = getBadge(correctCount, difficulty);
  const badgeInfo = BADGE_INFO[badge] || BADGE_INFO["🟤 동화 완독 배지"];

  const nextDifficulty = () => {
    if (difficulty === "하") return "중";
    if (difficulty === "중") return "상";
    return "상";
  };

  const handleUpgrade = () => {
    localStorage.setItem("difficulty", nextDifficulty());
    localStorage.removeItem("extraResults");
    navigate("/quiz/extra/1");
  };

  const handleSkip = () => {
    navigate("/report");
  };

  const handleRestart = () => {
    // ✅ 완전 초기화 (누적 방지 핵심)
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");
    navigate("/quiz/1");
  };

  

  return (
    <div className="adventure-page result-page">
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-ground" />
      <div className="adventure-card">
        <div className="adventure-character">🏆</div>

        <h1 className="adventure-title">
          퀴즈 완료!
          <br />
          {nickname}의 결과는
        </h1>

        {/* ✅ 배지 (위로 이동 + 크게) */}
        <div
          className="badge-display"
          style={{ borderColor: badgeInfo.color, marginBottom: "20px" }}
        >
          {/* ✅ 아이콘 */}
          <div className="badge-icon">
            {badgeInfo.emoji}
          </div>

          {/* ✅ 텍스트 */}
          <div
            className="badge-text"
            style={{ color: badgeInfo.color }}
          >
            {badgeInfo.label}
          </div>

          {/* ✅ 힌트 */}
          {canUpgrade && (
            <p className="badge-hint">
              ✨ 더 어려운 문제를 풀면 더 높은 배지를 받을 수 있어요!
            </p>
          )}
        </div>

        {/* ✅ 점수 */}
        <div className="result-level-box">
          <p className="result-level">{Math.min(correctCount, 5)} / 5</p>
          <p className="result-exp">{totalScore} EXP</p>
        </div>

        {/* 추가 문제 도전 */}
        {canUpgrade && (
          <div className="adventure-speech" style={{ marginTop: "20px" }}>
            <p>문제가 쉬웠나요? 도전해서 플래티넘 배지를 받아봐요!</p>

            <div className="adventure-button-row">
              <button className="adventure-button" onClick={handleUpgrade}>
                👉 더 어려운 문제 도전
              </button>

              <button
                className="adventure-button secondary"
                onClick={handleSkip}
              >
                독해력 성장 그래프
              </button>
            </div>
          </div>
        )}

        {/* 최고 난이도 클리어 */}
        {correctCount === 5 && difficulty === "상" && (
          <p className="badge-hint" style={{ marginTop: "8px" }}>
            💎 최고 난이도 완벽 달성! 기본 플래티넘 배지 획득!
          </p>
        )}

        {/* 일반 종료 */}
        {!canUpgrade && (
          <div className="adventure-button-row">
            <button className="adventure-button" onClick={handleSkip}>
              독해력 성장 그래프
            </button>
          </div>
        )}

        <div className="adventure-button-row" style={{ marginTop: "8px" }}>
          <button className="adventure-button secondary" onClick={handleRestart}>
            다시 풀기
          </button>
        </div>
      </div>
    </div>
  );
}