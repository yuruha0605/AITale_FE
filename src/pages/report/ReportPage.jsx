import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./ReportPage.css";

export default function ReportPage() {
  const navigate = useNavigate();

  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

  // ✅ 날짜별 점수 합산
  const chartData = useMemo(() => {
    const grouped = {};

    history.forEach((item) => {
      if (!grouped[item.date]) {
        grouped[item.date] = 0;
      }
      grouped[item.date] += item.score;
    });

    return Object.keys(grouped).map((date) => ({
      date,
      score: grouped[date],
    }));
  }, [history]);

  // ✅ 요약 데이터
  const bestScore = Math.max(...chartData.map((d) => d.score), 0);
  const totalDays = chartData.length;
  const latest = chartData[chartData.length - 1]?.score || 0;

  return (
    <div className="adventure-page report-page">
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        <h1 className="adventure-title">📈 독해력 성장 그래프</h1>
        <p className="adventure-subtitle">
          매일 조금씩 성장하고 있어요 🚀
        </p>

        {/* ✅ 요약 카드 */}
        <div className="report-summary">
          <div className="summary-card">
            <div className="summary-icon">📅</div>
            <div className="summary-value">{totalDays}</div>
            <div className="summary-label">학습일</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🏆</div>
            <div className="summary-value">{bestScore}</div>
            <div className="summary-label">최고 점수</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🔥</div>
            <div className="summary-value">{latest}</div>
            <div className="summary-label">최근 점수</div>
          </div>
        </div>

        {/* ✅ 그래프 */}
        <div className="report-chart">
          <BarChart width={320} height={220} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"
                   tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="score"
              barSize={32}              // ✅ 얇게
              radius={[8, 8, 0, 0]}     // 둥글게
              fill="#7ec8ff"
              label={{ position: "top", fontSize: 12 }}
              isAnimationActive={true}
              animationDuration={800} />
          </BarChart>
        </div>

        {/* 데이터 없을 때 */}
        {chartData.length === 0 && (
          <p className="report-empty">아직 학습 데이터가 없어요 😢</p>
        )}

        {/* 동기부여 메시지 */}
        {chartData.length > 0 && (
          <p className="report-message">
            📊 오늘도 한 걸음 성장했어요!
            {latest >= 4
              ? "🔥 오늘 정말 잘했어요!"
              : latest >= 2
              ? "👍 조금만 더 하면 최고예요!"
              : "💪 다시 도전해볼까요?"}
          </p>
        )}

        <div className="adventure-button-row">
          <button
            className="adventure-button secondary"
            onClick={() => navigate("/main")}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}