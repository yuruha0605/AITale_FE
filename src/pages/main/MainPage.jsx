import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MainPage.css";

const STORIES = [
  {
    id: 1,
    title: "토끼와 거북이",
    emoji: "🐰🐢",
    level: "⭐ 쉬움",
    desc: "끝까지 포기하지 않으면 이길 수 있어요!",
  },
  {
    id: 2,
    title: "아기 돼지 삼형제",
    emoji: "🐷",
    level: "⭐ 쉬움",
    desc: "튼튼한 집의 비밀을 함께 알아봐요!",
  },
  {
    id: 3,
    title: "금도끼 은도끼",
    emoji: "🪓",
    level: "⭐⭐ 보통",
    desc: "정직한 마음이 왜 소중한지 배워봐요!",
  },
];

export default function MainPage() {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("likedStories");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("likedStories", JSON.stringify(liked));
  }, [liked]);

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="story-page">
      <div className="story-bg">
        <div className="cloud cloud1" />
        <div className="cloud cloud2" />
        <div className="cloud cloud3" />
        <div className="hill hill-front" />

        <div className="flower flower1" />
        <div className="flower flower2" />
        <div className="flower flower3" />
        <div className="flower flower4" />
      </div>

      <main className="story-content">
        <section className="hero-section hero-layout">
          <div className="hero-text">
            <div className="hero-badge">✨ 우리 아이 맞춤 문해력 동화 서비스</div>

            <h1>
              아이의 문해력을 키우는
              <br />
              즐거운 동화 놀이터
            </h1>

            <p className="hero-subtext">
              읽고, 생각하고, 퀴즈로 확인하며
              <br />
              재미있게 독해력과 문해력을 길러보세요.
            </p>
          </div>

          <div className="hero-cloud-card">
              <svg
                className="hero-cloud-shape"
                viewBox="0 0 500 320"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M112 252C73 252 42 221 42 182C42 145 69 117 104 113C112 78 143 54 183 54C209 54 233 64 250 82C267 64 291 54 320 54C367 54 406 84 416 127C423 124 431 123 440 123C472 123 498 149 498 181C498 212 474 238 443 240L112 252Z" />
                <rect x="88" y="150" width="324" height="102" rx="51" ry="51" />
              </svg>

              <div className="hero-cloud-content">
                <div className="hero-feature-icons">📖</div>

                <h3>
                  우리 아이에게 딱 맞는 이야기
                </h3>

                <p>
                  쉽고 재미있는 동화부터
                  <br />
                  생각을 키워주는 퀴즈까지 한 번에!
                </p>

                <button
                  className="hero-card-button"
                  onClick={() => navigate("/recommended")}
                >
                  AI 추천 동화 보러가기
                </button>
              </div>
            </div>
        </section>

        <section className="quick-menu-section">
          <div className="section-title center">
            <h2>무엇을 해볼까요?</h2>
            <p>원하는 메뉴를 눌러 바로 시작해보세요</p>
          </div>

          <div className="quick-menu-grid">
            <div className="quick-menu-card" onClick={() => navigate("/story")}>
              <div className="quick-icon">📚</div>
              <h4>동화 읽기</h4>
              <p>재미있는 동화를 골라 읽어요</p>
            </div>

            <div
              className="quick-menu-card"
              onClick={() => navigate("/recommended")}
            >
              <div className="quick-icon">🤖</div>
              <h4>AI 추천</h4>
              <p>아이 수준에 맞는 동화를 추천받아요</p>
            </div>

            <div className="quick-menu-card" onClick={() => navigate("/liked")}>
              <div className="quick-icon">❤️</div>
              <h4>좋아요</h4>
              <p>마음에 든 동화를 다시 모아봐요</p>
            </div>

            <div
              className="quick-menu-card"
              onClick={() => navigate("/mypage")}
            >
              <div className="quick-icon">🧸</div>
              <h4>내 공간</h4>
              <p>내 활동과 기록을 한눈에 확인해요</p>
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="section-title center">
            <h2>✨ 인기 동화</h2>
            <p>지금 친구들이 많이 읽고 있는 동화예요</p>
          </div>

          <div className="story-list">
            {STORIES.map((story) => (
              <article className="story-card" key={story.id}>
                <div
                  className="like-btn"
                  onClick={() => toggleLike(story.id)}
                  role="button"
                  aria-label={`${story.title} 좋아요`}
                >
                  {liked.includes(story.id) ? "❤️" : "🤍"}
                </div>

                <div className="story-book-cover">
                  <div className="story-book-thumb">{story.emoji}</div>
                </div>

                <h3 className="story-title">{story.title}</h3>
                <p className="story-level">{story.level}</p>
                <p className="story-desc">{story.desc}</p>

                <button
                  className="story-read-button"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  👉 읽으러 가기
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}