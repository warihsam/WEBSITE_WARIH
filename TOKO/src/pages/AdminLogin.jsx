import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { user, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  async function submit(e) {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signIn(cleanEmail, password);

      if (authError) {
        console.error("Supabase Login Error:", authError);
        setError(authError.message || "Email atau password salah.");
        return;
      }

      // AuthContext akan memperbarui user.
      // useEffect di atas akan mengarahkan ke /admin.
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err?.message || "Terjadi kesalahan saat login. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-mark">
          <LockKeyhole size={22} />
        </div>

        <p className="eyebrow">WS FASHION / ADMIN</p>

        <h1>Welcome back.</h1>

        <p className="muted">
          Login menggunakan akun admin Supabase.
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button dark wide"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}