import { useEffect, useMemo, useRef, useState } from "react";
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
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const requestedImageRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const normalizeStory = (data, storyId) => ({
    id: data.storyId ?? Number(storyId),
    title: data.title ?? "제목 없음",
    genre: data.genreName ?? data.genre ?? "미분류",
    length: data.charCount ?? data.length ?? 0,
    content: data.content ?? "동화 내용이 없습니다.",
    image: data.aiImageUrl ?? data.imageUrl ?? "",
  });

  const fetchStoryDetailById = async (storyId) => {
    const response = await fetch(buildApiUrl(`/story/${storyId}`), {
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
    return normalizeStory(data, storyId);
  };

  const generateStoryImage = async (storyId) => {
    try {
      setImageLoading(true);
      setImageError(false);

      const response = await fetch(buildApiUrl(`/story/${storyId}/ai-image`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          style: "fairy-tale",
        }),
      });

      if (!response.ok) {
        throw new Error(`이미지 생성 실패: ${response.status}`);
      }

      const result = await response.json();
      const data = result?.data ?? result;
      const generatedImageUrl = data?.imageUrl ?? "";

      if (generatedImageUrl && mountedRef.current) {
        setImageError(false);
        setStory((prev) =>
          prev
            ? {
                ...prev,
                image: generatedImageUrl,
              }
            : prev
        );
        return;
      }

      const refreshedStory = await fetchStoryDetailById(storyId);
      if (!mountedRef.current) {
        return;
      }

      if (refreshedStory.image) {
        setImageError(false);
        setStory(refreshedStory);
      } else {
        setImageError(true);
      }
    } catch (err) {
      console.error(err);
      if (mountedRef.current) {
        setImageError(true);
      }
    } finally {
      if (mountedRef.current) {
        setImageLoading(false);
      }
    }
  };

  useEffect(() => {
    requestedImageRef.current = false;

    async function loadStory() {
      try {
        setLoading(true);
        setError("");
        setImageError(false);

        const normalizedStory = await fetchStoryDetailById(id);
        if (!mountedRef.current) {
          return;
        }

        setStory(normalizedStory);

        if (!normalizedStory.image && !requestedImageRef.current) {
          requestedImageRef.current = true;
          generateStoryImage(normalizedStory.id);
        }
      } catch (err) {
        console.error(err);
        if (mountedRef.current) {
          setError("동화를 불러오지 못했어요.");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadStory();
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
  const hasImage = Boolean(story?.image) && !imageError;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleGenerateImageClick = () => {
    if (story?.id && !imageLoading) {
      requestedImageRef.current = true;
      generateStoryImage(story.id);
    }
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
                {hasImage ? (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="story-image"
                    onLoad={() => setImageError(false)}
                    onError={() => {
                      console.error("이미지 로드 실패:", story.image);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="story-image-placeholder">
                    {imageLoading ? (
                      <div className="story-image-loading-text">
                        <span>AI 이미지가 생성되는 중이에요.</span>
                        <small>잠시만 기다려 주세요.</small>
                      </div>
                    ) : imageError ? (
                      <div className="story-image-loading-text">
                        <span>이미지를 불러오지 못했어요.</span>
                        <small>잠시 후 다시 시도해 주세요.</small>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="story-generate-image-btn"
                        onClick={handleGenerateImageClick}
                      >
                        AI 이미지 생성하기
                      </button>
                    )}
                  </div>
                )}
              </div>

              <p className="story-image-caption">
                {hasImage
                  ? "AI 생성 이미지"
                  : imageLoading
                  ? "이미지 생성 중"
                  : imageError
                  ? "이미지 로드 실패"
                  : "이미지 준비 중"}
              </p>
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