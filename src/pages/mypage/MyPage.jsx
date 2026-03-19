import "./MyPage.css";

const userProfile = {
    name: "채린",
    age: 8,
    level: "Lv. 1 중급",
    avatar: "🧸",
};

const pendingQuizzes = [
    { id: 1, title: "빨간 모자", progress: "읽기 완료 · 퀴즈 미완료" },
    { id: 2, title: "헨젤과 그레텔", progress: "읽는 중 · 퀴즈 대기" },
    { id: 3, title: "아기 돼지 삼형제", progress: "추천 퀴즈" },
];

const completedQuizzes = [
    { id: 1, title: "백설공주", score: "90점" },
    { id: 2, title: "신데렐라", score: "100점" },
    { id: 3, title: "토끼와 거북이", score: "85점" },
];

const readBooks = [
    { id: 1, title: "백설공주", genre: "공주 / 판타지" },
    { id: 2, title: "토끼와 거북이", genre: "우화" },
    { id: 3, title: "피노키오", genre: "모험" },
    { id: 4, title: "엄지공주", genre: "판타지" },
];

const likedBooks = [
    { id: 1, title: "인어공주", tag: "좋아요 ❤️" },
    { id: 2, title: "잠자는 숲속의 공주", tag: "좋아요 ❤️" },
    { id: 3, title: "브레멘 음악대", tag: "좋아요 ❤️" },
];

export default function MyPage() {
    return (
        <div className="mypage">
            {/* 배경 장식 */}
            <div className="sky-deco sun" />
            <div className="sky-deco cloud cloud-1" />
            <div className="sky-deco cloud cloud-2" />
            <div className="sky-deco cloud cloud-3" />
            <div className="sky-deco star star-1" />
            <div className="sky-deco star star-2" />
            <div className="sky-deco star star-3" />

            <div className="mypage-container">
                <header className="mypage-header">
                    <h1>🌷 마이페이지</h1>
                    <p>나의 독서 기록과 퀴즈 현황을 한눈에 확인해요</p>
                </header>

                {/* 프로필 카드 */}
                <section className="profile-card">
                    <div className="profile-left">
                        <div className="profile-image emoji-avatar">
                            🧸
                        </div>
                        <div className="profile-info">
                            <h2>{userProfile.name}</h2>
                            <p>나이: {userProfile.age}세</p>
                            <span className="level-badge">{userProfile.level}</span>
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="summary-box">
                            <strong>{readBooks.length}</strong>
                            <span>읽은 책</span>
                        </div>
                        <div className="summary-box">
                            <strong>{completedQuizzes.length}</strong>
                            <span>완료한 퀴즈</span>
                        </div>
                        <div className="summary-box">
                            <strong>{likedBooks.length}</strong>
                            <span>좋아요</span>
                        </div>
                    </div>
                </section>

                {/* 콘텐츠 영역 */}
                <main className="mypage-content">
                    <section className="mypage-section">
                        <div className="section-title-row">
                            <h3>📝 내가 풀어야 할 퀴즈</h3>
                            <span>{pendingQuizzes.length}개</span>
                        </div>

                        <div className="item-list">
                            {pendingQuizzes.map((quiz) => (
                                <article key={quiz.id} className="item-card soft-yellow">
                                    <div>
                                        <h4>{quiz.title}</h4>
                                        <p>{quiz.progress}</p>
                                    </div>
                                    <button className="mini-btn">풀러가기</button>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mypage-section">
                        <div className="section-title-row">
                            <h3>✅ 풀었던 퀴즈</h3>
                            <span>{completedQuizzes.length}개</span>
                        </div>

                        <div className="item-list">
                            {completedQuizzes.map((quiz) => (
                                <article key={quiz.id} className="item-card soft-green">
                                    <div>
                                        <h4>{quiz.title}</h4>
                                        <p>점수: {quiz.score}</p>
                                    </div>
                                    <button className="mini-btn">다시보기</button>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mypage-section">
                        <div className="section-title-row">
                            <h3>📚 읽었던 책</h3>
                            <span>{readBooks.length}권</span>
                        </div>

                        <div className="book-grid">
                            {readBooks.map((book) => (
                                <article key={book.id} className="book-card">
                                    <div className="book-thumb">📖</div>
                                    <h4>{book.title}</h4>
                                    <p>{book.genre}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mypage-section">
                        <div className="section-title-row">
                            <h3>💗 좋아요 눌러놓은 책</h3>
                            <span>{likedBooks.length}권</span>
                        </div>

                        <div className="book-grid">
                            {likedBooks.map((book) => (
                                <article key={book.id} className="book-card liked">
                                    <div className="book-thumb">📖</div>
                                    <h4>{book.title}</h4>
                                    <p>{book.tag}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}