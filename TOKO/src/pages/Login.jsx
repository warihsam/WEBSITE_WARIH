import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    location.state?.from?.pathname || "/home";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!form.password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        form.email,
        form.password
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN PAGE ERROR:", error);

      setError(
        error?.message ||
          "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span>WS</span>
          <strong>WS Fashion</strong>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">WS FASHION</p>

            <h1>Selamat Datang</h1>

            <p>
              Login untuk melanjutkan ke akun WS Fashion
              kamu.
            </p>
          </div>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">
                Email
              </label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <span>Belum punya akun?</span>

            <Link to="/register">
              Daftar sekarang
            </Link>
          </div>
        </div>

        <Link to="/" className="auth-back">
          ← Kembali ke toko
        </Link>
      </div>
    </main>
  );
}