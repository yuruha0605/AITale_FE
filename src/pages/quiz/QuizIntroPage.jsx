import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizIntroPage.css";

const SCORE_BY_DIFFICULTY = {
  하: 1,
  중: 2,
  상: 3,
};

export default function QuizIntroPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  const baseDifficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";

  const scorePerQuestion = useMemo(
    () => SCORE_BY_DIFFICULTY[baseDifficulty] || 1,
    [baseDifficulty]
  );

  useEffect(() => {
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("bonusAnswers");
    localStorage.removeItem("quizSubmitResult");
    localStorage.removeItem("quizBonusSubmitResult");
    localStorage.removeItem("extraDifficulty");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizExp");
    localStorage.removeItem("finalBadge");

    localStorage.setItem("baseDifficulty", baseDifficulty);
    localStorage.setItem("difficulty", baseDifficulty);
  }, [baseDifficulty]);

  const handleStart = () => {
    navigate("/quiz/1");
  };

  return (
    <div className="quiz-intro-page">
      <div className="quiz-intro-bg">
        <div className="quiz-bg-cloud cloud-1" />
        <div className="quiz-bg-cloud cloud-2" />
        <div className="quiz-bg-cloud cloud-3" />
        <div className="quiz-bg-hill" />
      </div>

      <main className="quiz-intro-content">
        <section className="quiz-intro-shell">
          <div className="quiz-intro-card">
            <div className="quiz-intro-top">
              <div className="quiz-service-badge">✨ 아이(AI)동화 · 동화 퀴즈</div>
              <div className="quiz-difficulty-chip">
                현재 난이도 <strong>{baseDifficulty}</strong>
              </div>
            </div>

            <div className="quiz-intro-hero">
              <div className="quiz-intro-character">📖</div>

              <h1 className="quiz-intro-title">
                {nickname}의
                <br />
                동화 퀴즈를 시작해볼까?
              </h1>

              <p className="quiz-intro-desc">
                기본 문제는 5문제예요. 문제를 모두 푼 뒤 해설과 결과를 확인할 수 있어요.
              </p>
            </div>

            <div className="quiz-summary-grid">
              <div className="quiz-summary-card">
                <span>문제 수</span>
                <strong>5문제</strong>
              </div>

              <div className="quiz-summary-card">
                <span>문제당 EXP</span>
                <strong>{scorePerQuestion} EXP</strong>
              </div>

              <div className="quiz-summary-card">
                <span>보너스 문제</span>
                <strong>전부 정답 시 가능</strong>
              </div>
            </div>

            <div className="quiz-action-row">
              <button
                className="quiz-action-button secondary"
                onClick={() => navigate("/main")}
              >
                ← 홈으로
              </button>

              <button
                className="quiz-action-button primary"
                onClick={handleStart}
              >
                퀴즈 시작하기 →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}