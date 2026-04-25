import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../Styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await loginUser(email, password);

      if (data.message === "Login successful") {
        const user = data.user;

        localStorage.setItem("user", JSON.stringify(user));
        setMessage("Welcome " + user.first_name);

        setTimeout(() => {
          if (user.role === "admin")           navigate("/admin/dashboard");
          else if (user.role === "employee")   navigate("/employee/dashboard");
          else if (user.role === "secretary")  navigate("/secretary/dashboard");
          else if (user.role === "manager")    navigate("/manager/dashboard");
          else if (user.role === "dml")        navigate("/dml/dashboard");
          else alert("Unknown role: " + user.role);
        }, 1000);

      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error, please try again");
    }
  };

  return (
    <div className="login-page">

      <div className="glow-circle gc1"/>
      <div className="glow-circle gc2"/>
      <div className="glow-circle gc3"/>
      <div className="login-container">

      <div className="particles">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>

      

        <img src="/logo.jpg" width="150" alt="logo" />
        <h2>Welcome</h2>
        <p>Sign in to your account</p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="remember-me">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>

          {message && <p style={{ color: "#1a2a4f" }}>{message}</p>}

          <button className="login-btn">Login</button>

        </form>

        <div className="signup">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>

        <div className="footer-text">
          © 2026 Mission Management Platform
        </div>

      </div>
    </div>
  );
}

export default Login;