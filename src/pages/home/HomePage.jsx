import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="stars"></div>
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>

      <div className="sun"></div>

      
      <div className="hill"></div>

      <div className="flower flower1"></div>
      <div className="flower flower2"></div>
      <div className="flower flower3"></div>
      <div className="flower flower4"></div>

      <div className="home-overlay">
        <div className="welcome-card">
          <span className="badge">Fairy Start</span>
          <h1>환영합니다</h1>
          <p>
            오늘도 포근하고 반짝이는 하루를
            <br />
            함께 시작해볼까요?
          </p>

          <button
            className="start-button"
            onClick={() => navigate("/login")}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}