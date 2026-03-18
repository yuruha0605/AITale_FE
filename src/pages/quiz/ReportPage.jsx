import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./ReportPage.css";

export default function ReportPage() {
  const navigate = useNavigate();

  // ✅ 데이터 가져오기
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

  return (
    <div className="adventure-page report-page">
      <div className="adventure-bg-cloud cloud-1" />
      <div className="adventure-bg-cloud cloud-2" />
      <div className="adventure-ground" />

      <div className="adventure-card">
        <h1 className="adventure-title">📊 학습 리포트</h1>

        {/* ✅ 그래프 */}
        <div className="report-chart">
          <LineChart width={320} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" />
          </LineChart>
        </div>

        {/* 데이터 없을 때 */}
        {chartData.length === 0 && (
          <p className="report-empty">아직 학습 데이터가 없어요 😢</p>
        )}

        <div className="adventure-button-row">
          <button
            className="adventure-button secondary"
            onClick={() => navigate("/")}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}