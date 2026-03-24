import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../config/api";
import "./RecommendedPage.css";

export default function RecommendedPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeMenu, setActiveMenu] = useState("recommended");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storedUserId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          buildApiUrl(`/api/v1/recommendations/users/${storedUserId}?size=3&refresh=false`),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`추천 조회 실패: ${response.status}`);
        }

        const result = await response.json();
        const recommendationData = result?.data?.recommendations ?? [];

        const mappedBooks = recommendationData.map((item) => ({
          id: item.storyId,
          title: item.title,
          description: item.reason,
          level: item.basedDifficulty ?? `레벨 ${item.basedLevel}`,
          liked: false,
          cover: "📖",
          recommended: true,
        }));

        setBooks(mappedBooks);
      } catch (err) {
        console.error(err);
        setError("추천 동화를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleToggleLike = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, liked: !book.liked } : book
      )
    );
  };

  const handleReadBook = (book) => {
    navigate(`/story/${book.id}`);
  };

  const searchedBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter((book) =>
      book.title.toLowerCase().includes(keyword)
    );
  }, [books, search]);

  const visibleBooks = useMemo(() => {
    switch (activeMenu) {
      case "recommended":
        return searchedBooks.filter((book) => book.recommended);
      case "all":
        return searchedBooks;
      case "likes":
        return searchedBooks.filter((book) => book.liked);
      default:
        return [];
    }
  }, [activeMenu, searchedBooks]);

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
          subtitle: "현재 불러온 추천 동화 목록이에요.",
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

          <button
            className="books-nav-item"
            onClick={() => navigate("/myreport")}
          >
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
            <div className="empty-state">추천 동화를 불러오는 중이에요.</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : (
            <div className="books-grid">
              {visibleBooks.length > 0 ? (
                visibleBooks.map((book) => (
                  <article className="book-list-card" key={book.id}>
                    <div className="book-cover-box">
                      <div className="book-cover-emoji">{book.cover}</div>
                    </div>

                    <div className="book-list-body">
                      <div className="book-list-top">
                        <div className="book-title-row">
                          <h3>{book.title}</h3>
                          <span className={`level-chip ${String(book.level).replace(/\s/g, "")}`}>
                            {book.level}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`book-like-btn ${book.liked ? "active" : ""}`}
                          onClick={() => handleToggleLike(book.id)}
                          aria-label="좋아요"
                        >
                          {book.liked ? "❤️" : "🤍"}
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
                <div className="empty-state">
                  조건에 맞는 동화가 없어요.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}