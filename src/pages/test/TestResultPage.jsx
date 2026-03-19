import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./TestPage.css";
import "./TestResultPage.css";

export default function TestResultPage() {
  const navigate = useNavigate();

  const resultData = JSON.parse(sessionStorage.getItem("readingTestResult")) || {
    totalScore: 0,
    answers: [],
  };

  const result = useMemo(() => {
    const score = resultData.totalScore;

    if (score <= 5) {
      return {
        level: "쉬움",
        title: "천천히 읽으며 핵심을 찾는 단계예요",
        desc: "짧고 명확한 문장의 이야기부터 시작하면 좋아요. 이후 점점 문장 길이와 추론이 필요한 문제로 확장해 나가면 돼요.",
      };
    }

    if (score <= 12) {
      return {
        level: "보통",
        title: "기본 이해력과 핵심 파악 능력이 잘 잡혀 있어요",
        desc: "중간 길이의 지문과 간단한 추론 문제가 잘 맞는 단계예요. 다양한 주제의 글을 읽으며 독해 폭을 넓혀보세요.",
      };
    }

    return {
      level: "어려움",
      title: "깊이 있는 독해와 추론이 가능한 단계예요",
      desc: "조금 더 긴 글과 의미 해석, 중심 생각 파악이 필요한 문제도 충분히 도전할 수 있어요.",
    };
  }, [resultData.totalScore]);

  useEffect(() => {
    const score = resultData.totalScore;

    if (score <= 5) {
      localStorage.setItem("difficulty", "하");
      return;
    }

    if (score <= 12) {
      localStorage.setItem("difficulty", "중");
      return;
    }

    localStorage.setItem("difficulty", "상");
  }, [resultData.totalScore]);

  return (
    <div className="test-page">
      <div className="test-bg-sun"></div>
      <div className="test-bg-cloud cloud1"></div>
      <div className="test-bg-cloud cloud2"></div>
      <div className="test-bg-cloud cloud3"></div>
      <div className="test-bg-hill hill1"></div>
      <div className="test-bg-hill hill2"></div>

      <div className="test-card" style={{ maxWidth: "760px", textAlign: "center" }}>
        <div className="test-page-badge">Reading Level Result</div>

        <h1
          style={{
            marginTop: "22px",
            fontSize: "34px",
            lineHeight: "1.4",
            color: "#20323d",
          }}
        >
          독해력 난이도 결과는
          <br />
          <span style={{ color: "#5caef0" }}>{result.level}</span> 단계예요
        </h1>

        <div className="test-passage-box" style={{ marginTop: "28px", textAlign: "left" }}>
          <h2 className="test-section-title">{result.title}</h2>
          <p className="test-passage">{result.desc}</p>

          <div style={{ marginTop: "18px", fontWeight: "800", color: "#4d6471" }}>
            총 점수: {resultData.totalScore}점
          </div>
        </div>

        <div
          className="test-feedback-box"
          style={{ marginTop: "22px", textAlign: "left" }}
        >
          <div className="test-feedback-title">활용 안내</div>
          <p className="test-feedback-text">
            이 결과는 이후 책을 읽고 퀴즈를 풀 때 문제 난이도를 조절하는 데
            사용돼요. 나중에 다시 테스트를 통해 난이도를 조정할 수도 있어요.
          </p>
        </div>

        <div
          style={{
            marginTop: "28px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="test-next-btn"
            onClick={() => navigate("/recommended")}
          >
            추천 동화 보러가기
          </button>

          <button className="test-next-btn" onClick={() => navigate("/home")}>
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}