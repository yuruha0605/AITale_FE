import "./MyPage.css";

export default function MyPage() {
    const user = {
        userId: "chaelyn",
        age: 9,
        tier: "중급"
    };
    const level = 1;
    const progress = 60;

    const pendingQuiz = [
        { id: 1, title: "빨간 모자", desc: "읽기 완료 · 퀴즈 미완료" },
        { id: 2, title: "헨젤과 그레텔", desc: "읽는 중 · 퀴즈 대기" },
        { id: 3, title: "아기 돼지 삼형제", desc: "추천 퀴즈" },
    ];

    const completedQuiz = [
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
        { id: 1, title: "미운 오리 새끼", genre: "성장" },
        { id: 2, title: "흥부와 놀부", genre: "전래" },
        { id: 3, title: "해님 달님", genre: "전래" },
    ];

    return (
        <div className="mypage-page">
            <div className="mypage-container">
                <header className="mypage-header">
                    <p className="mypage-header-badge">🌷 마이페이지</p>
                    <h1>나의 독서 기록과 퀴즈 현황을 한눈에 확인해요</h1>
                </header>

                <section className="mypage-summary-card">
                    <div className="mypage-profile">
                        <div className="mypage-avatar">🧸</div>
                        <div className="mypage-profile-text">
                            <div className="name-row">
                                <h2 className="profile-name">{user.userId}</h2>
                                <span className="profile-age">{user.age}세</span>
                            </div>

                            <div className="mypage-level-box">
                                <div className="level-top">
                                    <span className="level-text">Lv. {level} 중급</span>
                                    <span className="level-percent">{progress}%</span>
                                </div>

                                <div className="level-bar">
                                    <div
                                        className="level-bar-fill"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mypage-stats">
                        <div className="stat-box">
                            <strong>4</strong>
                            <span>읽은 책</span>
                        </div>
                        <div className="stat-box">
                            <strong>3</strong>
                            <span>완료한 퀴즈</span>
                        </div>
                        <div className="stat-box">
                            <strong>3</strong>
                            <span>좋아요</span>
                        </div>
                    </div>
                </section>

                <section className="mypage-dashboard">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>📝 풀어야 할 퀴즈</h3>
                        </div>
                        <div className="compact-list">
                            {pendingQuiz.map((quiz) => (
                                <div className="compact-item warm" key={quiz.id}>
                                    <div>
                                        <strong>{quiz.title}</strong>
                                        <p>{quiz.desc}</p>
                                    </div>
                                    <button>풀러가기</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>✅ 풀었던 퀴즈</h3>
                        </div>
                        <div className="compact-list">
                            {completedQuiz.map((quiz) => (
                                <div className="compact-item green" key={quiz.id}>
                                    <div>
                                        <strong>{quiz.title}</strong>
                                        <p>점수: {quiz.score}</p>
                                    </div>
                                    <button>다시보기</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>📚 읽었던 책</h3>
                        </div>
                        <div className="mini-grid">
                            {readBooks.map((book) => (
                                <div className="mini-book-card" key={book.id}>
                                    <div className="book-icon">📖</div>
                                    <div>
                                        <strong>{book.title}</strong>
                                        <p>{book.genre}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>💗 좋아요 누른 책</h3>
                        </div>
                        <div className="mini-grid">
                            {likedBooks.map((book) => (
                                <div className="mini-book-card pink" key={book.id}>
                                    <div className="book-icon">💝</div>
                                    <div>
                                        <strong>{book.title}</strong>
                                        <p>{book.genre}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}