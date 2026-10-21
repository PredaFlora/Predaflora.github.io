import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(pb.authStore.isValid && pb.authStore.isSuperuser);

  useEffect(() => {
    return pb.authStore.onChange(() => {
      setIsAdmin(pb.authStore.isValid && pb.authStore.isSuperuser);
    });
  }, []);

  const login = async (email: string, password: string) => {
    await pb.collection("_superusers").authWithPassword(email.trim().toLowerCase(), password);
  };
  const logout = () => pb.authStore.clear();

  return { isAdmin, login, logout };
}
