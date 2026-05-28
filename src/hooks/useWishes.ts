"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  runTransaction,
  deleteField,
  increment,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserId } from "@/hooks/useUser";
import { FeatureWish } from "../types";

export function useWishes() {
  const [wishes, setWishes] = useState<FeatureWish[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 1 | -1>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: FeatureWish[] = [];
      const votes: Record<string, 1 | -1> = {};

      snapshot.docs.forEach((docSnap) => {
        const raw = docSnap.data();
        data.push({
          id: docSnap.id,
          title: raw.title,
          description: raw.description,
          creator: raw.creator,
          rating: raw.rating,
          createdAt: raw.createdAt,
        });
        const v = raw.votes?.[userId];
        if (v === 1 || v === -1) votes[docSnap.id] = v;
      });

      setWishes(data);
      setUserVotes(votes);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addWish = async (wish: Omit<FeatureWish, "id" | "rating" | "createdAt">) => {
    await addDoc(collection(db, "wishes"), {
      ...wish,
      rating: 0,
      votes: {},
      createdAt: Date.now(),
    });
  };

  const voteWish = async (id: string, direction: 1 | -1) => {
    const userId = getUserId();
    if (!userId) return;

    const ref = doc(db, "wishes", id);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;

      const prev: 0 | 1 | -1 = (snap.data().votes?.[userId] ?? 0) as 0 | 1 | -1;

      if (prev === direction) {
        tx.update(ref, {
          [`votes.${userId}`]: deleteField(),
          rating: increment(-direction),
        });
      } else {
        const delta = direction - prev;
        tx.update(ref, {
          [`votes.${userId}`]: direction,
          rating: increment(delta),
        });
      }
    });
  };

  return { wishes, addWish, voteWish, userVotes, isLoaded };
}
