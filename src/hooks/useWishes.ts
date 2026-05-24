"use client";

import { useState, useEffect } from "react";
import { FeatureWish } from "../types";

const initialWishes: FeatureWish[] = [
  {
    id: "w1",
    title: "Email notifications for idea status changes",
    description: "Notify users by email when an idea they voted for is marked as solved or receives a comment from the administration.",
    creator: "Admin",
    rating: 34,
    createdAt: Date.now() - 500000,
  },
  {
    id: "w2",
    title: "Comment section on each idea",
    description: "Allow community members to leave comments and discuss ideas directly on the idea detail page.",
    creator: "Admin",
    rating: 21,
    createdAt: Date.now() - 300000,
  },
];

export function useWishes() {
  const [wishes, setWishes] = useState<FeatureWish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("elbe_wishes");
    if (stored) {
      setWishes(JSON.parse(stored));
    } else {
      setWishes(initialWishes);
      localStorage.setItem("elbe_wishes", JSON.stringify(initialWishes));
    }
    setIsLoaded(true);
  }, []);

  const addWish = (wish: Omit<FeatureWish, "id" | "rating" | "createdAt">) => {
    const newWish: FeatureWish = {
      ...wish,
      id: Math.random().toString(36).substring(2, 9),
      rating: 0,
      createdAt: Date.now(),
    };
    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem("elbe_wishes", JSON.stringify(updated));
  };

  const voteWish = (id: string, increment: number) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, rating: w.rating + increment } : w
    );
    setWishes(updated);
    localStorage.setItem("elbe_wishes", JSON.stringify(updated));
  };

  return { wishes, addWish, voteWish, isLoaded };
}
