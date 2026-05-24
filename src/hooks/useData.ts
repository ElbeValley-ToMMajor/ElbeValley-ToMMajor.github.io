"use client";

import { useState, useEffect } from "react";
import { Idea } from "../types";

const initialIdeas: Idea[] = [
  {
    id: "1",
    title: "Build a new community shelter",
    subtitle: "A covered gathering place for the community to meet during bad weather — also usable for local events and pop-up markets.",
    creator: "Alice Smith",
    category: "Infrastructure",
    costs: "50,000 EUR",
    rating: 120,
    solved: false,
    createdAt: Date.now() - 100000,
  },
  {
    id: "2",
    title: "Community Garden",
    subtitle: "Convert the empty lot on Hauptstraße into a shared permaculture garden space — open to all residents.",
    creator: "Bob Johnson",
    category: "Environment",
    rating: 85,
    solved: true,
    createdAt: Date.now() - 200000,
  },
  {
    id: "3",
    title: "Weekly Farmers Market",
    subtitle: "Establish a weekly market to support local farmers and give residents access to fresh, regional produce.",
    creator: "Carol Williams",
    category: "Community",
    costs: "Minimal",
    rating: 200,
    solved: false,
    createdAt: Date.now() - 50000,
  },
];

export function useData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedIdeas = localStorage.getItem("elbe_ideas");

    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas));
    } else {
      setIdeas(initialIdeas);
      localStorage.setItem("elbe_ideas", JSON.stringify(initialIdeas));
    }

    setIsLoaded(true);
  }, []);

  const addIdea = (idea: Omit<Idea, "id" | "rating" | "solved" | "createdAt">) => {
    const newIdea: Idea = {
      ...idea,
      id: Math.random().toString(36).substring(2, 9),
      rating: 0,
      solved: false,
      createdAt: Date.now(),
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    localStorage.setItem("elbe_ideas", JSON.stringify(updated));
  };

  const voteIdea = (id: string, increment: number) => {
    const updated = ideas.map((idea) => {
      if (idea.id === id) {
        return { ...idea, rating: idea.rating + increment };
      }
      return idea;
    });
    setIdeas(updated);
    localStorage.setItem("elbe_ideas", JSON.stringify(updated));
  };

  return {
    ideas,
    addIdea,
    voteIdea,
    isLoaded,
  };
}
