import React, {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const {
    user,
    isAdmin,
    loading,
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================================
  // JIKA SUDAH LOGIN SEBAGAI ADMIN
  // =========================================================

  useEffect(() => {
    if (
      !loading &&
      user &&
      isAdmin
    ) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [
    loading,
    user,
    isAdmin,
    navigate,
  ]);

  // =========================================================
  // SUBMIT LOGIN
  // =========================================================

  async function submit(e) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Email wajib diisi."
      );

      return;
    }

    if (!password) {
      setError(
        "Password wajib diisi."
      );

      return;
    }

    try {
      setSubmitting(true);

      // PENTING:
      // AuthContext menggunakan login(),
      // bukan signIn().

      const result =
        await login(
          cleanEmail,
          password
        );

      console.log(
        "ADMIN LOGIN RESULT:",
        result
      );

      /*
       * AuthContext biasanya sudah
       * mengembalikan user/profile.
       *
       * Kita cek role admin setelah
       * login berhasil.
       */

      if (
        result?.profile &&
        result.profile.role &&
        result.profile.role !==
          "admin"
      ) {
        setError(
          "Akun ini bukan akun admin."
        );

        return;
      }

      /*
       * Jika login berhasil tetapi
       * profile belum langsung tersedia,
       * beri waktu AuthContext memproses
       * INITIAL_SESSION/AUTH event.
       */

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      setError(
        error?.message ||
          "Login admin gagal. Periksa email dan password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================================
  // LOADING AUTH
  // =========================================================

  if (loading) {
    return (
      <main className="admin-login-page">

        <div className="admin-login-loading">

          <Loader2
            size={30}
            className="admin-login-spin"
          />

          <p>
            Memeriksa sesi...
          </p>

        </div>

      </main>
    );
  }

  // =========================================================
  // SUDAH ADMIN
  // =========================================================

  if (
    user &&
    isAdmin
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // =========================================================
  // VIEW
  // =========================================================

  return (
    <main className="admin-login-page">

      <div className="admin-login-wrapper">

        {/* LOGO */}

        <div className="admin-login-logo">
          WS
        </div>

        <p className="admin-login-brand">
          WS FASHION
        </p>

        {/* CARD */}

        <section className="admin-login-card">

          <div className="admin-login-heading">

            <div className="admin-login-icon">
              <ShieldCheck
                size={24}
              />
            </div>

            <div>
              <p className="admin-login-eyebrow">
                ADMIN ACCESS
              </p>

              <h1>
                Admin Login
              </h1>

              <p>
                Masuk ke dashboard
                administrasi WS Fashion.
              </p>
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="admin-login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={submit}
            className="admin-login-form"
          >

            {/* EMAIL */}

            <label>

              <span>
                Email Admin
              </span>

              <div className="admin-login-input">

                <Mail
                  size={18}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

            </label>

            {/* PASSWORD */}

            <label>

              <span>
                Password
              </span>

              <div className="admin-login-input">

                <LockKeyhole
                  size={18}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  disabled={
                    submitting
                  }
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  disabled={
                    submitting
                  }
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>

              </div>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={
                submitting
              }
            >

              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="admin-login-spin"
                  />

                  Memproses...
                </>
              ) : (
                <>
                  <LogIn
                    size={18}
                  />

                  Masuk Dashboard
                </>
              )}

            </button>

          </form>

        </section>

        <p className="admin-login-footer">
          WS Fashion Admin System
        </p>

      </div>

    </main>
  );
}