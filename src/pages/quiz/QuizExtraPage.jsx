import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import extraQuestions from "../../data/extraQuestions";
import "./QuizExtraPage.css"; 

export default function QuizExtraPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionIndex = Number(id) - 1;

  const question = useMemo(() => extraQuestions[questionIndex], [questionIndex]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  if (!question) return null;

  // ✅ 추가문제는 난이도 높으니까 점수 고정 (선택)
  const getScore = () => 3;

  const handleCheck = () => {
    if (selectedIndex === null) {
      setShowAlert(true);
      return;
    }

    let results = JSON.parse(localStorage.getItem("extraResults") || "[]");

    const correct = selectedIndex === question.answer;

    results.push({
      id: question.id,
      correct,
      score: correct ? getScore() : 0,
    });

    localStorage.setItem("extraResults", JSON.stringify(results));

    setShowResult(true);
  };

  const handleNext = () => {
    if (!showResult) {
      setShowAlert(true);
      return;
    }

    if (question.id < extraQuestions.length) {
      navigate(`/quiz/extra/${question.id + 1}`);
      setSelectedIndex(null);
      setShowResult(false);
    } else {
      navigate("/quiz/extra/result");
    }
  };

  return (
    <div className="adventure-page">
      <div className="adventure-card">
        <div className="adventure-character">🔥</div>

        <p className="adventure-progress-text">
          추가 문제 {question.id} / {extraQuestions.length}
        </p>

        <div className="story-box">
          <p>{question.story || "추가 도전 문제!"}</p>
        </div>

        <h2>{question.question}</h2>

        <div className="option-list">
          {question.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            const isAnswer = question.answer === i;

            let extraClass = "";

            if (showResult) {
              if (isAnswer) {
                extraClass = "correct";
              } else if (isSelected && !isAnswer) {
                extraClass = "wrong";
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

        {/* ✅ 결과 */}
        {showResult && (
          <div className="quiz-result-box">
            <strong>
              {selectedIndex === question.answer
                ? "정답이야! 최고 난이도 성공 ✨"
                : "아쉽다 😢"}
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

      {/* ✅ 팝업 */}
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