import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PageHeader.css";

export default function PageHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMove = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    alert("로그아웃 되었습니다.");
    navigate("/sign");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="page-header">
      <div className="page-header-inner">
        <div className="page-header-left" ref={menuRef}>
          <button
            type="button"
            className="page-header-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
          >
            <span className="page-header-menu-icon">☰</span>
            <span className="page-header-menu-label">메뉴</span>
          </button>

          <div className={`page-header-dropdown ${menuOpen ? "open" : ""}`}>
            <button type="button" onClick={() => handleMove("/main")}>
              홈
            </button>
            <button type="button" onClick={() => handleMove("/recommended")}>
              책 추천
            </button>
            <button type="button" onClick={() => handleMove("/quiz/intro")}>
              퀴즈 풀기
            </button>
            <button type="button" onClick={() => handleMove("/myreport")}>
              마이페이지
            </button>
          </div>
        </div>

        <button
          type="button"
          className="page-header-logo"
          onClick={() => navigate("/main")}
          aria-label="메인페이지로 이동"
        >
          <span className="page-header-logo-badge">📖</span>
          <span className="page-header-logo-text">
            아이<span className="page-header-logo-ai">(AI)</span> 동화
          </span>
        </button>

        <div className="page-header-right">
          <button
            type="button"
            className="page-header-logout-btn"
            onClick={handleLogout}
          >
            <span className="page-header-logout-label">로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}