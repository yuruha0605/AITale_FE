import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          📖 아이(AI) 동화
        </div>

        <p className="footer-desc">
          아이들을 위한 맞춤형 동화 서비스
        </p>

        <div className="footer-team">
          <p className="team-name">동화 one정대</p>
          <p className="team-members">
            박명환 · 고민균 · 김채린 · 김현수 · 나혜빈 · 염규영 · 정소연
          </p>
        </div>

        <p className="footer-copy">
          © 2026 AI Story. All rights reserved.
        </p>
      </div>
    </footer>
  );
}