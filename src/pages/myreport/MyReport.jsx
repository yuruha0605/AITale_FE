import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./MyReport.css";

export default function MyReport() {
  const navigate = useNavigate();

  const user = {
    userId: "chaelyn",
    age: 9,
    tier: "중급",
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

  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

  const chartData = useMemo(() => {
    const grouped = {};

    history.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = 0;
      grouped[item.date] += item.score;
    });

    return Object.keys(grouped).map((date) => ({
      date,
      score: grouped[date],
    }));
  }, [history]);

  const bestScore = Math.max(...chartData.map((d) => d.score), 0);
  const totalDays = chartData.length;
  const latest = chartData[chartData.length - 1]?.score || 0;

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
                  <span className="level-text">
                    Lv. {level} {user.tier}
                  </span>
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
              <strong>{readBooks.length}</strong>
              <span>읽은 책</span>
            </div>
            <div className="stat-box">
              <strong>{completedQuiz.length}</strong>
              <span>완료한 퀴즈</span>
            </div>
            <div className="stat-box">
              <strong>{likedBooks.length}</strong>
              <span>좋아요</span>
            </div>
          </div>
        </section>

        {/* 학습 리포트 */}
        <section className="mypage-report-section">
          <div className="report-section-header">
            <div>
              <p className="section-eyebrow"></p>
              <h2>📈 나의 독해력 성장 그래프</h2>
              <p className="section-desc">
                퀴즈 기록을 바탕으로 얼마나 성장하고 있는지 확인해보세요.
              </p>
            </div>
          </div>

          <div className="report-summary-row">
            <div className="report-summary-box">
              <span className="report-summary-icon">📅</span>
              <div className="report-summary-text">
                <p>학습일</p>
                <strong>{totalDays}</strong>
              </div>
            </div>

            <div className="report-summary-box">
              <span className="report-summary-icon">🏆</span>
              <div className="report-summary-text">
                <p>최고 점수</p>
                <strong>{bestScore}</strong>
              </div>
            </div>

            <div className="report-summary-box">
              <span className="report-summary-icon">🔥</span>
              <div className="report-summary-text">
                <p>최근 점수</p>
                <strong>{latest}</strong>
              </div>
            </div>
          </div>

          <div className="report-chart-box">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    barSize={36}
                    radius={[10, 10, 0, 0]}
                    fill="#7ec8ff"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="mypage-report-empty">
                아직 학습 데이터가 없어요 😢
              </div>
            )}
          </div>

          {chartData.length > 0 && (
            <p className="mypage-report-message">
              📊 오늘도 한 걸음 성장했어요!
              {latest >= 4
                ? " 🔥 오늘 정말 잘했어요!"
                : latest >= 2
                ? " 👍 조금만 더 하면 최고예요!"
                : " 💪 다시 도전해볼까요?"}
            </p>
          )}
        </section>

        {/* 퀴즈 묶음 */}
        <section className="content-group-section">
          <div className="group-header">
            <h2>📝 퀴즈 모아보기</h2>
            <p>진행 중인 퀴즈와 완료한 퀴즈를 확인해요</p>
          </div>

          <div className="group-grid">
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
                    <button onClick={() => navigate("/story")}>다시보기</button>
                  </div>
                ))}
              </div>
            </div>

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
                    <button onClick={() => navigate("/story")}>풀러가기</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 책 묶음 */}
        <section className="content-group-section">
          <div className="group-header">
            <h2>📚 책 모아보기</h2>
            <p>읽었던 책과 좋아요 누른 책을 확인해요</p>
          </div>

          <div className="group-grid">
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
          </div>
        </section>
      </div>
    </div>
  );
}