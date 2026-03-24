import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildSocialLoginUrl,
  persistAuth,
  signIn,
} from "../../services/userService";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken) {
      return;
    }

    persistAuth(accessToken, refreshToken || "");
    window.history.replaceState({}, "", window.location.pathname);
    navigate("/main", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn({
        email: form.email.trim(),
        password: form.password,
      });

      if (!result.accessToken) {
        throw new Error("access token missing");
      }

      navigate("/main");
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인에 실패했습니다. 입력 정보를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //간편 로그인 함수
  const handleSocialLogin = (provider) => {
    console.log(provider + " 간편 로그인 시도");

    window.location.href = buildSocialLoginUrl(provider);
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
              name="email"
              placeholder="Email"
              value={form.email}
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

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>

          <button
            className="signup-button"
            onClick={() => navigate("/join")}
          >
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