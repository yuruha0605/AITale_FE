import { useNavigate } from "react-router-dom";
import "./QuizExplanationPage.css";

export default function QuizExplanationPage() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname") || "친구";

  const result = JSON.parse(localStorage.getItem("quizSubmitResult") || "{}");
  const explanations = result?.explanations || [];
  const correctCount = result?.baseCorrectCount || 0;

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
          <div className="result-top-badge">🧠 틀린 문제 해설</div>

          <h1 className="result-title">{nickname}의 해설 페이지예요</h1>
          <p className="result-subtitle">
            기본 문제 {5 - correctCount}개에 대한 해설을 정리했어요.
          </p>

          {explanations.length > 0 ? (
            <div className="result-report-box">
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
          ) : (
            <div className="result-badge-card gold">
              <div className="result-badge-emoji">✨</div>
              <h2>모든 문제를 맞혔어요!</h2>
              <p>틀린 문제가 없어서 해설도 없어요.</p>
            </div>
          )}

          <div className="result-button-row">
            <button
              className="result-button primary"
              onClick={() => navigate("/quiz/result")}
            >
              결과 보기 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}