import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecommendedPage.css";

const initialBooks = [
  {
    id: 1,
    title: "별을 따라간 토끼",
    description: "호기심 많은 토끼가 반짝이는 별빛을 따라 숲속 모험을 떠나는 이야기예요.",
    level: "쉬움",
    liked: false,
    cover: "🐰",
    recommended: true,
  },
  {
    id: 2,
    title: "구름 빵집의 비밀",
    description: "하늘을 나는 빵을 만드는 구름 빵집에서 벌어지는 따뜻한 하루를 담았어요.",
    level: "보통",
    liked: false,
    cover: "☁️",
    recommended: true,
  },
  {
    id: 3,
    title: "바다 마을의 작은 인어",
    description: "용기와 우정을 배우는 작은 인어의 반짝이는 바다 이야기예요.",
    level: "쉬움",
    liked: false,
    cover: "🧜‍♀️",
    recommended: true,
  },
  {
    id: 4,
    title: "달님 우체통",
    description: "소원을 적은 편지가 달님에게 닿으며 펼쳐지는 포근한 동화예요.",
    level: "보통",
    liked: true,
    cover: "🌙",
    recommended: true,
  },
  {
    id: 5,
    title: "숲속 음악회",
    description: "동물 친구들이 함께 준비한 특별한 음악회 속에서 협동심을 배워요.",
    level: "쉬움",
    liked: false,
    cover: "🎵",
    recommended: false,
  },
  {
    id: 6,
    title: "마법 연필의 하루",
    description: "그림이 현실이 되는 신비한 연필과 함께 상상력이 펼쳐지는 이야기예요.",
    level: "조금 어려움",
    liked: true,
    cover: "✏️",
    recommended: false,
  },
  {
    id: 7,
    title: "토끼와 거북이",
    description: "느려도 끝까지 포기하지 않는 마음을 배우는 이야기예요.",
    level: "쉬움",
    liked: false,
    cover: "🐢",
    recommended: false,
  },
  {
    id: 8,
    title: "피노키오의 모험",
    description: "진실과 용기의 소중함을 알려주는 클래식 동화예요.",
    level: "보통",
    liked: false,
    cover: "🤥",
    recommended: false,
  },
];

export default function RecommendedPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(initialBooks);
  const [activeMenu, setActiveMenu] = useState("recommended");
  const [search, setSearch] = useState("");

  const handleToggleLike = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, liked: !book.liked } : book
      )
    );
  };

  const handleReadBook = (book) => {
    if (book.id === 1) {
      navigate(`/story/${book.id}`);
    } else {
      alert("이 동화는 아직 준비 중이에요!");
    }
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
          subtitle: "현재 서비스에서 볼 수 있는 전체 동화 목록이에요.",
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
            <span>🤍</span>
            좋아요 누른 책
          </button>

          <button
            className="books-nav-item"
            onClick={() => navigate("/mypage")}
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
                        <span className={`level-chip ${book.level.replace(/\s/g, "")}`}>
                          {book.level}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`like-btn ${book.liked ? "active" : ""}`}
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
        </section>
      </main>
    </div>
  );
}