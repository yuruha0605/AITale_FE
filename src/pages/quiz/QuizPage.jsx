import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizQuestions from "../../data/quizQuestions";
import "./QuizPage.css";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionIndex = Number(id) - 1;

  const difficulty = localStorage.getItem("difficulty") || "중";

  // 난이도별 5문제
  const filteredQuestions = useMemo(() => {
    return quizQuestions
      .filter((q) => q.difficulty === difficulty)
      .slice(0, 5);
  }, [difficulty]);

  const question = filteredQuestions[questionIndex];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // questionIndex가 범위를 벗어나면 null 반환 (6/5 방지)
  if (!question || questionIndex < 0 || questionIndex >= filteredQuestions.length) {
    return null;
  }

  const getScore = () => {
    if (difficulty === "하") return 1;
    if (difficulty === "중") return 2;
    if (difficulty === "상") return 3;
    return 1;
  };

  const fetchAiExplanation = async (isCorrect, question) => {
    setLoadingAi(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "당신은 어린이를 위한 친절한 동화 선생님이에요. 퀴즈 해설을 짧고 재미있게, 동화 내용과 연결해서 2~3문장으로 설명해주세요. 이모지를 1~2개 사용하고, 쉬운 말로 설명해주세요.",
          messages: [
            {
              role: "user",
              content: `문제: ${question.question}\n정답: ${question.options[question.answer]}\n기본 해설: ${question.explanation}\n\n위 내용을 바탕으로 어린이에게 친절하게 해설해주세요.`,
            },
          ],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || question.explanation;
      setAiExplanation(text);
    } catch (e) {
      setAiExplanation(question.explanation);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCheck = () => {
    if (selectedIndex === null) {
      setShowAlert(true);
      return;
    }
    if (showResult) return; // 이미 확인한 경우 중복 저장 방지

    let results = JSON.parse(localStorage.getItem("quizResults") || "[]");
    const correct = selectedIndex === question.answer;

    results.push({
      id: question.id,
      correct,
      score: correct ? getScore() : 0,
    });

    localStorage.setItem("quizResults", JSON.stringify(results));
    setShowResult(true);
    fetchAiExplanation(correct, question);
  };

  const handleNext = () => {
    if (!showResult) {
      setShowAlert(true);
      return;
    }

    // 마지막 문제(index 4)면 결과 페이지로
    if (questionIndex >= filteredQuestions.length - 1) {
      navigate("/quiz/result");
    } else {
      navigate(`/quiz/${questionIndex + 2}`);
      setSelectedIndex(null);
      setShowResult(false);
      setAiExplanation("");
    }
  };

  return (
    <div className="adventure-page">
      <div className="adventure-card">
        <div className="adventure-character">📖</div>

        <p className="adventure-progress-text">
          문제 {questionIndex + 1} / {filteredQuestions.length}
        </p>

        {question.story && (
          <div className="story-box">
            <p>{question.story}</p>
          </div>
        )}

        <h2>{question.question}</h2>

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
                disabled={showResult}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="quiz-result-box">
            <strong>
              {selectedIndex === question.answer
                ? "정답이야! 정말 잘했어 ✨"
                : "오답입니다 😢"}
            </strong>
            <div className="ai-explanation">
              {loadingAi ? (
                <p className="ai-loading">🤖 해설 불러오는 중...</p>
              ) : (
                <p>{aiExplanation}</p>
              )}
            </div>
          </div>
        )}

        <div className="adventure-button-row">
          {!showResult && (
            <button className="adventure-button secondary" onClick={handleCheck}>
              정답 확인
            </button>
          )}
          <button className="adventure-button" onClick={handleNext}>
            {questionIndex >= filteredQuestions.length - 1 ? "결과 보기 →" : "다음 →"}
          </button>
        </div>
      </div>

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