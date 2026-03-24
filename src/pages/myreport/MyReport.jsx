import { useEffect, useMemo, useState } from "react";
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

function getStoredUser() {
  const storedUserId = localStorage.getItem("userId");
  const storedUserName = localStorage.getItem("userName");
  const storedUserAge = localStorage.getItem("userAge");
  const storedUserTier = localStorage.getItem("userTier");

  return {
    userId: storedUserId ? Number(storedUserId) : null,
    name: storedUserName || "사용자",
    age: storedUserAge ? Number(storedUserAge) : null,
    tier: storedUserTier || "학습자",
  };
}

export default function MyReport() {
  const user = useMemo(() => getStoredUser(), []);

  const [chartData, setChartData] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user.userId) {
        setError("사용자 정보가 없어요. 다시 로그인해 주세요.");
        setLoading(false);
        return;
      }

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

  const totalDays = chartData.length;
  const bestScore = Math.max(...chartData.map((d) => d.score), 0);
  const totalQuizCount = chartData.reduce((sum, item) => sum + item.quizCount, 0);
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
                {user.age && <span className="profile-age">{user.age}세</span>}
              </div>

              <div className="mypage-level-box">
                <div className="level-top">
                  <span className="level-text">{user.tier}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mypage-stats">
            <div className="stat-box">
              <strong>{totalDays}</strong>
              <span>학습일</span>
            </div>
            <div className="stat-box">
              <strong>{totalQuizCount}</strong>
              <span>전체 퀴즈 수</span>
            </div>
            <div className="stat-box">
              <strong>{accuracyPercent}%</strong>
              <span>정확도</span>
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

          {!loading && !error && (
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