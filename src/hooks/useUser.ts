"use client";

import { useState, useEffect } from "react";

/** Returns the stable anonymous userId for this browser, creating one if needed. */
export function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("elbe_userId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("elbe_userId", id);
  }
  return id;
}

export function useUser() {
  const [username, setUsernameState] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("elbe_username") ?? "";
    setUsernameState(stored);
    setUserId(getUserId());
    setIsLoaded(true);
  }, []);

  const setUsername = (name: string) => {
    const trimmed = name.trim();
    setUsernameState(trimmed);
    localStorage.setItem("elbe_username", trimmed);
  };

  return { username, setUsername, userId, isLoaded };
}
