import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaLock, FaEnvelope, FaUser } from "react-icons/fa";

import { login, register } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { toast } from "sonner";

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading = false, error = null } =
    useAppSelector((state: any) => state.auth || {});

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        const res = await dispatch(
          login({
            email: email.toLowerCase(),
            password,
          })
        ).unwrap();

        toast.success("Welcome back");

        // ✅ FIX (NO reload)
        navigate(res.user?.role === "admin" ? "/admin" : "/");

      } else {
        await dispatch(
          register({
            name,
            email: email.toLowerCase(),
            password,
          })
        ).unwrap();

        toast.success("Account created successfully!");
        setIsLogin(true);
      }
    } catch (err: any) { // ✅ FIX
      console.log(err);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="auth-overlay"></div>

        <div className="auth-content">
          <h1>StoryTeller</h1>
          <p>
            Step into a world of stories, knowledge, and imagination.
            Your next favorite book is just a click away.
          </p>

          <div className="auth-highlights mt-4">
            <span>10,000+ Books</span>
            <span>Curated Authors</span>
            <span>Instant Access</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">

          <div className="text-center mb-3">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-muted small">
              {isLogin
                ? "Login to continue your reading journey"
                : "Join StoryTeller today"}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="input-group mb-3">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group mb-3">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isLogin && (
            <div className="text-end mb-3">
              <span className="small text-muted forgot-link">
                Forgot Password?
              </span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-main w-100 mb-3"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

          <button className="btn btn-light w-100 mb-3 border d-flex align-items-center justify-content-center gap-2">
            <FaGoogle /> Continue with Google
          </button>

          <p className="text-center small">
            {isLogin ? "New here?" : "Already have an account?"}
            <span
              className="switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? " Register" : " Login"}
            </span>
          </p>

          <p className="text-center small secure-text">
            Your data is safe & secure
          </p>

        </div>
      </div>
    </div>
  );
}