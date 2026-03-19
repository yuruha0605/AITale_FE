//회원 가입 후 나타나는 로그인 페이지 입니다.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignPage.css";

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

  const handleLogin = () => {
    console.log("로그인 시도:", form);

    navigate("/test/intro");
  };

   return (
    <div className="login-page">
      <div className="login-illustration">
        <div className="login-sun"></div>

        <div className="login-cloud cloud-a"></div>
        <div className="login-cloud cloud-b"></div>
        <div className="login-cloud cloud-c"></div>

        <div className="login-hill hill-back"></div>
        <div className="login-hill hill-front"></div>

        <div className="login-flower flower-a"></div>
        <div className="login-flower flower-b"></div>
        <div className="login-flower flower-c"></div>

        <div className="illustration-text">
          <span className="illustration-badge">Fairy Login</span>
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
          <p>아이디와 비밀번호를 입력해 주세요.</p>

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

          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
          </div>
      </div>
    </div>
  );
}