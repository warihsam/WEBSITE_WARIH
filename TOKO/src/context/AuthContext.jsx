import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    try {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("LOAD PROFILE ERROR:", error);
        return null;
      }

      setProfile(data || null);

      return data || null;
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      return null;
    }
  };


  // =========================================================
  // AUTH INITIALIZATION
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("=== INITIALIZING AUTH ===");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "GET SESSION ERROR:",
            error
          );
        }

        if (!mounted) return;

        const currentUser =
          session?.user || null;

        console.log(
          "CURRENT USER:",
          currentUser
        );

        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(
          "AUTH INITIALIZATION ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();


    // =======================================================
    // AUTH STATE LISTENER
    // =======================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log(
          "AUTH EVENT:",
          event
        );

        const currentUser =
          session?.user || null;

        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        /*
         * Jangan langsung melakukan query Supabase
         * di dalam callback auth state.
         *
         * Gunakan setTimeout agar tidak terjadi
         * masalah auth lock / deadlock.
         */
        setTimeout(() => {
          if (!mounted) return;

          loadProfile(currentUser.id);
        }, 0);

        setLoading(false);
      }
    );


    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  // =========================================================
  // REGISTER
  // =========================================================

  const register = async ({
    email,
    password,
    fullName,
    phone,
  }) => {
    console.log("=== REGISTER START ===");

    if (!fullName?.trim()) {
      return {
        success: false,
        error: "Nama lengkap wajib diisi.",
      };
    }

    if (!email?.trim()) {
      return {
        success: false,
        error: "Email wajib diisi.",
      };
    }

    if (!password) {
      return {
        success: false,
        error: "Password wajib diisi.",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password minimal 6 karakter.",
      };
    }

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      const cleanName =
        fullName.trim();

      const cleanPhone =
        phone?.trim() || null;

      console.log(
        "REGISTER EMAIL:",
        cleanEmail
      );

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone || "",
          },
        },
      });

      if (error) {
        console.error(
          "REGISTER ERROR:",
          error
        );

        return {
          success: false,
          error: translateAuthError(
            error
          ),
        };
      }

      if (!data?.user) {
        return {
          success: false,
          error:
            "Registrasi gagal. User tidak berhasil dibuat.",
        };
      }

      console.log(
        "REGISTER USER:",
        data.user
      );

      /*
       * Jika Supabase tidak membutuhkan email confirmation,
       * session akan langsung tersedia.
       *
       * Jika email confirmation aktif, session bisa null.
       */
      if (data.session) {
        console.log(
          "REGISTER SESSION AVAILABLE"
        );

        /*
         * Coba membuat profile.
         *
         * Jika gagal karena RLS, jangan menganggap
         * registrasi user gagal.
         */
        const {
          error: profileError,
        } = await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              full_name: cleanName,
              phone: cleanPhone,
            },
            {
              onConflict: "id",
            }
          );

        if (profileError) {
          console.warn(
            "PROFILE CREATE WARNING:",
            profileError
          );
        } else {
          console.log(
            "PROFILE CREATED SUCCESSFULLY"
          );
        }

        await loadProfile(
          data.user.id
        );
      }

      console.log(
        "=== REGISTER SUCCESS ==="
      );

      return {
        success: true,
        user: data.user,
        session: data.session,
        needsEmailConfirmation:
          !data.session,
      };
    } catch (error) {
      console.error(
        "REGISTER EXCEPTION:",
        error
      );

      return {
        success: false,
        error:
          error?.message ||
          "Terjadi kesalahan saat melakukan registrasi.",
      };
    }
  };


  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (
    email,
    password
  ) => {
    console.log("=== LOGIN START ===");

    if (!email?.trim()) {
      return {
        success: false,
        error: "Email wajib diisi.",
      };
    }

    if (!password) {
      return {
        success: false,
        error: "Password wajib diisi.",
      };
    }

    try {
      const cleanEmail =
        email.trim().toLowerCase();

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error(
          "LOGIN ERROR:",
          error
        );

        return {
          success: false,
          error: translateAuthError(
            error
          ),
        };
      }

      console.log(
        "LOGIN USER:",
        data.user
      );

      setUser(data.user);

      if (data.user) {
        await loadProfile(
          data.user.id
        );
      }

      console.log(
        "=== LOGIN SUCCESS ==="
      );

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error(
        "LOGIN EXCEPTION:",
        error
      );

      return {
        success: false,
        error:
          error?.message ||
          "Terjadi kesalahan saat login.",
      };
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    console.log("=== LOGOUT START ===");

    try {
      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "LOGOUT ERROR:",
          error
        );

        return {
          success: false,
          error: error.message,
        };
      }

      setUser(null);
      setProfile(null);

      console.log(
        "=== LOGOUT SUCCESS ==="
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "LOGOUT EXCEPTION:",
        error
      );

      return {
        success: false,
        error:
          error?.message ||
          "Terjadi kesalahan saat logout.",
      };
    }
  };


  // =========================================================
  // REFRESH PROFILE
  // =========================================================

  const refreshProfile = async () => {
    if (!user?.id) {
      return null;
    }

    return await loadProfile(
      user.id
    );
  };


  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    user,
    profile,
    loading,

    register,
    login,
    logout,

    refreshProfile,

    isAuthenticated:
      !!user,

    isAdmin:
      profile?.role === "admin",
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =============================================================
// AUTH ERROR TRANSLATOR
// =============================================================

function translateAuthError(error) {
  const message =
    error?.message || "";

  const lower =
    message.toLowerCase();

  if (
    lower.includes(
      "invalid login credentials"
    )
  ) {
    return "Email atau password salah.";
  }

  if (
    lower.includes(
      "email not confirmed"
    )
  ) {
    return "Email belum diverifikasi. Silakan cek email kamu.";
  }

  if (
    lower.includes(
      "user already registered"
    )
  ) {
    return "Email tersebut sudah terdaftar. Silakan login.";
  }

  if (
    lower.includes(
      "password should be at least"
    )
  ) {
    return "Password terlalu pendek. Gunakan minimal 6 karakter.";
  }

  if (
    lower.includes(
      "rate limit"
    )
  ) {
    return "Terlalu banyak percobaan. Silakan coba beberapa saat lagi.";
  }

  return message ||
    "Terjadi kesalahan autentikasi.";
}


// =============================================================
// HOOK
// =============================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider"
    );
  }

  return context;
}