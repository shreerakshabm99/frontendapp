
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageBox from "./MessageBox";
import "../styles/style.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [message, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.status === 200) {
        setMsg({ type: "success", text: "Login Successful!" });
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMsg({ type: "error", text: "Invalid email or password" });
      } else {
        setMsg({ type: "error", text: "Server error. Please try again later." });
      }
    }
  };
// try {
//       const response = await axios.get("https://jsonplaceholder.typicode.com/users");
//       const user = response.data.find((u) => u.email === formData.email);
//       if (user && formData.password === "12345") {
//         setMessage("Login Successful");
//         navigate("/Home");
//       } else {
//       setMessage({ type: "error", text: "Invalid email or password" });
//     }
//   } catch (error) {
//     setMessage({ type: "error", text: "Error connecting to server" });
//   }
// };

  return (
    <div className="landing-container">
      {!showLogin && (
        <div className="landing-content">
          <h1>Welcome to our Website</h1>
          <p>Please login into your account!</p>
          <button className="open-login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        </div>
      )}

      {showLogin && (
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <div className="input-field">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Enter your email</label>
            </div>

            <div className="input-field">
              <input
                type="password"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Enter your password</label>
            </div>

            <div className="forget">
              <label htmlFor="remember" className="remember-label">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <p>Remember me</p>
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Log In</button>
            <button
              type="button"
              className="close-btn"
              onClick={() => {
                setShowLogin(false);
                setMsg({ type: "", text: "" });
              }}
            >
              Cancel
            </button>
          </form>

          <MessageBox type={message.type} message={message.text} />
        </div>
      )}
    </div>
  );
}
