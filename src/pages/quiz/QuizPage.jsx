import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizQuestions from "../../data/quizQuestions";
import "./QuizPage.css";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionIndex = Number(id) - 1;

  const question = useMemo(() => quizQuestions[questionIndex], [questionIndex]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  if (!question) return null;

  const getScore = () => {
    if (question.difficulty === "하") return 1;
    if (question.difficulty === "중") return 2;
    if (question.difficulty === "상") return 3;
    return 1;
  };

  const handleCheck = () => {
    if (selectedIndex === null) {
      setShowAlert(true); // 🔥 팝업 띄움
      return;
    }

    let results = JSON.parse(localStorage.getItem("quizResults") || "[]");

    const correct = selectedIndex === question.answer;

    results.push({
      id: question.id,
      correct,
      score: correct ? getScore() : 0,
      date: new Date().toISOString().slice(0, 10),
    });

    localStorage.setItem("quizResults", JSON.stringify(results));

    setShowResult(true);
  };

  const handleNext = () => {
    if (!showResult) {
      setShowAlert(true); // 🔥 여기서도 팝업
      return;
    }

    if (question.id < quizQuestions.length) {
      navigate(`/quiz/${question.id + 1}`);
      setSelectedIndex(null);
      setShowResult(false);
    } else {
      const results = JSON.parse(localStorage.getItem("quizResults") || "[]");

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);

    const today = new Date().toISOString().slice(0, 10);

    const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

    history.push({
      date: today,
      score: totalScore,
    });

    localStorage.setItem("quizHistory", JSON.stringify(history));

    // 👉 결과 페이지 이동
    navigate("/quiz/result");
  }
};

  return (
    <div className="adventure-page">
      <div className="adventure-card">
        <div className="adventure-character">📖</div>

        <p className="adventure-progress-text">
          문제 {question.id} / {quizQuestions.length}
        </p>

        <div className="story-box">
          <p>{question.story}</p>
        </div>

        <h2>{question.question}</h2>

        <div className="option-list">
            {question.options.map((opt, i) => {
                const isSelected = selectedIndex === i;
                const isAnswer = question.answer === i;

                let extraClass = "";

                if (showResult) {
                if (isAnswer) {
                    extraClass = "correct"; // ✅ 정답은 항상 초록
                } else if (isSelected && !isAnswer) {
                    extraClass = "wrong"; // ❌ 내가 고른 오답은 빨강
                }
            }

                return (
                <button
                    key={i}
                    className={`option-button ${isSelected ? "selected" : ""} ${extraClass}`}
                    onClick={() => setSelectedIndex(i)}
                    disabled={showResult}
                >
                    {opt}
                </button>
                );
            })}
        </div>

        {/* ✅ 결과 표시 */}
        {showResult && (
          <div className="quiz-result-box">
            <strong>
              {selectedIndex === question.answer
                ? "정답이야! 정말 잘했어 ✨"
                : "오답입니다 😢"}
            </strong>
            <p>
              {question.explanation ||
                `정답은 "${question.options[question.answer]}" 입니다.`}
            </p>
          </div>
        )}

        <div className="adventure-button-row">
          <button className="adventure-button secondary" onClick={handleCheck}>
            정답 확인
          </button>
          <button className="adventure-button" onClick={handleNext}>
            다음 →
          </button>
        </div>
      </div>

      {/* ✅ 팝업 모달 */}
      {showAlert && (
        <div className="quiz-modal">
          <div className="quiz-modal-content">
            <p>정답을 먼저 확인해줘!</p>
            <button
                className="adventure-button"
                onClick={() => setShowAlert(false)}
                >
                확인
                </button>
          </div>
        </div>
      )}
    </div>
  );
}