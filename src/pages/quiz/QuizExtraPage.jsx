import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import extraQuestions from "../../data/extraQuestions";
import "./QuizExtraPage.css";

const SCORE_BY_DIFFICULTY = {
  하: 1,
  중: 2,
  상: 3,
};

function getNextDifficulty(level) {
  if (level === "하") return "중";
  if (level === "중") return "상";
  return "상";
}

export default function QuizExtraPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionIndex = Number(id) - 1;
  const baseDifficulty = localStorage.getItem("baseDifficulty") || "중";

  const extraDifficulty =
    localStorage.getItem("extraDifficulty") || getNextDifficulty(baseDifficulty);
    
  const questions = useMemo(() => {
    return extraQuestions
      .filter((q) => q.difficulty === extraDifficulty)
      .slice(0, 2);
  }, [extraDifficulty]);

  const question = questions[questionIndex];
  const scorePerQuestion = SCORE_BY_DIFFICULTY[extraDifficulty] || 1;

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

  const progressPercent = ((questionIndex + 1) / 2) * 100;

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
    const results = JSON.parse(localStorage.getItem("extraResults") || "[]");

    results[questionIndex] = {
      id: question.id,
      correct,
      selectedIndex,
      answer: question.answer,
      difficulty: extraDifficulty,
      score: correct ? scorePerQuestion : 0,
    };

    localStorage.setItem("extraResults", JSON.stringify(results));
    setShowResult(true);
    await getAiExplanation();
  };

  const handleNext = () => {
    if (!showResult) {
      setShowAlert(true);
      return;
    }

    if (questionIndex >= questions.length - 1) {
      navigate("/quiz/extra/result");
      return;
    }

    navigate(`/quiz/extra/${questionIndex + 2}`);
  };

  if (!question) {
    return (
      <div className="extra-page">
        <div className="extra-bg">
          <div className="extra-bg-cloud cloud-1" />
          <div className="extra-bg-cloud cloud-2" />
          <div className="extra-bg-cloud cloud-3" />
          <div className="extra-bg-hill" />
        </div>

        <main className="extra-content">
          <section className="extra-shell">
            <div className="extra-card empty">
              <h2>추가 문제가 준비되지 않았어요.</h2>
              <p>추가 문제 데이터와 난이도 구성을 확인해주세요.</p>
              <div className="extra-button-row center">
                <button
                  className="extra-button secondary"
                  onClick={() => navigate("/quiz/result")}
                >
                  이전 결과로 돌아가기
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="extra-page">
      <div className="extra-bg">
        <div className="extra-bg-cloud cloud-1" />
        <div className="extra-bg-cloud cloud-2" />
        <div className="extra-bg-cloud cloud-3" />
        <div className="extra-bg-hill" />
      </div>

      <main className="extra-content">
        <section className="extra-shell">
          <div className="extra-card">
            <div className="extra-header">
              <div className="extra-header-left">
                <div className="extra-service-badge">🚀 추가 도전 퀴즈</div>
                <h1 className="extra-title">한 단계 더 어려운 문제예요</h1>
              </div>

              <div className="extra-header-right">
                <span className="extra-chip">기본 {baseDifficulty}</span>
                <span className="extra-chip strong">도전 {extraDifficulty}</span>
              </div>
            </div>

            <div className="extra-progress-card">
              <div className="extra-progress-top">
                <strong>
                  추가 문제 {questionIndex + 1} / {questions.length}
                </strong>
                <span>{Math.round(progressPercent)}%</span>
              </div>

              <div className="extra-progress-bar">
                <div
                  className="extra-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="extra-highlight-box">
              <strong>플래티넘 책벌레 배지 도전 중</strong>
              <p>
                추가 2문제를 모두 맞혀야 최종 플래티넘 배지를 받을 수 있어요.
              </p>
            </div>

            {question.story && (
              <div className="extra-story-box">
                <div className="extra-story-label">다시 떠올려볼 내용</div>
                <p>{question.story}</p>
              </div>
            )}

            <div className="extra-question-box">
              <p className="extra-question-label">
                HARDER QUESTION · {scorePerQuestion} EXP
              </p>
              <h2>{question.question}</h2>
            </div>

            <div className="extra-option-list">
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
                    className={`extra-option-button ${stateClass}`}
                    onClick={() => !showResult && setSelectedIndex(index)}
                    disabled={showResult}
                  >
                    <span className="extra-option-index">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="extra-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`extra-feedback-box ${
                  selectedIndex === question.answer ? "success" : "fail"
                }`}
              >
                <div className="extra-feedback-title">
                  {selectedIndex === question.answer
                    ? "추가 문제도 정답이에요! 멋져요 ✨"
                    : "이번 문제는 오답이에요 😢"}
                </div>

                {selectedIndex !== question.answer && (
                  <p className="extra-feedback-answer">
                    정답은 <strong>{question.options[question.answer]}</strong> 입니다.
                  </p>
                )}

                <div className="extra-ai-box">
                  <div className="extra-ai-label">AI 설명</div>
                  {loadingAi ? (
                    <p className="extra-ai-loading">설명을 불러오는 중이에요...</p>
                  ) : (
                    <p>{aiExplanation}</p>
                  )}
                </div>
              </div>
            )}

            <div className="extra-button-row">
              {!showResult ? (
                <button className="extra-button secondary" onClick={handleCheck}>
                  정답 확인
                </button>
              ) : (
                <button className="extra-button primary" onClick={handleNext}>
                  {questionIndex >= questions.length - 1 ? "최종 결과 보기 →" : "다음 문제 →"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {showAlert && (
        <div className="extra-modal">
          <div className="extra-modal-card">
            <p>답을 먼저 선택하거나 정답 확인을 해주세요.</p>
            <button className="extra-button primary" onClick={() => setShowAlert(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}