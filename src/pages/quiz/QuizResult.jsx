import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizResult.css";

const SCORE_BY_DIFFICULTY = {
  하: 1,
  중: 2,
  상: 3,
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

function getNextDifficulty(level) {
  if (level === "하") return "중";
  if (level === "중") return "상";
  return "상";
}

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

  const payload = {
    date: today,
    score,
    exp,
    badge,
  };

  if (index >= 0) history[index] = payload;
  else history.push(payload);

  localStorage.setItem("quizHistory", JSON.stringify(history));
}

export default function QuizResultPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";
  const difficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";

  const results = JSON.parse(localStorage.getItem("quizResults") || "[]").slice(0, 5);

  const { correctCount, totalScore } = useMemo(() => {
    let correct = 0;
    let score = 0;

    results.forEach((item) => {
      if (item?.correct) correct += 1;
      score += item?.score || 0;
    });

    return { correctCount: correct, totalScore: score };
  }, [results]);

  const badgeKey = getBaseBadgeKey(correctCount, difficulty);
  const badge = BADGE_META[badgeKey];
  const canTryExtra = correctCount === 5 && difficulty !== "상";
  const baseDifficulty = localStorage.getItem("baseDifficulty") || "중";
  const nextDifficulty = getNextDifficulty(baseDifficulty);

  useEffect(() => {
    localStorage.setItem("quizScore", String(totalScore));
    localStorage.setItem("quizExp", String(totalScore));
    localStorage.setItem("finalBadge", badge.title);

    if (!canTryExtra) {
      saveQuizHistory({
        score: correctCount,
        exp: totalScore,
        badge: badge.title,
      });
    }
  }, [badge.title, canTryExtra, correctCount, totalScore]);

  const handleTryExtra = () => {
    localStorage.removeItem("extraResults");
    localStorage.setItem("extraDifficulty", nextDifficulty);
    navigate("/quiz/extra/1");
};

  const handleSkip = () => {
    saveQuizHistory({
      score: correctCount,
      exp: totalScore,
      badge: badge.title,
    });
    navigate("/report");
  };

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizExp");
    localStorage.removeItem("finalBadge");
    localStorage.removeItem("extraDifficulty");
    navigate("/quiz/1");
  };

  return (
    <div className="quiz-result-page">
      <div className="quiz-result-bg">
        <div className="quiz-bg-cloud cloud-1" />
        <div className="quiz-bg-cloud cloud-2" />
        <div className="quiz-bg-cloud cloud-3" />
        <div className="quiz-bg-hill" />
      </div>

      <main className="quiz-result-content">
        <section className="quiz-result-card">
          <div className="quiz-result-badge-top">🏆 퀴즈 결과</div>

          <h1 className="quiz-result-title">
            {nickname}의 기본 퀴즈 결과예요
          </h1>

          <p className="quiz-result-subtitle">
            총 5문제를 풀고 얻은 결과를 확인해보세요.
          </p>

          <div className={`result-badge-card ${badge.className}`}>
            <div className="result-badge-emoji">{badge.emoji}</div>
            <h2>{badge.title}</h2>
            <p>{badge.desc}</p>
          </div>

          <div className="result-summary-grid">
            <div className="result-summary-card">
              <span>정답 수</span>
              <strong>{correctCount} / 5</strong>
            </div>
            <div className="result-summary-card">
              <span>획득 점수</span>
              <strong>{totalScore} EXP</strong>
            </div>
            <div className="result-summary-card">
              <span>현재 난이도</span>
              <strong>{difficulty}</strong>
            </div>
          </div>

          {canTryExtra ? (
            <div className="result-challenge-box">
              <h3>한 단계 더 도전해볼까요?</h3>
              <p>
                기본 5문제를 모두 맞혔어요.
                <br />
                <strong>{nextDifficulty}</strong> 난이도 문제 2개를 더 풀면
                플래티넘 책벌레 배지에 도전할 수 있어요.
              </p>

              <div className="result-button-row">
                <button className="result-button primary" onClick={handleTryExtra}>
                  추가 문제 도전하기 →
                </button>
                <button className="result-button secondary" onClick={handleSkip}>
                  여기까지 하고 레포트 보기
                </button>
              </div>
            </div>
          ) : (
            <div className="result-info-box">
              {difficulty === "상" && correctCount === 5 ? (
                <p>
                  최고 난이도에서 기본 5문제를 모두 맞혀서
                  <strong> 기본 플래티넘 책벌레 배지</strong>를 받았어요.
                </p>
              ) : (
                <p>이번 결과를 바탕으로 학습 레포트를 확인해보세요.</p>
              )}

              <div className="result-button-row">
                <button className="result-button primary" onClick={handleSkip}>
                  학습 레포트 보기 →
                </button>
              </div>
            </div>
          )}

          <div className="result-button-row bottom">
            <button className="result-button secondary" onClick={handleRestart}>
              다시 풀기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}