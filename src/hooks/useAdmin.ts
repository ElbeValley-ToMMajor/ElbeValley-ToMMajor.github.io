"use client";

import { useState, useEffect } from "react";

const ADMIN_USER = "admin";
const ADMIN_PASS = "adminadmin123321";
const SESSION_KEY = "elbe_admin";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem(SESSION_KEY) === "true");
  }, []);

  const login = (user: string, pass: string): boolean => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}
