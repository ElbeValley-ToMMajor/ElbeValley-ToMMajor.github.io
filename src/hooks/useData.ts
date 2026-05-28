"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Idea } from "../types";

export function useData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Idea[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Idea, "id">),
      }));
      setIdeas(data);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addIdea = async (idea: Omit<Idea, "id" | "rating" | "solved" | "createdAt">) => {
    await addDoc(collection(db, "ideas"), {
      ...idea,
      rating: 0,
      solved: false,
      createdAt: Date.now(),
    });
  };

  const voteIdea = async (id: string, delta: number) => {
    await updateDoc(doc(db, "ideas", id), {
      rating: increment(delta),
    });
  };

  return { ideas, addIdea, voteIdea, isLoaded };
}
