import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizExtraPage.css";

const BASE_URL = "http://localhost:8080";

const REVERSE_DIFFICULTY_MAP = {
  EASY: "하",
  NORMAL: "중",
  HARD: "상",
};

export default function QuizExtraPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionIndex = Number(id) - 1;
  const storyId = localStorage.getItem("storyId");
  const userId = localStorage.getItem("userId");
  const baseDifficulty = localStorage.getItem("baseDifficulty") || "중";
  const extraDifficulty = localStorage.getItem("extraDifficulty");

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
    const fetchBonusQuestions = async () => {
      if (!storyId || !extraDifficulty) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/story_quiz/bonus?storyId=${storyId}&nextDifficulty=${extraDifficulty}`
        );

        if (!res.ok) {
          throw new Error("보너스 문제 조회 실패");
        }

        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBonusQuestions();
  }, [storyId, extraDifficulty]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bonusAnswers") || "[]");
    const current = saved[questionIndex];

    setSelectedIndex(typeof current?.answer === "number" ? current.answer : null);
    setShowSaved(false);
    setShowAlert(false);
  }, [questionIndex]);

  const handleSaveAnswer = () => {
    if (selectedIndex === null) {
      setShowAlert(true);
      return;
    }

    if (!question) return;

    const saved = JSON.parse(localStorage.getItem("bonusAnswers") || "[]");

    saved[questionIndex] = {
      questionId: question.id,
      answer: selectedIndex,
    };

    localStorage.setItem("bonusAnswers", JSON.stringify(saved));
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

        const saved = JSON.parse(localStorage.getItem("bonusAnswers") || "[]");

        const res = await fetch(`${BASE_URL}/story_quiz/bonus/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(userId),
            storyId: Number(storyId),
            bonusDifficulty: extraDifficulty,
            answers: saved.map((item) => ({
              questionId: item.questionId,
              answer: item.answer,
            })),
          }),
        });

        if (!res.ok) {
          throw new Error("보너스 문제 제출 실패");
        }

        const bonusResult = await res.json();
        localStorage.setItem("quizBonusSubmitResult", JSON.stringify(bonusResult));

        navigate("/quiz/final-result");
      } catch (error) {
        console.error(error);
        alert("추가 문제 제출에 실패했어요.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    navigate(`/quiz/extra/${questionIndex + 2}`);
  };

  if (loading) {
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
              <h2>추가 문제를 불러오는 중이에요.</h2>
            </div>
          </section>
        </main>
      </div>
    );
  }

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
              <p>보너스 문제 응답과 난이도를 확인해주세요.</p>
              <div className="extra-button-row center">
                <button
                  className="extra-button secondary"
                  onClick={() => navigate("/quiz/result")}
                >
                  결과 페이지로 돌아가기
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const extraDifficultyText =
    REVERSE_DIFFICULTY_MAP[extraDifficulty] || extraDifficulty;

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
                <span className="extra-chip strong">도전 {extraDifficultyText}</span>
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
              <p>추가 문제를 모두 제출하면 최종 결과를 확인할 수 있어요.</p>
            </div>

            <div className="extra-question-box">
              <p className="extra-question-label">QUESTION</p>
              <h2>{question.question}</h2>
            </div>

            <div className="extra-option-list">
              {question.options?.map((option, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={`${question.id}-${index}`}
                    className={`extra-option-button ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className="extra-option-index">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="extra-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {showSaved && (
              <div className="extra-feedback-box success">
                <div className="extra-feedback-title">답안이 저장되었어요 ✨</div>
                <div className="extra-ai-box">
                  <div className="extra-ai-label">안내</div>
                  <p>모든 추가 문제를 제출하면 최종 결과를 확인할 수 있어요.</p>
                </div>
              </div>
            )}

            <div className="extra-button-row">
              {!showSaved ? (
                <button className="extra-button secondary" onClick={handleSaveAnswer}>
                  답 저장
                </button>
              ) : (
                <button
                  className="extra-button primary"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  {questionIndex >= questions.length - 1
                    ? submitting
                      ? "제출 중..."
                      : "최종 결과 보기 →"
                    : "다음 문제 →"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {showAlert && (
        <div className="extra-modal">
          <div className="extra-modal-card">
            <p>답을 먼저 선택하고 저장해주세요.</p>
            <button className="extra-button primary" onClick={() => setShowAlert(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}