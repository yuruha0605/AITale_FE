import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*const handleLogin = () => {
    console.log("로그인 시도:", form);
  };

  const handleSignup = () => {
    console.log("회원가입 페이지로 이동");
  };*/

  //간편 로그인 함수 
  const handleSocialLogin = (provider) => {
  console.log(provider + " 간편 로그인 시도");

  // 백엔드 OAuth 로그인 주소로 이동 ?? 
  window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-page">
      <div className="login-illustration">
        <div className="login-sun"></div>

        <div className="login-cloud cloud-a"></div>
        <div className="login-cloud cloud-b"></div>
        <div className="login-cloud cloud-c"></div>
        
        <div className="login-hill hill-front"></div>

        <div className="login-flower flower-a"></div>
        <div className="login-flower flower-b"></div>
        <div className="login-flower flower-c"></div>

        <div className="illustration-text">
          <span className="illustration-badge">로그인</span>
          <h1>만나서 반가워요</h1>
          <p>
            포근한 이야기 속으로
            <br />
            들어가 볼까요?
          </p>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <p>아이디와 비밀번호를 입력해 주세요</p>

          <div className="input-group">
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={form.id}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="login-button" onClick={() => navigate("/main")}>
            로그인
          </button>

          <button className="signup-button" onClick={() => navigate("/join")}>
            회원가입
          </button>
          <div className="login-divider social-divider">
            <span>간편 로그인</span>
          </div>

          <div className="social-icon-group">
            <button
              type="button"
              className="social-circle google"
              onClick={() => handleSocialLogin("google")}
              aria-label="구글 로그인"
            >
              G
            </button>

            <button
              type="button"
              className="social-circle naver"
              onClick={() => handleSocialLogin("naver")}
              aria-label="네이버 로그인"
            >
              N
            </button>

            <button
              type="button"
              className="social-circle kakao"
              onClick={() => handleSocialLogin("kakao")}
              aria-label="카카오 로그인"
            >
              K
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}