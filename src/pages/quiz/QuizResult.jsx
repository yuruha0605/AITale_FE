import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

const REVERSE_DIFFICULTY_MAP = {
  EASY: "하",
  NORMAL: "중",
  HARD: "상",
};

const BADGE_META = {
  complete: {
    emoji: "🟤",
    title: "동화 완독 배지",
    desc: "끝까지 포기하지 않고 동화를 완주했어요.",
    className: "bronze",
  },
  silver: {
    emoji: "⚪",
    title: "은색 책벌레 배지",
    desc: "이야기 내용을 꽤 잘 이해했어요.",
    className: "silver",
  },
  gold: {
    emoji: "🟡",
    title: "금색 책벌레 배지",
    desc: "기본 5문제를 모두 맞혔어요.",
    className: "gold",
  },
  basicPlatinum: {
    emoji: "💎",
    title: "기본 플래티넘 책벌레 배지",
    desc: "최고 난이도에서 완벽하게 맞혔어요.",
    className: "platinum",
  },
};

function getBaseBadgeKey(correctCount, difficulty) {
  if (correctCount <= 2) return "complete";
  if (correctCount <= 4) return "silver";
  if (correctCount === 5 && difficulty === "상") return "basicPlatinum";
  return "gold";
}

function saveQuizHistory({ score, exp, badge }) {
  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");
  const index = history.findIndex((item) => item.date === today);

  const payload = { date: today, score, exp, badge };

  if (index >= 0) history[index] = payload;
  else history.push(payload);

  localStorage.setItem("quizHistory", JSON.stringify(history));
}

export default function QuizResult() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";
  const difficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";

  const result = JSON.parse(localStorage.getItem("quizSubmitResult") || "{}");

  const correctCount = result?.baseCorrectCount || 0;
  const totalScore = result?.totalScore || 0;
  const hasBonus = !!result?.hasBonus;
  const nextDifficulty = result?.nextDifficulty || null;

  const badgeKey = useMemo(
    () => getBaseBadgeKey(correctCount, difficulty),
    [correctCount, difficulty]
  );

  const badge = BADGE_META[badgeKey];

  useEffect(() => {
    localStorage.setItem("quizScore", String(totalScore));
    localStorage.setItem("quizExp", String(totalScore));
    localStorage.setItem("finalBadge", badge.title);

    if (!hasBonus) {
      saveQuizHistory({
        score: correctCount,
        exp: totalScore,
        badge: badge.title,
      });
    }
  }, [badge.title, correctCount, hasBonus, totalScore]);

  const handleTryExtra = () => {
    if (nextDifficulty) {
      localStorage.setItem("extraDifficulty", nextDifficulty);
    }
    localStorage.removeItem("bonusAnswers");
    navigate("/quiz/extra/1");
  };

  const handleGoReport = () => {
    saveQuizHistory({
      score: correctCount,
      exp: totalScore,
      badge: badge.title,
    });
    navigate("/myreport");
  };

  const nextDifficultyText = nextDifficulty
    ? REVERSE_DIFFICULTY_MAP[nextDifficulty] || nextDifficulty
    : null;

  return (
    <div className="quiz-result-page">
      <div className="result-bg">
        <div className="result-bg-cloud cloud-1" />
        <div className="result-bg-cloud cloud-2" />
        <div className="result-bg-cloud cloud-3" />
        <div className="result-bg-hill" />
      </div>

      <main className="result-content">
        <section className="result-card">
          <div className="result-top-badge">🏅 기본 퀴즈 결과</div>

          <h1 className="result-title">{nickname}의 퀴즈 결과가 나왔어요</h1>
          <p className="result-subtitle">
            기본 문제 결과를 바탕으로 배지와 점수를 정리했어요.
          </p>

          <div className={`result-badge-card ${badge.className}`}>
            <div className="result-badge-emoji">{badge.emoji}</div>
            <h2>{badge.title}</h2>
            <p>{badge.desc}</p>
          </div>

          <div className="result-summary-grid">
            <div className="result-summary-card">
              <span>기본 정답 수</span>
              <strong>{correctCount} / 5</strong>
            </div>

            <div className="result-summary-card">
              <span>획득 EXP</span>
              <strong>{totalScore} EXP</strong>
            </div>

            <div className="result-summary-card">
              <span>보너스 가능</span>
              <strong>{hasBonus ? "가능" : "없음"}</strong>
            </div>
          </div>

          {hasBonus && (
            <div className="result-report-box">
              <h3>추가 문제 도전 가능</h3>
              <p>
                기본 문제를 모두 맞혔어요. 다음 난이도{" "}
                <strong>{nextDifficultyText}</strong> 보너스 문제에 도전할 수 있어요.
              </p>
            </div>
          )}

          <div className="result-button-row">
            {hasBonus ? (
              <>
                <button className="result-button primary" onClick={handleTryExtra}>
                  추가 문제 풀기 →
                </button>
                <button className="result-button secondary" onClick={handleGoReport}>
                  마이레포트 가기
                </button>
              </>
            ) : (
              <>
                <button
                  className="result-button secondary"
                  onClick={() => navigate("/main")}
                >
                  홈으로
                </button>
                <button className="result-button primary" onClick={handleGoReport}>
                  마이레포트 가기 →
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}