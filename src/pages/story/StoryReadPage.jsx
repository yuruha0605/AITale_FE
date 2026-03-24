import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildApiUrl } from "../../config/api";
import "./StoryReadPage.css";

export default function StoryReadPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStoryDetail() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(buildApiUrl(`/story/${id}`), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`동화 조회 실패: ${response.status}`);
        }

        const result = await response.json();
        const data = result?.data ?? result;

        setStory({
          id: data.storyId ?? Number(id),
          title: data.title ?? "제목 없음",
          genre: data.genreName ?? data.genre ?? "미분류",
          length: data.charCount ?? data.length ?? 0,
          content: data.content ?? "동화 내용이 없습니다.",
          image:
            data.aiImageUrl ||
            data.imageUrl ||
            "https://placehold.co/600x400?text=Story+Image",
        });
      } catch (err) {
        console.error(err);
        setError("동화를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchStoryDetail();
    }
  }, [id]);

  const storyPages = useMemo(() => {
    if (!story?.content) {
      return [];
    }

    const paragraphs = story.content
      .split("\n\n")
      .map((text) => text.trim())
      .filter(Boolean);

    const pages = [];
    const PAGE_SIZE = 3;

    for (let i = 0; i < paragraphs.length; i += PAGE_SIZE) {
      pages.push(paragraphs.slice(i, i + PAGE_SIZE));
    }

    return pages;
  }, [story]);

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

  if (loading) {
    return (
      <div className="story-read-page">
        <div className="story-read-card">
          <p>동화를 불러오는 중이에요.</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="story-read-page">
        <div className="story-read-card">
          <p>{error || "동화를 찾을 수 없어요."}</p>
          <button
            className="story-btn story-btn-secondary"
            onClick={() => navigate(-1)}
          >
            이전
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="story-read-page">
      <div className="story-read-card">
        <div className="story-top-row">
          <button
            className="story-btn story-btn-secondary"
            onClick={() => navigate(-1)}
          >
            이전
          </button>
          <div className="story-progress-text">동화 읽기</div>
        </div>

        <div className="story-main-layout">
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
                <span className="story-meta-value">동화 상세 API 연동</span>
              </div>
            </div>
          </aside>

          <section className="story-content-panel">
            <header className="story-header">
              <h1 className="story-title">{story.title}</h1>
              <p className="story-subtitle">오늘도 재미있는 동화를 읽어볼까요?</p>
            </header>

            <div className="story-image-block">
              <div className="story-image-frame">
                <img src={story.image} alt={story.title} className="story-image" />
              </div>
              <p className="story-image-caption">동화 대표 이미지</p>
            </div>

            <div className="story-body-box">
              <div className="story-body-top">
                <div className="story-body-title">내용</div>
                <div className="story-page-indicator">
                  {totalPages > 0 ? currentPage + 1 : 0} / {totalPages}
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
          <button
            className="story-btn story-btn-primary"
            onClick={() => navigate(`/quiz/intro?storyId=${story.id}`)}
          >
            퀴즈 풀기 →
          </button>
        </div>
      </div>
    </div>
  );
}