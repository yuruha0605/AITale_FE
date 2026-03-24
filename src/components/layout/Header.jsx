import { useNavigate } from "react-router-dom";
import "./Header.css";


export default function Header() {
  const navigate = useNavigate();

   return (
    <header className="simple-header">
      <div className="simple-header-inner">
        <button
          className="simple-logo"
          type="button"
          onClick={() => navigate("/main")}
          aria-label="메인페이지로 이동" 
        >
          <span className="simple-logo-badge">📖</span>
          <span className="simple-logo-text">
            아이<span className="simple-logo-ai">(AI)</span> 동화
          </span>
        </button>
      </div>
    </header>
  );
}