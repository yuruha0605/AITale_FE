import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../services/httpClient";
import "./RecommendedPage.css";

function normalizeStoryListPayload(responseData) {
  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData)) {
    return responseData;
  }

  return [];
}

export default function RecommendedPage() {
  const navigate = useNavigate();

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [likedBookIds, setLikedBookIds] = useState([]);
  const [activeMenu, setActiveMenu] = useState("recommended");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        if (activeMenu === "recommended") {
          if (!storedUserId) {
            throw new Error("사용자 정보가 없어요. 다시 로그인해 주세요.");
          }

          const response = await get(
            `/api/v1/recommendations/users/${storedUserId}?size=3&refresh=false`
          );

          const recommendationData = response?.data?.data?.recommendations ?? [];

          const mappedBooks = recommendationData.map((item) => ({
            id: item.storyId,
            title: item.title,
            description: item.reason,
            level: item.basedDifficulty ?? `레벨 ${item.basedLevel ?? "-"}`,
            coverImage: item.aiImageUrl ?? item.imageUrl ?? null,
            coverFallback: "📖",
            recommended: true,
          }));

          setRecommendedBooks(mappedBooks);
        }

        if (activeMenu === "all") {
          const response = await get("/story");
          const storyData = normalizeStoryListPayload(response?.data);

          const mappedBooks = storyData.map((item) => ({
            id: item.storyId,
            title: item.title,
            description: item.content ?? "동화 설명이 없습니다.",
            level: item.charCount ?? item.length ?? 0,
            coverImage: item.aiImageUrl ?? item.imageUrl ?? null,
            coverFallback: "📖",
            recommended: false,
          }));

          setAllBooks(mappedBooks);
        }
      } catch (err) {
        console.error(err);

        if (err.status === 401) {
          setError("로그인이 필요해요.");
          return;
        }

        if (err.status === 403) {
          setError("이 데이터에 접근할 권한이 없어요.");
          return;
        }

        setError(
          err?.data?.message || err.message || "책 목록을 불러오지 못했어요."
        );
      } finally {
        setLoading(false);
      }
      
    }

    fetchBooks();
  }, [activeMenu, storedUserId]);
  

  const handleToggleLike = (id) => {
    setLikedBookIds((prev) =>
      prev.includes(id)
        ? prev.filter((bookId) => bookId !== id)
        : [...prev, id]
    );
  };

  const handleReadBook = (book) => {
    navigate(`/story/${book.id}`);
  };

  const mergedBooks = useMemo(() => {
    const merged = [...recommendedBooks, ...allBooks];

    return merged.filter(
      (book, index, arr) => arr.findIndex((item) => item.id === book.id) === index
    );
  }, [recommendedBooks, allBooks]);

  const currentBooks = useMemo(() => {
    switch (activeMenu) {
      case "recommended":
        return recommendedBooks;
      case "all":
        return allBooks;
      case "likes":
        return mergedBooks.filter((book) => likedBookIds.includes(book.id));
      default:
        return [];
    }
  }, [activeMenu, recommendedBooks, allBooks, mergedBooks, likedBookIds]);

  const searchedBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return currentBooks;
    }

    return currentBooks.filter((book) =>
      String(book.title).toLowerCase().includes(keyword)
    );
  }, [currentBooks, search]);

  const pageInfo = useMemo(() => {
    switch (activeMenu) {
      case "recommended":
        return {
          title: "AI 추천 동화",
          subtitle: "아이의 나이, 관심사, 독해 레벨을 바탕으로 추천한 동화예요.",
        };
      case "all":
        return {
          title: "모든 책",
          subtitle: "등록된 전체 동화 목록이에요.",
        };
      case "likes":
        return {
          title: "좋아요 누른 책",
          subtitle: "좋아요를 눌러 저장해 둔 동화를 다시 볼 수 있어요.",
        };
      default:
        return {
          title: "",
          subtitle: "",
        };
    }
  }, [activeMenu]);

  return (
    <div className="books-page">
      <aside className="books-sidebar">
        <div className="books-logo">
          <p>Menu</p>
        </div>

        <nav className="books-nav">
          <button
            className={`books-nav-item ${activeMenu === "recommended" ? "active" : ""}`}
            onClick={() => setActiveMenu("recommended")}
          >
            <span>✨</span>
            AI 추천
          </button>

          <button
            className={`books-nav-item ${activeMenu === "all" ? "active" : ""}`}
            onClick={() => setActiveMenu("all")}
          >
            <span>📚</span>
            모든 책
          </button>

          <button
            className={`books-nav-item ${activeMenu === "likes" ? "active" : ""}`}
            onClick={() => setActiveMenu("likes")}
          >
            <span>❤️</span>
            좋아요 누른 책
          </button>

          <button className="books-nav-item" onClick={() => navigate("/myreport")}>
            <span>👤</span>
            마이페이지
          </button>
        </nav>
      </aside>

      <main className="books-main">
        <header className="books-topbar">
          <div className="books-search">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              placeholder="동화 제목을 검색해보세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="books-content">
          <div className="books-header-row">
            <h2>{pageInfo.title}</h2>
            <p>{pageInfo.subtitle}</p>
          </div>

          {loading ? (
            <div className="empty-state">책 목록을 불러오는 중이에요.</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : (
            <div className="books-grid">
              {searchedBooks.length > 0 ? (
                searchedBooks.map((book) => (
                  <article className="book-list-card" key={book.id}>
                    <div className="book-cover-box">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`${book.title} 표지`}
                          className="book-cover-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".book-cover-emoji"
                              );
                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="book-cover-emoji"
                        style={{ display: book.coverImage ? "none" : "flex" }}
                      >
                        {book.coverFallback}
                      </div>
                    </div>

                    <div className="book-list-body">
                      <div className="book-list-top">
                        <div className="book-title-row">
                          <h3>{book.title}</h3>
                          <span
                            className={`level-chip ${String(book.level).replace(/\s/g, "")}`}
                          >
                            {book.level}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`book-like-btn ${
                            likedBookIds.includes(book.id) ? "active" : ""
                          }`}
                          onClick={() => handleToggleLike(book.id)}
                          aria-label="좋아요"
                        >
                          {likedBookIds.includes(book.id) ? "❤️" : "🤍"}
                        </button>
                      </div>

                      <p className="book-description">{book.description}</p>

                      <div className="book-action-row">
                        <button
                          type="button"
                          className="read-more-btn"
                          onClick={() => handleReadBook(book)}
                        >
                          읽으러 가기
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">조건에 맞는 동화가 없어요.</div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}