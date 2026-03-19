import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TestPage.css";
import testQuestions from "./testQuestions";

const encouragementMessages = {
    5: {
        title: "잘하고 있어요!",
        message: "벌써 절반까지 왔어요. 조금만 더 힘내봐요!",
    },
    10: {
        title: "테스트 완료!",
        message: "마지막 문제까지 모두 끝냈어요. 결과를 확인하러 가볼까요?",
    },
};

export default function TestPage() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [encouragementData, setEncouragementData] = useState(null);

    const currentQuestion = testQuestions[currentIndex];
    const currentNumber = currentIndex + 1;

    const progressPercent = useMemo(() => {
        return (currentNumber / testQuestions.length) * 100;
    }, [currentNumber]);

    const isCorrect = selectedOption === currentQuestion.answer;

    const handleSelectOption = (index) => {
        if (showFeedback) return;
        setSelectedOption(index);
    };

    const moveToNext = () => {
        const answerData = {
            questionId: currentQuestion.id, //몇 번 문제인가
            selectedOption, // 사용자가 고른 보기
            isCorrect,  //정답 여부
            score: isCorrect ? currentQuestion.difficultyScore : 0, //정답이면 난이도에 맞는 점수, 틀리면 0
        };

        const updatedAnswers = [...answers, answerData];
        setAnswers(updatedAnswers);



        if (currentNumber === 5 || currentNumber === 10) {
            setEncouragementData(encouragementMessages[currentNumber]);
            setShowEncouragement(true);

            if (currentNumber === 10) {
                const totalScore = updatedAnswers.reduce((sum, item) => sum + item.score, 0); //점수 합산

                sessionStorage.setItem(
                    "readingTestResult",
                    JSON.stringify({
                        totalScore,
                        answers: updatedAnswers,
                    })
                );
            }
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
    };

    const handleNext = () => {
        if (selectedOption === null) {
            alert("보기를 하나 선택해 주세요.");
            return;
        }

        if (!showFeedback && !isCorrect) {
            setShowFeedback(true);
            return;
        }

        moveToNext();
    };

    const handleEncouragementConfirm = () => {
        setShowEncouragement(false);

        if (currentNumber === 10) {
            navigate("/test/result");
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
    };

    return (
        <div className="test-page">
            <div className="test-bg-sun"></div>
            <div className="test-bg-cloud cloud1"></div>
            <div className="test-bg-cloud cloud2"></div>
            <div className="test-bg-cloud cloud3"></div>
            <div className="test-bg-hill hill1"></div>
            <div className="test-bg-hill hill2"></div>

            <div className="test-card">
                <div className="test-topbar">
                    <div className="test-question-title">
                        문제 {currentNumber}
                    </div>
                    <div className="test-progress-wrap">
                        <div className="test-progress-text">
                            {currentNumber} / {testQuestions.length}
                        </div>
                        <div className="test-progress-bar">
                            <div
                                className="test-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="test-passage-box">
                    <h2 className="test-section-title">지문</h2>
                    <p className="test-passage">{currentQuestion.passage}</p>
                </div>

                <div className="test-question-box">
                    <h3 className="test-question">{currentQuestion.question}</h3>

                    <div className="test-options">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const showWrongSelected =
                                showFeedback && isSelected && !isCorrect;
                            const showCorrectAnswer =
                                showFeedback && index === currentQuestion.answer;

                            return (
                                <button
                                    key={index}
                                    className={`test-option-btn 
                    ${isSelected ? "selected" : ""}
                    ${showWrongSelected ? "wrong" : ""}
                    ${showCorrectAnswer ? "correct" : ""}
                  `}
                                    onClick={() => handleSelectOption(index)}
                                >
                                    <span className="option-index">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="option-text">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {showFeedback && !isCorrect && (
                        <div className="test-feedback-box">
                            <div className="test-feedback-title">AI 피드백</div>
                            <p className="test-feedback-text">{currentQuestion.feedback}</p>
                            <div className="test-feedback-answer">
                                정답: {String.fromCharCode(65 + currentQuestion.answer)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="test-bottom">
                    <button className="test-next-btn" onClick={handleNext}>
                        {showFeedback && !isCorrect ? "다음 문제로" : "다음"}
                    </button>
                </div>
            </div>

            {showEncouragement && encouragementData && (
                <div className="test-modal-overlay">
                    <div className="test-modal">
                        <div className="test-modal-badge">
                            {currentNumber === 10 ? "Complete" : "Cheer Up"}
                        </div>
                        <h3>{encouragementData.title}</h3>
                        <p>{encouragementData.message}</p>
                        <button
                            className="test-modal-btn"
                            onClick={handleEncouragementConfirm}
                        >
                            {currentNumber === 10 ? "결과 확인하기" : "다음 페이지로"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}