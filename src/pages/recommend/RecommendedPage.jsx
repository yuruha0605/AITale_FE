import { useNavigate } from "react-router-dom";
import "./RecommendedPage.css";

export default function RecommendedPage() {
    const navigate = useNavigate();

    const displayBooks = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        isPlaceholder: true,
    }));

    return (
        <div className="recommend-page">
            {/* 배경 */}
            <div className="sky-deco sun" />
            <div className="sky-deco cloud cloud-1" />
            <div className="sky-deco cloud cloud-2" />
            <div className="sky-deco cloud cloud-3" />

            <header className="recommend-header">
                <h1 className="recommend-title">📖 AI 추천 동화</h1>
            </header>

            <main className="recommend-content">
                <section className="book-grid">
                    {displayBooks.map((book) => (
                        <article className="book-card" key={book.id}>
                            <div className="book-image">
                                <span className="book-emoji">📚</span>
                            </div>

                            <div className="book-info">
                                <h3 className="book-title">추천 동화 제목</h3>

                                <p className="book-desc">
                                    사용자 맞춤 추천 설명이 이 영역에 표시됩니다.
                                </p>

                                <div className="book-meta">
                                    <span className="meta-pill">난이도</span>
                                    <span className="meta-text">추천 예정</span>
                                </div>

                                <button
                                    className="read-button"
                                    onClick={() => navigate(`/fairytale/${book.id}`)}
                                >
                                    읽기
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            {/* 하단 배경 */}
            <div className="hill" />

            {/* 꽃 */}
            <div className="flower flower-left-1">
                <div className="flower-head" />
                <div className="flower-stem" />
            </div>

            <div className="flower flower-left-2">
                <div className="flower-head small" />
                <div className="flower-stem" />
            </div>
        </div>
    );
}