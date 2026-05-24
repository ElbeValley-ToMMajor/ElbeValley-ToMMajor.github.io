"use client";

import { useState, useEffect } from "react";

export function useUser() {
  const [username, setUsernameState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("elbe_username") ?? "";
    setUsernameState(stored);
    setIsLoaded(true);
  }, []);

  const setUsername = (name: string) => {
    const trimmed = name.trim();
    setUsernameState(trimmed);
    localStorage.setItem("elbe_username", trimmed);
  };

  return { username, setUsername, isLoaded };
}
