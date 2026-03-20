import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizQuestions from "../../data/quizQuestions";
import "./QuizPage.css";

const SCORE_BY_DIFFICULTY = {
  하: 1,
  중: 2,
  상: 3,
};

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionIndex = Number(id) - 1;
  const difficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";

  const questions = useMemo(() => {
    return quizQuestions.filter((q) => q.difficulty === difficulty).slice(0, 5);
  }, [difficulty]);

  const question = questions[questionIndex];
  const scorePerQuestion = SCORE_BY_DIFFICULTY[difficulty] || 1;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setShowAlert(false);
    setAiExplanation("");
    setLoadingAi(false);
  }, [id]);

  const progressPercent = ((questionIndex + 1) / 5) * 100;

  const getAiExplanation = async () => {
    setLoadingAi(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setAiExplanation(question?.explanation || "해설을 준비 중이에요.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCheck = async () => {
    if (selectedIndex === null) {
      setShowAlert(true);
      return;
    }

    if (showResult || !question) return;

    const correct = selectedIndex === question.answer;
    const results = JSON.parse(localStorage.getItem("quizResults") || "[]");

    results[questionIndex] = {
      id: question.id,
      correct,
      selectedIndex,
      answer: question.answer,
      difficulty,
      score: correct ? scorePerQuestion : 0,
    };

    localStorage.setItem("quizResults", JSON.stringify(results));
    setShowResult(true);
    await getAiExplanation();
  };

  const handleNext = () => {
    if (!showResult) {
      setShowAlert(true);
      return;
    }

    if (questionIndex >= questions.length - 1) {
      navigate("/quiz/result");
      return;
    }

    navigate(`/quiz/${questionIndex + 2}`);
  };

  if (!question) {
    return (
      <div className="quiz-page">
        <div className="quiz-bg">
          <div className="quiz-bg-cloud cloud-1" />
          <div className="quiz-bg-cloud cloud-2" />
          <div className="quiz-bg-cloud cloud-3" />
          <div className="quiz-bg-hill" />
        </div>

        <main className="quiz-content">
          <section className="quiz-shell">
            <div className="quiz-card empty">
              <h2>문제를 불러오지 못했어요.</h2>
              <p>난이도에 맞는 문제가 준비되어 있는지 확인해주세요.</p>
              <div className="quiz-button-row center">
                <button
                  className="quiz-button secondary"
                  onClick={() => navigate("/")}
                >
                  홈으로
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-bg">
        <div className="quiz-bg-cloud cloud-1" />
        <div className="quiz-bg-cloud cloud-2" />
        <div className="quiz-bg-cloud cloud-3" />
        <div className="quiz-bg-hill" />
      </div>

      <main className="quiz-content">
        <section className="quiz-shell">
          <div className="quiz-card">
            <div className="quiz-header">
              <div className="quiz-header-left">
                <div className="quiz-service-badge">✨ 아이(AI)동화</div>
                <h1 className="quiz-title">동화 퀴즈</h1>
              </div>

              <div className="quiz-header-right">
                <span className="quiz-chip">난이도 {difficulty}</span>
                <span className="quiz-chip">{scorePerQuestion} EXP</span>
              </div>
            </div>

            <div className="quiz-progress-card">
              <div className="quiz-progress-top">
                <strong>
                  문제 {questionIndex + 1} / {questions.length}
                </strong>
                <span>{Math.round(progressPercent)}%</span>
              </div>

              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {question.story && (
              <div className="quiz-story-box">
                <div className="quiz-story-label">동화 내용 힌트</div>
                <p>{question.story}</p>
              </div>
            )}

            <div className="quiz-question-box">
              <p className="quiz-question-label">QUESTION</p>
              <h2>{question.question}</h2>
            </div>

            <div className="quiz-option-list">
              {question.options.map((option, index) => {
                const isSelected = selectedIndex === index;
                const isAnswer = question.answer === index;

                let stateClass = "";
                if (showResult) {
                  if (isAnswer) stateClass = "correct";
                  else if (isSelected) stateClass = "wrong";
                } else if (isSelected) {
                  stateClass = "selected";
                }

                return (
                  <button
                    key={`${question.id}-${index}`}
                    className={`quiz-option-button ${stateClass}`}
                    onClick={() => !showResult && setSelectedIndex(index)}
                    disabled={showResult}
                  >
                    <span className="quiz-option-index">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="quiz-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`quiz-feedback-box ${
                  selectedIndex === question.answer ? "success" : "fail"
                }`}
              >
                <div className="quiz-feedback-title">
                  {selectedIndex === question.answer
                    ? "정답이에요! 정말 잘했어요 ✨"
                    : "아쉽지만 오답이에요 😢"}
                </div>

                {selectedIndex !== question.answer && (
                  <p className="quiz-feedback-answer">
                    정답은 <strong>{question.options[question.answer]}</strong> 입니다.
                  </p>
                )}

                <div className="quiz-ai-box">
                  <div className="quiz-ai-label">AI 설명</div>
                  {loadingAi ? (
                    <p className="quiz-ai-loading">설명을 불러오는 중이에요...</p>
                  ) : (
                    <p>{aiExplanation}</p>
                  )}
                </div>
              </div>
            )}

            <div className="quiz-button-row">
              {!showResult ? (
                <button className="quiz-button secondary" onClick={handleCheck}>
                  정답 확인
                </button>
              ) : (
                <button className="quiz-button primary" onClick={handleNext}>
                  {questionIndex >= questions.length - 1 ? "결과 보기 →" : "다음 문제 →"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {showAlert && (
        <div className="quiz-modal">
          <div className="quiz-modal-card">
            <p>답을 먼저 선택하거나 정답 확인을 해주세요.</p>
            <button className="quiz-button primary" onClick={() => setShowAlert(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}