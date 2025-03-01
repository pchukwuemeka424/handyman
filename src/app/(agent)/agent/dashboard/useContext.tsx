"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const UserContext = createContext(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Error getting user from auth:", authError);
          return;
        }
        console.log("Auth User:", authUser);

        if (!authUser?.user) {
          console.log("No authenticated user found.");
          return;
        }

        const { data: profile, error } = await supabase
          .from("agents")
          .select("*")
          .eq("email", authUser.user.email)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        console.log("Fetched profile:", profile);
        setUser(profile);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    getUserProfile();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
