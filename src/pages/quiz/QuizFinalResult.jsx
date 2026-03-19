import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

export default function QuizFinalResult() {
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") || "친구";
  const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
  const extraResults = JSON.parse(localStorage.getItem("extraResults") || "[]");
  const difficulty = localStorage.getItem("difficulty") || "중";

  const { correctCount, extraCorrect } = useMemo(() => {
    let correct = 0;
    let extra = 0;

    quizResults.forEach((r) => {
      if (r.correct) correct += 1;
    });

    extraResults.forEach((r) => {
      if (r.correct) extra += 1;
    });

    return { correctCount: correct, extraCorrect: extra };
  }, [quizResults, extraResults]);

  useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

  const existingIndex = history.findIndex((h) => h.date === today);

  const todayScore = correctCount + extraCorrect;

  if (existingIndex !== -1) {
    history[existingIndex].score = todayScore;
  } else {
    history.push({
      date: today,
      score: todayScore,
    });
  }

  localStorage.setItem("quizHistory", JSON.stringify(history));
}, [correctCount, extraCorrect]);

  // 추가문제 2개 모두 맞혀야 플래티넘, 아니면 기존 배지 유지
  const { badge, badgeColor } = useMemo(() => {
    // 상 난이도에서 5개 다 맞힌 경우(추가문제 없음): 기본 플래티넘 → 단 이 경우는 최종결과로 오지 않으므로 방어용
    if (difficulty === "상" && correctCount === 5) {
      return { badge: "💎 기본 플래티넘 책벌레", badgeColor: "#5eead4" };
    }

    // 5개 + 추가 2개 모두 정답 → 플래티넘
    if (correctCount === 5 && extraCorrect === 2) {
      return { badge: "💎 플래티넘 책벌레", badgeColor: "#5eead4" };
    }

    // 5개 맞혔지만 추가 문제 1개 이하 정답 → 금색 유지
    if (correctCount === 5) {
      return { badge: "🟡 금색 책벌레", badgeColor: "#f5c518" };
    }

    // 3~4개
    if (correctCount >= 3) {
      return { badge: "⚪ 은색 책벌레", badgeColor: "#aaaaaa" };
    }

    // 2개 이하
    return { badge: "🟤 동화 완독 배지", badgeColor: "#cd7f32" };
  }, [correctCount, extraCorrect, difficulty]);

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");
    navigate("/quiz/1");
  };

  return (
    <div className="adventure-page result-page">
      <div className="adventure-card">
        <div className="adventure-character">👑</div>

        <h1 className="adventure-title">
          최종 결과!
          <br />
          {nickname}의 도전 결과
        </h1>

        <div className="result-level-box">
          <p className="result-level">{correctCount} / 5 (추가 {extraCorrect} / 2)</p>
        </div>

        <div
          className="badge-display"
          style={{ borderColor: badgeColor }}
        >
          {/* 아이콘 */}
          <div className="badge-icon">
            {badge.split(" ")[0]}
          </div>

          {/* 텍스트 */}
          <div
            className="badge-text"
            style={{ color: badgeColor }}
          >
            {badge.replace(/^[^\s]+\s/, "")}
          </div>
        </div>

        <div className="adventure-button-row" style={{ marginTop: "24px" }}>
          <button className="adventure-button" onClick={handleRestart}>
            다시 도전하기
          </button>
          <button
            className="adventure-button secondary"
            onClick={() => navigate("/report")}
          >
            독해력 성장 그래프
          </button>
        </div>
      </div>
    </div>
  );
}