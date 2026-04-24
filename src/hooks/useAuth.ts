import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. listener primeiro
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // defer pra evitar deadlock
        setTimeout(() => fetchProfile(sess.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    // 2. depois session existente
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, phone, address, avatar_url")
      .eq("id", uid)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  };

  const updateProfile = async (patch: Partial<Profile>) => {
    if (!user) return { error: new Error("Não autenticado") };
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select()
      .maybeSingle();
    if (!error && data) setProfile(data as Profile);
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, profile, loading, updateProfile, signOut, refetchProfile: () => user && fetchProfile(user.id) };
}
