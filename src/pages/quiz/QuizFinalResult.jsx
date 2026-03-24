import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizFinalResult.css";

const BADGE_META = {
  complete: {
    emoji: "🟤",
    title: "동화 완독 배지",
    desc: "동화를 끝까지 읽고 퀴즈를 완주했어요.",
    className: "bronze",
  },
  silver: {
    emoji: "⚪",
    title: "은색 책벌레 배지",
    desc: "이야기 내용을 잘 이해하고 있어요.",
    className: "silver",
  },
  gold: {
    emoji: "🟡",
    title: "금색 책벌레 배지",
    desc: "기본 5문제를 모두 정답으로 맞혔어요.",
    className: "gold",
  },
  basicPlatinum: {
    emoji: "💎",
    title: "기본 플래티넘 책벌레 배지",
    desc: "최고 난이도에서 완벽하게 문제를 해결했어요.",
    className: "platinum",
  },
  platinum: {
    emoji: "💎",
    title: "플래티넘 책벌레 배지",
    desc: "기본 문제와 추가 문제까지 모두 완벽하게 맞혔어요.",
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

export default function QuizFinalResult() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  const baseDifficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";
  const extraDifficulty = localStorage.getItem("extraDifficulty") || "상";

  const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]").slice(0, 5);
  const extraResults = JSON.parse(localStorage.getItem("extraResults") || "[]").slice(0, 2);

  const {
    baseCorrectCount,
    extraCorrectCount,
    baseScore,
    extraScore,
    finalBadgeKey,
    finalScore,
    finalCorrectDisplay,
  } = useMemo(() => {
    const baseCorrect = quizResults.filter((item) => item?.correct).length;
    const extraCorrect = extraResults.filter((item) => item?.correct).length;

    const baseTotalScore = quizResults.reduce((sum, item) => sum + (item?.score || 0), 0);
    const extraTotalScore = extraResults.reduce((sum, item) => sum + (item?.score || 0), 0);

    let badgeKey = getBaseBadgeKey(baseCorrect, baseDifficulty);
    let displayedScore = baseTotalScore;
    let displayedCorrect = `${baseCorrect} / 5`;

    if (baseDifficulty === "상" && baseCorrect === 5) {
      badgeKey = "basicPlatinum";
    } else if (baseCorrect === 5 && extraCorrect === 2) {
      badgeKey = "platinum";
      displayedScore = baseTotalScore + extraTotalScore;
      displayedCorrect = "7 / 7";
    }

    return {
      baseCorrectCount: baseCorrect,
      extraCorrectCount: extraCorrect,
      baseScore: baseTotalScore,
      extraScore: extraTotalScore,
      finalBadgeKey: badgeKey,
      finalScore: displayedScore,
      finalCorrectDisplay: displayedCorrect,
    };
  }, [baseDifficulty, extraResults, quizResults]);

  const finalBadge = BADGE_META[finalBadgeKey];

  useEffect(() => {
    localStorage.setItem("quizScore", String(finalScore));
    localStorage.setItem("quizExp", String(finalScore));
    localStorage.setItem("finalBadge", finalBadge.title);

    saveQuizHistory({
      score:
        finalBadgeKey === "platinum"
          ? baseCorrectCount + extraCorrectCount
          : baseCorrectCount,
      exp: finalScore,
      badge: finalBadge.title,
    });
  }, [
    baseCorrectCount,
    extraCorrectCount,
    finalBadge.title,
    finalBadgeKey,
    finalScore,
  ]);

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

          <h1 className="final-title">
            {nickname}의 최종 배지가 정해졌어요
          </h1>

          <p className="final-subtitle">
            기본 문제와 추가 도전 결과를 모두 반영한 최종 결과예요.
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
              <span>추가 도전</span>
              <strong>{extraCorrectCount} / 2</strong>
            </div>

            <div className="final-summary-card">
              <span>최종 점수</span>
              <strong>{finalScore} EXP</strong>
            </div>
          </div>

          <div className="final-report-box">
            <h3>최종 정리</h3>
            <ul>
              <li>
                기본 난이도: <strong>{baseDifficulty}</strong>
              </li>
              <li>
                추가 도전 난이도: <strong>{extraDifficulty}</strong>
              </li>
              <li>
                최종 정답 수: <strong>{finalCorrectDisplay}</strong>
              </li>
              <li>
                추가 문제를 모두 맞혔을 때만 플래티넘이 확정돼요.
              </li>
            </ul>
          </div>

          <div className="final-button-row">
            <button
              className="final-button primary"
              onClick={() => navigate("/myreport")}
            >
              학습 레포트 보기 →
            </button>
            <button className="final-button secondary" onClick={handleRestart}>
              다시 도전하기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}