import { useEffect, useMemo, useState } from "react";
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

  // 문단 기준으로 페이지 나누기
  const storyPages = useMemo(() => {
    const paragraphs = story.content
      .split("\n\n")
      .map((text) => text.trim())
      .filter(Boolean);

    const pages = [];
    const PAGE_SIZE = 3; // 페이지당 문단 수

    for (let i = 0; i < paragraphs.length; i += PAGE_SIZE) {
      pages.push(paragraphs.slice(i, i + PAGE_SIZE));
    }

    return pages;
  }, [story]);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [story]);

  const totalPages = storyPages.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

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
           <button className="story-btn story-btn-secondary" onClick={() => navigate(-1)}>
            이전
           </button>
          <div className="story-progress-text">동화 읽기</div>
        </div>

        <div className="story-main-layout">
          {/* 왼쪽: 메타 정보 */}
          <aside className="story-side-panel">
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
          </aside>

          {/* 오른쪽: 제목 + 이미지 + 내용 */}
          <section className="story-content-panel">
            <header className="story-header">
              <h1 className="story-title">{story.title}</h1>
              <p className="story-subtitle">오늘도 재미있는 동화를 읽어볼까요?</p>
            </header>

            {/* 이미지 위치를 내용 바로 위로 이동 */}
            <div className="story-image-block">
              <div className="story-image-frame">
                <img src={story.image} alt={story.title} className="story-image" />
              </div>
              <p className="story-image-caption">AI 생성 이미지 예시</p>
            </div>

            <div className="story-body-box">
              <div className="story-body-top">
                <div className="story-body-title">내용</div>
                <div className="story-page-indicator">
                  {currentPage + 1} / {totalPages}
                </div>
              </div>

              <div className="story-body-text no-scroll">
                {storyPages[currentPage]?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="story-page-controls">
                <button
                  className="story-page-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  ← 이전 페이지
                </button>

                <button
                  className="story-page-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  다음 페이지 →
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="story-bottom-row">
          <button className="story-btn story-btn-primary">
            다음 활동 →
          </button>
        </div>
      </div>
    </div>
  );
}