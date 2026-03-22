import { useNavigate } from "react-router-dom";
import "./QuizIntroPage.css";
import { useEffect, useMemo } from "react";

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
    localStorage.removeItem("quizResults");
    localStorage.removeItem("extraResults");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizExp");
    localStorage.removeItem("finalBadge");
    localStorage.removeItem("extraDifficulty");

    localStorage.setItem("baseDifficulty", baseDifficulty);
    localStorage.setItem("difficulty", baseDifficulty); // 기존 코드 호환용
  }, [baseDifficulty]);

  const handleStart = () => {
    localStorage.setItem("quizScore", "0");
    localStorage.setItem("quizExp", "0");
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

              <p className="quiz-intro-subtitle">
                동화를 읽고 내용을 얼마나 잘 이해했는지
                <br />
                재미있는 퀴즈로 확인해보세요.
              </p>
            </div>

            <div className="quiz-summary-grid">
              <div className="quiz-summary-card">
                <span className="quiz-summary-icon">📝</span>
                <strong>총 5문제</strong>
                <p>한 문제씩 차근차근 풀어요</p>
              </div>

              <div className="quiz-summary-card">
                <span className="quiz-summary-icon">⭐</span>
                <strong>문제당 {scorePerQuestion}점</strong>
                <p>{baseDifficulty} 난이도 기준 점수예요</p>
              </div>

              <div className="quiz-summary-card">
                <span className="quiz-summary-icon">🤖</span>
                <strong>오답 피드백</strong>
                <p>틀리면 바로 설명을 볼 수 있어요</p>
              </div>
            </div>

            <div className="quiz-guide-box">
              <h2>퀴즈 진행 방식</h2>

              <ul className="quiz-guide-list">
                <li>
                  <span className="guide-check">✓</span>
                  현재 설정된 난이도 <strong>{baseDifficulty}</strong> 문제 5개를 풉니다.
                </li>
                <li>
                  <span className="guide-check">✓</span>
                  5문제를 모두 맞히면 한 단계 더 어려운 문제 2개에 도전할 수 있어요.
                </li>
                <li>
                  <span className="guide-check">✓</span>
                  처음부터 난이도가 <strong>상</strong>이면 추가문제 없이 바로 최고 배지를 받을 수 있어요.
                </li>
              </ul>
            </div>

            <div className="quiz-badge-preview">
              <h3>획득 가능한 배지</h3>

              <div className="quiz-badge-row">
                <div className="badge-mini bronze">
                  <span>🟤</span>
                  <p>동화 완독</p>
                </div>
                <div className="badge-mini silver">
                  <span>⚪</span>
                  <p>은색 책벌레</p>
                </div>
                <div className="badge-mini gold">
                  <span>🟡</span>
                  <p>금색 책벌레</p>
                </div>
                <div className="badge-mini platinum">
                  <span>💎</span>
                  <p>플래티넘 책벌레</p>
                </div>
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