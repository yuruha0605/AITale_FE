import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StoryData from "../../data/StoryData";
import "./StoryReadPage.css";

export default function StoryReadPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const story = useMemo(() => {
    if (id) {
      return StoryData.find((item) => String(item.id) === String(id)) || StoryData[0];
    }
    return StoryData[0];
  }, [id]);

  return (
    <div className="story-read-page">
      {/* 배경 */}
      <div className="story-bg-sun" />
      <div className="story-bg-cloud cloud-1" />
      <div className="story-bg-cloud cloud-2" />
      <div className="story-bg-cloud cloud-3" />
      <div className="story-ground" />
      <div className="story-flower flower-left-1" />
      <div className="story-flower flower-left-2" />
      <div className="story-flower flower-right-1" />
      <div className="story-flower flower-right-2" />

      <div className="story-read-card">
        <div className="story-top-row">
          <div className="story-progress-text">동화 읽기</div>
          <div className="story-progress-wrap">
            <div className="story-progress-bar">
              <div className="story-progress-fill" />
            </div>
            <span className="story-progress-count">1 / 1</span>
          </div>
        </div>

        <div className="story-main-layout">
          <aside className="story-image-panel">
            <div className="story-image-frame">
              <img src={story.image} alt={story.title} className="story-image" />
            </div>
            <p className="story-image-caption">AI 생성 이미지 예시</p>
          </aside>

          <section className="story-content-panel">
            <header className="story-header">
              <h1 className="story-title">{story.title}</h1>
              <p className="story-subtitle">오늘은 재미있는 동화를 읽어볼까요?</p>
            </header>

            <div className="story-meta-box">
              <div className="story-meta-item">
                <span className="story-meta-label">장르</span>
                <span className="story-meta-value">{story.genre}</span>
              </div>
              <div className="story-meta-item">
                <span className="story-meta-label">길이</span>
                <span className="story-meta-value">{story.length}</span>
              </div>
              <div className="story-meta-item full">
                <span className="story-meta-label">데이터 출처</span>
                <span className="story-meta-value">
                  추후 공공데이터 기반 동화 데이터 연동 예정
                </span>
              </div>
            </div>

            <div className="story-body-box">
              <div className="story-body-title">동화 내용</div>
              <div className="story-body-text">
                {story.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="story-bottom-row">
          <button className="story-btn story-btn-secondary" onClick={() => navigate(-1)}>
            이전
          </button>
          <button className="story-btn story-btn-primary">
            다음 활동 →
          </button>
        </div>
      </div>
    </div>
  );
}