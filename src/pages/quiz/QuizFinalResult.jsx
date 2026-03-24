import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizFinalResult.css";

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
    desc: "기본 문제를 완벽하게 해결했어요.",
    className: "gold",
  },
  basicPlatinum: {
    emoji: "💎",
    title: "기본 플래티넘 책벌레 배지",
    desc: "최고 난이도 기본 문제를 완벽하게 해결했어요.",
    className: "platinum",
  },
  platinum: {
    emoji: "👑",
    title: "플래티넘 책벌레 배지",
    desc: "기본 문제와 추가 문제까지 모두 완벽하게 해결했어요.",
    className: "platinum",
  },
};

function getFinalBadgeKey(baseCorrectCount, bonusCorrectCount, difficulty) {
  if (difficulty === "상" && baseCorrectCount === 5) {
    return "basicPlatinum";
  }

  if (baseCorrectCount === 5 && bonusCorrectCount === 2) {
    return "platinum";
  }

  if (baseCorrectCount === 5) {
    return "gold";
  }

  if (baseCorrectCount >= 3) {
    return "silver";
  }

  return "complete";
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

export default function QuizFinalResult() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  const result = JSON.parse(localStorage.getItem("quizBonusSubmitResult") || "{}");

  const baseDifficulty = localStorage.getItem("baseDifficulty") || "중";
  const extraDifficulty = localStorage.getItem("extraDifficulty");

  const baseCorrectCount = result?.baseCorrectCount || 0;
  const bonusCorrectCount = result?.bonusCorrectCount || 0;
  const totalScore = result?.totalScore || 0;
  const explanations = result?.explanations || [];

  const badgeKey = useMemo(
    () => getFinalBadgeKey(baseCorrectCount, bonusCorrectCount, baseDifficulty),
    [baseCorrectCount, bonusCorrectCount, baseDifficulty]
  );

  const finalBadge = BADGE_META[badgeKey];

  useEffect(() => {
    localStorage.setItem("quizScore", String(totalScore));
    localStorage.setItem("quizExp", String(totalScore));
    localStorage.setItem("finalBadge", finalBadge.title);

    saveQuizHistory({
      score: baseCorrectCount + bonusCorrectCount,
      exp: totalScore,
      badge: finalBadge.title,
    });
  }, [baseCorrectCount, bonusCorrectCount, finalBadge.title, totalScore]);

  const extraDifficultyText =
    REVERSE_DIFFICULTY_MAP[extraDifficulty] || extraDifficulty;

  return (
    <div className="final-page">
      <div className="final-bg">
        <div className="final-bg-cloud cloud-1" />
        <div className="final-bg-cloud cloud-2" />
        <div className="final-bg-cloud cloud-3" />
        <div className="final-bg-hill" />
      </div>

      <main className="final-content">
        <section className="final-card">
          <div className="final-top-badge">👑 최종 결과</div>

          <h1 className="final-title">{nickname}의 최종 배지가 정해졌어요</h1>
          <p className="final-subtitle">
            기본 문제와 추가 문제 결과를 모두 반영한 최종 결과예요.
          </p>

          <div className={`final-badge-card ${finalBadge.className}`}>
            <div className="final-badge-emoji">{finalBadge.emoji}</div>
            <h2>{finalBadge.title}</h2>
            <p>{finalBadge.desc}</p>
          </div>

          <div className="final-summary-grid">
            <div className="final-summary-card">
              <span>기본 퀴즈</span>
              <strong>{baseCorrectCount} / 5</strong>
            </div>

            <div className="final-summary-card">
              <span>추가 문제</span>
              <strong>{bonusCorrectCount} / 2</strong>
            </div>

            <div className="final-summary-card">
              <span>최종 점수</span>
              <strong>{totalScore} EXP</strong>
            </div>
          </div>

          <div className="final-report-box">
            <h3>최종 정리</h3>
            <ul>
              <li>
                기본 난이도: <strong>{baseDifficulty}</strong>
              </li>
              <li>
                추가 도전 난이도: <strong>{extraDifficultyText}</strong>
              </li>
              <li>
                최종 정답 수: <strong>{baseCorrectCount + bonusCorrectCount} / 7</strong>
              </li>
            </ul>
          </div>

          {explanations.length > 0 && (
            <div className="final-report-box">
              <h3>AI 해설</h3>
              <ul>
                {explanations.map((item) => (
                  <li key={item.questionId}>
                    <strong>문제 {item.questionId}</strong>
                    <p>{item.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="final-button-row">
            <button
              className="final-button secondary"
              onClick={() => navigate("/main")}
            >
              홈으로
            </button>
            <button
              className="final-button primary"
              onClick={() => navigate("/myreport")}
            >
              마이레포트 가기 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}