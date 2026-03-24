import { useEffect, useMemo, useState } from "react";
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
import { get } from "../../services/httpClient";
import "./MyReport.css";

export default function MyReport() {
  const navigate = useNavigate();

  const user = useMemo(
    () => ({
      userId: 1,
      name: "chaelyn",
      age: 9,
      tier: "중급",
    }),
    []
  );

  const level = 1;
  const progress = 60;

  const [chartData, setChartData] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError("");

        const today = new Date();
        const from = new Date();
        from.setDate(today.getDate() - 6);

        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const fromDate = formatDate(from);
        const toDate = formatDate(today);

        const [dailyScoresRes, accuracyRes] = await Promise.all([
          get(
            `/api/v1/analytics/users/${user.userId}/daily-scores?from=${fromDate}&to=${toDate}`
          ),
          get(`/api/v1/analytics/users/${user.userId}/accuracy`),
        ]);

        const dailyScores = dailyScoresRes?.data?.data?.dailyScores ?? [];
        const accuracyData = accuracyRes?.data?.data ?? null;

        setChartData(
          dailyScores.map((item) => ({
            date: item.statDate,
            score: item.totalScoreSum ?? 0,
            quizCount: item.quizCount ?? 0,
            correctCount: item.correctCount ?? 0,
            wrongCount: item.wrongCount ?? 0,
            avgScore: item.avgScore ?? 0,
          }))
        );

        setAccuracy(accuracyData);
      } catch (err) {
        if (err.status === 401) {
          setError("로그인이 필요해요.");
          return;
        }

        if (err.status === 403) {
          setError("이 데이터에 접근할 권한이 없어요.");
          return;
        }

        setError(
          err?.data?.message || err.message || "데이터를 불러오는 중 오류가 발생했어요."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user.userId]);

  const bestScore = Math.max(...chartData.map((d) => d.score), 0);
  const totalDays = chartData.length;
  const latest = chartData[chartData.length - 1]?.score || 0;
  const accuracyPercent = accuracy
    ? ((accuracy.accuracy ?? 0) * 100).toFixed(1)
    : "0.0";

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
                <h2 className="profile-name">{user.name}</h2>
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

        <section className="mypage-report-section">
          <div className="report-section-header">
            <div>
              <h2>📈 나의 독해력 성장 그래프</h2>
              <p className="section-desc">
                퀴즈 기록을 바탕으로 얼마나 성장하고 있는지 확인해보세요.
              </p>
            </div>
          </div>

          {accuracy && (
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
                <span className="report-summary-icon">🎯</span>
                <div className="report-summary-text">
                  <p>정확도</p>
                  <strong>{accuracyPercent}%</strong>
                </div>
              </div>
            </div>
          )}

          <div className="report-chart-box">
            {loading ? (
              <div className="mypage-report-empty">불러오는 중이에요...</div>
            ) : error ? (
              <div className="mypage-report-empty">{error}</div>
            ) : chartData.length > 0 ? (
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
                  <Tooltip
                    formatter={(value) => [`${value}점`, "점수"]}
                    labelFormatter={(label) => {
                      const d = new Date(label);
                      return `${d.getMonth() + 1}월 ${d.getDate()}일`;
                    }}
                  />
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

          {!loading && !error && chartData.length > 0 && (
            <p className="mypage-report-message">
              📊 오늘도 한 걸음 성장했어요!
              {latest >= 100
                ? " 🔥 오늘 정말 잘했어요!"
                : latest >= 50
                ? " 👍 조금만 더 하면 최고예요!"
                : " 💪 다시 도전해볼까요?"}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}