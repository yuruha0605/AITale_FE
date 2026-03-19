import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import testQuestions from "../../data/testQuestions";
import "./TestQuizPage.css";

export default function TestQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionIndex = Number(id) - 1;

  const question = testQuestions[questionIndex];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  if (!question) return null;

  const messages = [
    "잘하고 있어! 💪",
    "집중력 최고야! 🔥",
    "거의 다 왔어! 🚀",
    "정말 대단해! 👏",
  ];

  const handleCheck = () => {
    if (selectedIndex === null) return;

    let results = JSON.parse(localStorage.getItem("testResults") || "[]");

    const correct = selectedIndex === question.answer;

    results.push({
      correct,
      score: correct ? 1 : 0,
    });

    localStorage.setItem("testResults", JSON.stringify(results));

    setShowResult(true);
  };

  const handleNext = () => {
    if (!showResult) return;

    const randomMsg =
      messages[Math.floor(Math.random() * messages.length)];
    setShowMessage(randomMsg);

    setTimeout(() => {
      if (questionIndex === 9) {
        navigate("/test/result");
      } else {
        navigate(`/test/${questionIndex + 2}`);
        setSelectedIndex(null);
        setShowResult(false);
        setShowMessage("");
      }
    }, 800);
  };

  return (
    <div className="adventure-page">
      <div className="adventure-card">

        {/* 진행도 */}
        <div className="progress-box">
          {questionIndex + 1} / 10
        </div>

        <div className="adventure-character">🧠</div>

        <h2 className="question-title">{question.question}</h2>

        <div className="option-list">
          {question.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            const isAnswer = question.answer === i;

            let extraClass = "";
            if (showResult) {
              if (isAnswer) extraClass = "correct";
              else if (isSelected) extraClass = "wrong";
            }

            return (
              <button
                key={i}
                className={`option-button ${isSelected ? "selected" : ""} ${extraClass}`}
                onClick={() => !showResult && setSelectedIndex(i)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="quiz-result-box">
            {selectedIndex === question.answer
              ? "정답! ✨"
              : "오답 😢"}
          </div>
        )}

        {showMessage && (
          <p className="encourage-msg">{showMessage}</p>
        )}

        <div className="adventure-button-row">
          {!showResult && (
            <button className="adventure-button" onClick={handleCheck}>
              정답 확인
            </button>
          )}

          <button className="adventure-button" onClick={handleNext}>
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}