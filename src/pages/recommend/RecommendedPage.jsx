import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecommendedPage.css";

const initialBooks = [
    {
        id: 1,
        title: "별을 따라간 토끼",
        description: "호기심 많은 토끼가 반짝이는 별빛을 따라 숲속 모험을 떠나는 이야기예요.",
        level: "쉬움",
        liked: false,
    },
    {
        id: 2,
        title: "구름 빵집의 비밀",
        description: "하늘을 나는 빵을 만드는 구름 빵집에서 벌어지는 따뜻한 하루를 담았어요.",
        level: "보통",
        liked: false,
    },
    {
        id: 3,
        title: "바다 마을의 작은 인어",
        description: "용기와 우정을 배우는 작은 인어의 반짝이는 바다 이야기예요.",
        level: "쉬움",
        liked: false,
    },
    {
        id: 4,
        title: "달님 우체통",
        description: "소원을 적은 편지가 달님에게 닿으며 펼쳐지는 포근한 동화예요.",
        level: "보통",
        liked: false,
    },
    {
        id: 5,
        title: "숲속 음악회",
        description: "동물 친구들이 함께 준비한 특별한 음악회 속에서 협동심을 배워요.",
        level: "쉬움",
        liked: false,
    },
    {
        id: 6,
        title: "마법 연필의 하루",
        description: "그림이 현실이 되는 신비한 연필과 함께 상상력이 펼쳐지는 이야기예요.",
        level: "조금 어려움",
        liked: false,
    },
];

export default function RecommendedPage() {
    const navigate = useNavigate();
    const [books, setBooks] = useState(initialBooks);

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

    return (
        <div className="recommend-page">
            {/* 배경 장식 */}
            <div className="recommend-sun" />
            <div className="recommend-cloud cloud-1" />
            <div className="recommend-cloud cloud-2" />
            <div className="recommend-cloud cloud-3" />

            <div className="recommend-container">
                <section className="recommend-hero">
                    <span className="recommend-badge">AI 맞춤 추천</span>
                    <h1 className="recommend-title">오늘의 추천 동화</h1>
                    <p className="recommend-subtitle">
                        나이, 독해 레벨, 관심사를 바탕으로 아이에게 어울리는 동화를 추천해요.
                    </p>
                </section>

                <section className="recommend-list-section">
                    <div className="recommend-section-header">
                        <h2>추천 동화 목록</h2>
                        <p>마음에 드는 동화는 좋아요를 눌러 나중에 다시 볼 수 있어요.</p>
                    </div>

                    <div className="recommend-grid">
                        {books.map((book) => (
                            <article className="recommend-card" key={book.id}>
                                <div className="recommend-card-thumb">
                                    <div className="thumb-icon">📚</div>
                                </div>

                                <div className="recommend-card-body">
                                    <div className="recommend-card-top">
                                        <h3>{book.title}</h3>
                                        <button
                                            type="button"
                                            className={`like-button ${book.liked ? "active" : ""}`}
                                            onClick={() => handleToggleLike(book.id)}
                                            aria-label="좋아요"
                                        >
                                            {book.liked ? "❤️" : "🤍"}
                                        </button>
                                    </div>

                                    <p className="recommend-desc">{book.description}</p>

                                    <div className="recommend-meta">
                                        <span className={`level-badge ${book.level.replace(/\s/g, "")}`}>
                                            난이도 {book.level}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="read-button"
                                        onClick={() => handleReadBook(book)}
                                    >
                                        읽기
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}