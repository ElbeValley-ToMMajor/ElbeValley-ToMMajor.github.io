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
import { FeatureWish } from "../types";

export function useWishes() {
  const [wishes, setWishes] = useState<FeatureWish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: FeatureWish[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<FeatureWish, "id">),
      }));
      setWishes(data);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addWish = async (wish: Omit<FeatureWish, "id" | "rating" | "createdAt">) => {
    await addDoc(collection(db, "wishes"), {
      ...wish,
      rating: 0,
      createdAt: Date.now(),
    });
  };

  const voteWish = async (id: string, delta: number) => {
    await updateDoc(doc(db, "wishes", id), {
      rating: increment(delta),
    });
  };

  return { wishes, addWish, voteWish, isLoaded };
}
