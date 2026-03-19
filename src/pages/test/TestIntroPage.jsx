import { useNavigate } from "react-router-dom";
import "./TestIntroPage.css";

export default function TestIntroPage() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/test/start");
  };

  return (
    <div className="test-intro-page">
      <div className="test-bg-sun"></div>
      <div className="test-bg-cloud cloud1"></div>
      <div className="test-bg-cloud cloud2"></div>
      <div className="test-bg-cloud cloud3"></div>
      <div className="test-bg-hill hill1"></div>
      <div className="test-bg-hill hill2"></div>

      <div className="test-intro-card">
        <div className="test-intro-badge">Reading Level Test</div>

        <h1 className="test-intro-title">
          독해력 난이도 테스트를
          <br />
          시작해볼까요?
        </h1>

        <p className="test-intro-desc">
          처음 이용하는 사용자를 위해 간단한 독해력 난이도 테스트를 준비했어요.
          <br />
          이 테스트 결과를 바탕으로 앞으로 책을 읽은 뒤 풀게 될 퀴즈의 난이도를
          더 알맞게 조절할 수 있어요.
        </p>

        <div className="test-intro-info-box">
          <div className="test-intro-info-item">
            <span className="label">소요 시간</span>
            <span className="value">약 10분</span>
          </div>
          <div className="test-intro-info-item">
            <span className="label">진행 방식</span>
            <span className="value">짧은 글 + 문제 풀이</span>
          </div>
          <div className="test-intro-info-item">
            <span className="label">테스트 목적</span>
            <span className="value">맞춤형 퀴즈 난이도 설정</span>
          </div>
        </div>

        <div className="test-intro-notice">
          <p>• 너무 어렵게 생각하지 않아도 괜찮아요.</p>
          <p>• 현재 독해 수준을 확인하기 위한 간단한 테스트예요.</p>
          <p>• 결과는 이후 퀴즈 난이도 조정에 반영돼요.</p>
        </div>

        <div className="test-intro-button-group">
          <button
            className="test-intro-later-btn"
            onClick={() => navigate("/home")}
          >
            나중에 할래요
          </button>
          <button className="test-intro-start-btn" onClick={handleStartTest}>
            테스트 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}