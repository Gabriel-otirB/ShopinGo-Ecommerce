"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

interface AuthContextType {
  user: User | null;
  profile: { role: string; email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;

      setUser(currentUser);
      if (currentUser) {
        await ensureProfileExists(currentUser);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    syncSession();
  }, []);

  const ensureProfileExists = async (user: User) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") return;

    if (!profileData) {
      const name = user.user_metadata?.name ?? "Sem nome";
      const email = user.email ?? "Sem email";

      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: user.id,
        name,
        email,
      });

      if (!insertError) {
        setProfile({ role: "user", email });
      }
    } else {
      setProfile({
        role: profileData.role || "user",
        email: profileData.email || "Sem email",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      throw new Error(error.message);
    }

    const currentUser = data.user;
    setUser(currentUser);
    await ensureProfileExists(currentUser);
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  };

  const signInWithGoogle = (redirectTo?: string) => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
