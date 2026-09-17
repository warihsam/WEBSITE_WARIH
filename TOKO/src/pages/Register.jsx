import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  // =========================================================
  // HANDLE REGISTER
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    // ---------------------------------------------------------
    // VALIDASI NAMA
    // ---------------------------------------------------------

    if (!form.fullName.trim()) {
      setError(
        "Nama lengkap wajib diisi."
      );
      return;
    }


    // ---------------------------------------------------------
    // VALIDASI NOMOR WHATSAPP
    // ---------------------------------------------------------

    if (!form.phone.trim()) {
      setError(
        "Nomor WhatsApp wajib diisi."
      );
      return;
    }


    // ---------------------------------------------------------
    // VALIDASI EMAIL
    // ---------------------------------------------------------

    if (!form.email.trim()) {
      setError(
        "Email wajib diisi."
      );
      return;
    }


    // ---------------------------------------------------------
    // VALIDASI PASSWORD
    // ---------------------------------------------------------

    if (form.password.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }


    // ---------------------------------------------------------
    // VALIDASI KONFIRMASI PASSWORD
    // ---------------------------------------------------------

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak sama."
      );
      return;
    }


    try {
      setLoading(true);


      // -------------------------------------------------------
      // REGISTER SUPABASE
      // -------------------------------------------------------

      const result =
        await register({
          fullName:
            form.fullName.trim(),

          phone:
            form.phone.trim(),

          email:
            form.email.trim(),

          password:
            form.password,
        });


      // -------------------------------------------------------
      // REGISTER GAGAL
      // -------------------------------------------------------

      if (!result.success) {
        setError(
          result.error ||
            "Registrasi gagal."
        );

        return;
      }


      // -------------------------------------------------------
      // EMAIL CONFIRMATION AKTIF
      // -------------------------------------------------------

      if (!result.session) {
        setSuccess(
          "Registrasi berhasil. Silakan cek email untuk melakukan verifikasi akun."
        );

        return;
      }


      // -------------------------------------------------------
      // REGISTER BERHASIL DAN LANGSUNG LOGIN
      // -------------------------------------------------------

      setSuccess(
        "Akun berhasil dibuat. Mengarahkan ke halaman utama..."
      );


      // Beri waktu agar pesan sukses terlihat
      setTimeout(() => {
        navigate("/home", {
          replace: true,
        });
      }, 800);

    } catch (error) {
      console.error(
        "REGISTER PAGE ERROR:",
        error
      );

      setError(
        error?.message ||
          "Terjadi kesalahan saat membuat akun."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="auth-page">

      <div className="auth-container">


        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="auth-brand">
          <span>WS</span>

          <strong>
            WS Fashion
          </strong>
        </div>


        {/* ===================================================
            REGISTER CARD
        =================================================== */}

        <div className="auth-card">


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="auth-heading">

            <p className="eyebrow">
              WS FASHION
            </p>

            <h1>
              Buat Akun
            </h1>

            <p>
              Daftar untuk mulai berbelanja
              dan melacak pesanan kamu.
            </p>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}


          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && (
            <div className="auth-message auth-success">
              {success}
            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>


            {/* ===============================================
                NAMA LENGKAP
            =============================================== */}

            <div className="auth-field">

              <label htmlFor="fullName">
                Nama Lengkap
              </label>

              <div className="auth-input-wrapper">

                <User size={18} />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nama lengkap"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={loading}
                />

              </div>

            </div>


            {/* ===============================================
                NOMOR WHATSAPP
            =============================================== */}

            <div className="auth-field">

              <label htmlFor="phone">
                Nomor WhatsApp
              </label>

              <div className="auth-input-wrapper">

                <Phone size={18} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  inputMode="tel"
                  disabled={loading}
                />

              </div>

            </div>


            {/* ===============================================
                EMAIL
            =============================================== */}

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
                  disabled={loading}
                />

              </div>

            </div>


            {/* ===============================================
                PASSWORD
            =============================================== */}

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
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ===============================================
                KONFIRMASI PASSWORD
            =============================================== */}

            <div className="auth-field">

              <label htmlFor="confirmPassword">
                Konfirmasi Password
              </label>

              <div className="auth-input-wrapper">

                <Lock size={18} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Ulangi password"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ===============================================
                SUBMIT
            =============================================== */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Membuat akun..."
                : "Daftar"}
            </button>

          </form>


          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div className="auth-footer">

            <span>
              Sudah punya akun?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>


        {/* ===================================================
            BACK TO STORE
        =================================================== */}

        <Link
          to="/"
          className="auth-back"
        >
          ← Kembali ke toko
        </Link>

      </div>

    </main>
  );
}