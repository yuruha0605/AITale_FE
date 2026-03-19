import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const STORIES = [
  { id: 1, title: "토끼와 거북이", emoji: "🐰🐢", level: "⭐ 쉬움" },
  { id: 2, title: "아기 돼지 삼형제", emoji: "🐷", level: "⭐ 쉬움" },
  { id: 3, title: "금도끼 은도끼", emoji: "🪓", level: "⭐⭐ 보통" },
];

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="story-page">
      {/* 🌈 배경 그대로 유지 */}
      <div className="story-bg">
        <div className="sun" />
        <div className="cloud cloud1" />
        <div className="cloud cloud2" />
        <div className="cloud cloud3" />
        <div className="stars" />
        <div className="hill hill-front" />
        <div className="flower flower1" />
        <div className="flower flower2" />
        <div className="flower flower3" />
        <div className="flower flower4" />
      </div>

      <div className="story-content">
        {/* ✅ 제목만 변경 */}
        <div className="story-header">
          <h1>📚 아이동화</h1>
          <p>읽고 싶은 동화를 골라보세요!</p>
        </div>

        {/* ✅ 카드 4개 (여기 핵심🔥) */}
        <div className="story-list main-list">
          {STORIES.map((story) => (
            <div className="story-card" key={story.id}>
              <div className="story-book-cover">
                <div className="story-book-thumb">
                  {story.emoji}
                </div>
              </div>

              <h3 className="story-title">{story.title}</h3>
              <p className="story-level">난이도 · {story.level}</p>

              <button
                className="story-read-button"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                읽기
              </button>
            </div>
          ))}

          {/* ⭐ 마지막 카드 = AI 추천 */}
          <div className="story-card ai-card">
            <div className="story-book-cover">
              <div className="story-book-thumb">🤖</div>
            </div>

            <h3 className="story-title">AI 추천 동화</h3>
            <p className="story-level">나에게 맞는 이야기</p>

            <button
              className="story-read-button"
              onClick={() => navigate("/stories")}
            >
              보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}