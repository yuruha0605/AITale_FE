import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinPage.css";

const interestOptions = [
  "동물 이야기",
  "공주님",
  "마법",
  "우주",
  "공룡",
  "바다",
  "요리",
  "그림 그리기",
  "음악",
  "숲속 모험",
  "친구 이야기",
  "탈것",
  "로봇",
  "계절",
  "별과 달",
];

const bookOptions = [
  {
    id: 1,
    title: "강아지똥",
    genre: "따뜻한 성장 동화",
    emoji: "🐶",
    description: "작고 소중한 존재의 의미를 알려주는 인기 동화",
  },
  {
    id: 2,
    title: "알사탕",
    genre: "감성 판타지 동화",
    emoji: "🍬",
    description: "마음을 듣게 되는 특별한 사탕 이야기",
  },
  {
    id: 3,
    title: "이상한 과자 가게 전천당",
    genre: "상상력 가득 판타지",
    emoji: "🏪",
    description: "신비한 과자와 함께 펼쳐지는 흥미진진한 이야기",
  },
];

export default function JoinPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    userId: "",
    password: "",
    birth: "",
  });

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestClick = (interest) => {
    const isSelected = selectedInterests.includes(interest);

    if (isSelected) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
      return;
    }

    if (selectedInterests.length >= 3) return;

    setSelectedInterests((prev) => [...prev, interest]);
  };

  const handleNextFromStep1 = () => {
    if (!form.userId.trim() || !form.password.trim() || !form.birth) {
      alert("아이디, 비밀번호, 생년월일을 입력해 주세요.");
      return;
    }
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (selectedInterests.length !== 3) {
      alert("관심사 3개 선택해 주세요.");
      return;
    }
    setStep(3);
  };

  const handleComplete = () => {
  if (!selectedBook) {
    alert("읽어보고 싶은 책을 1개 선택해 주세요.");
    return;
  }

  alert("회원가입 완료!");

  console.log("회원가입 데이터", {
    ...form,
    interests: selectedInterests,
    book: selectedBook,
  });

  navigate("/sign");
};

  return (
    <div className="join-page">
      <section className="join-hero">
        <div className="join-hill hill-back" />
        <div className="join-hill hill-front" />

        <div className="join-flower flower-left" />
        <div className="join-flower flower-left-small" />
        <div className="join-flower flower-right" />

        <div className="join-hero-card">
          <span className="join-badge">회원 가입</span>
          <h1>함께 이야기를 시작해요</h1>
          <p>
            너만의 관심사와 읽고 싶은 책을 골라
            <br />
            특별한 동화 세상을 만들어 볼까요?
          </p>
        </div>
      </section>

      <section className="join-content">
        <div className="join-card">
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}>1</div>
            <div className="step-line" />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}>2</div>
            <div className="step-line" />
            <div className={`step-dot ${step >= 3 ? "active" : ""}`}>3</div>
          </div>

          {step === 1 && (
            <div className="step-section">
              <h2>기본 정보를 알려주세요</h2>
              <p className="step-description">
                아이디, 비밀번호, 생년월일을 입력해 주세요.
              </p>

              <div className="input-group">
                <input
                  type="text"
                  name="userId"
                  placeholder="아이디"
                  value={form.userId}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <input
                  type="date"
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                />
              </div>

              <button className="main-button" onClick={handleNextFromStep1}>
                다음으로
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-section">
              <h2>좋아하는 관심사를 골라주세요</h2>
              <p className="step-description">
                총 3개까지 선택할 수 있어요.
                <br />
                <span className="highlight-text">
                  현재 {selectedInterests.length}/3 선택
                </span>
              </p>

              <div className="interest-grid">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={`interest-chip ${
                      selectedInterests.includes(interest) ? "selected" : ""
                    }`}
                    onClick={() => handleInterestClick(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="button-row">
                <button className="sub-button" onClick={() => setStep(1)}>
                  이전
                </button>
                <button className="main-button" onClick={handleNextFromStep2}>
                  다음으로
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-section">
              <h2>읽어보고 싶은 책을 골라주세요</h2>
              <p className="step-description">
                가장 먼저 만나보고 싶은 책 1권을 선택해 주세요.
              </p>

              <div className="book-list">
                {bookOptions.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    className={`book-card ${
                      selectedBook?.id === book.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="book-emoji">{book.emoji}</div>
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <span>{book.genre}</span>
                      <p>{book.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="button-row">
                <button className="sub-button" onClick={() => setStep(2)}>
                  이전
                </button>
                <button className="main-button" onClick={handleComplete}>
                  선택 완료
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}