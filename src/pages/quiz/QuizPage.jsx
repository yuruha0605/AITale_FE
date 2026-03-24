import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizPage.css";

const BASE_URL =
  import.meta.env.VITE_LEARNING_API_BASE_URL || "http://localhost:8083";

const DIFFICULTY_MAP = {
  하: "EASY",
  중: "NORMAL",
  상: "HARD",
};

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionIndex = Number(id) - 1;
  const difficulty =
    localStorage.getItem("baseDifficulty") ||
    localStorage.getItem("difficulty") ||
    "중";

  const storyId = localStorage.getItem("storyId");
  const userId = localStorage.getItem("userId");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const question = questions[questionIndex];
  const progressPercent =
    questions.length > 0 ? ((questionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!storyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const backendDifficulty = DIFFICULTY_MAP[difficulty] || "NORMAL";
        const res = await fetch(
          `${BASE_URL}/story_quiz?storyId=${storyId}&difficulty=${backendDifficulty}`
        );

        if (!res.ok) throw new Error("기본 문제 조회 실패");

        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [storyId, difficulty]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    const current = saved[questionIndex];

    setSelectedIndex(typeof current?.selectedIndex === "number" ? current.selectedIndex : null);
    setShowSaved(false);
    setShowAlert(false);
  }, [questionIndex]);

  const handleSaveAnswer = () => {
    if (selectedIndex === null) {
      setShowAlert(true);
      return;
    }

    if (!question) return;

    const saved = JSON.parse(localStorage.getItem("quizAnswers") || "[]");

    saved[questionIndex] = {
      questionId: question.id,
      selectedIndex,
      answer: selectedIndex + 1,
    };

    localStorage.setItem("quizAnswers", JSON.stringify(saved));
    setShowSaved(true);
  };

  const handleNext = async () => {
    if (!showSaved) {
      setShowAlert(true);
      return;
    }

    if (questionIndex >= questions.length - 1) {
      try {
        setSubmitting(true);

        const saved = JSON.parse(localStorage.getItem("quizAnswers") || "[]");

        const res = await fetch(`${BASE_URL}/story_quiz/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(userId),
            storyId: Number(storyId),
            answers: saved.map((item) => ({
              questionId: item.questionId,
              answer: item.answer,
            })),
          }),
        });

        if (!res.ok) throw new Error("기본 문제 제출 실패");

        const submitResult = await res.json();
        localStorage.setItem("quizSubmitResult", JSON.stringify(submitResult));

        if (submitResult?.nextDifficulty) {
          localStorage.setItem("extraDifficulty", submitResult.nextDifficulty);
        }

        navigate("/quiz/explanation");
      } catch (error) {
        console.error(error);
        alert("퀴즈 제출에 실패했어요.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    navigate(`/quiz/${questionIndex + 2}`);
  };

  if (loading) {
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
              <h2>문제를 불러오는 중이에요.</h2>
            </div>
          </section>
        </main>
      </div>
    );
  }

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
              <p>storyId 또는 서버 연결 상태를 확인해주세요.</p>
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
                <span className="quiz-chip">기본 문제</span>
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

            <div className="quiz-question-box">
              <p className="quiz-question-label">QUESTION</p>
              <h2>{question.question}</h2>
            </div>

            <div className="quiz-option-list">
              {question.options?.map((option, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={`${question.id}-${index}`}
                    className={`quiz-option-button ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className="quiz-option-index">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="quiz-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {showSaved && (
              <div className="quiz-feedback-box success">
                <div className="quiz-feedback-title">답안이 저장되었어요 ✨</div>
                <div className="quiz-ai-box">
                  <div className="quiz-ai-label">안내</div>
                  <p>모든 문제를 제출하면 틀린 문제 해설과 결과를 확인할 수 있어요.</p>
                </div>
              </div>
            )}

            <div className="quiz-button-row">
              {!showSaved ? (
                <button className="quiz-button secondary" onClick={handleSaveAnswer}>
                  답 저장
                </button>
              ) : (
                <button
                  className="quiz-button primary"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  {questionIndex >= questions.length - 1
                    ? submitting
                      ? "제출 중..."
                      : "해설 보기 →"
                    : "다음 문제 →"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {showAlert && (
        <div className="quiz-modal">
          <div className="quiz-modal-card">
            <p>답을 먼저 선택하고 저장해주세요.</p>
            <button className="quiz-button primary" onClick={() => setShowAlert(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}