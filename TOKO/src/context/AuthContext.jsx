import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil profile:", error);
        setProfile(null);
        return null;
      }

      setProfile(data || null);

      console.log("PROFILE:", data);

      return data || null;
    } catch (error) {
      console.error("Profile error:", error);
      setProfile(null);
      return null;
    }
  }

  // =====================================================
  // INITIAL SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Gagal mengambil session:", error);

          if (mounted) {
            setSession(null);
            setProfile(null);
          }

          return;
        }

        if (!mounted) return;

        const currentSession = data?.session || null;

        setSession(currentSession);

        if (currentSession?.user?.id) {
          await loadProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // ===================================================
    // AUTH STATE LISTENER
    // ===================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log("Auth event:", event);

      setSession(newSession);

      if (newSession?.user?.id) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // SIGN IN
  // =====================================================

  async function signIn(email, password) {
    const cleanEmail = String(email || "").trim();

    if (!cleanEmail) {
      return {
        data: null,
        error: new Error("Email wajib diisi."),
      };
    }

    if (!password) {
      return {
        data: null,
        error: new Error("Password wajib diisi."),
      };
    }

    console.log("Mencoba login:", cleanEmail);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (error) {
      console.error("Supabase Login Error:", error);

      return {
        data: null,
        error,
      };
    }

    console.log("Login berhasil:", data.user?.email);

    if (data?.user?.id) {
      await loadProfile(data.user.id);
    }

    return {
      data,
      error: null,
    };
  }

  // =====================================================
  // SIGN OUT
  // =====================================================

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Gagal logout:", error);
    }

    setSession(null);
    setProfile(null);
  }

  // =====================================================
  // PROVIDER
  // =====================================================

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,

    isAdmin: profile?.role === "admin",

    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =======================================================
// HOOK
// =======================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider."
    );
  }

  return context;
}