"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  runTransaction,
  deleteField,
  increment,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getUserId } from "@/hooks/useUser";
import { Idea } from "../types";

export function useData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 1 | -1>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Idea[] = [];
      const votes: Record<string, 1 | -1> = {};

      snapshot.docs.forEach((docSnap) => {
        const raw = docSnap.data();
        data.push({
          id: docSnap.id,
          title: raw.title,
          subtitle: raw.subtitle,
          creator: raw.creator,
          category: raw.category,
          costs: raw.costs,
          rating: raw.rating,
          solved: raw.solved,
          createdAt: raw.createdAt,
          solutionText: raw.solutionText,
          solutionImageUrl: raw.solutionImageUrl,
        });
        const v = raw.votes?.[userId];
        if (v === 1 || v === -1) votes[docSnap.id] = v;
      });

      setIdeas(data);
      setUserVotes(votes);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addIdea = async (idea: Omit<Idea, "id" | "rating" | "solved" | "createdAt">) => {
    await addDoc(collection(db, "ideas"), {
      ...idea,
      rating: 0,
      solved: false,
      votes: {},
      createdAt: Date.now(),
    });
  };

  /**
   * direction: 1 = upvote, -1 = downvote
   * - First click in that direction: applies the vote
   * - Clicking the same direction again: removes the vote
   * - Clicking the opposite direction: switches the vote (rating shifts by ±2)
   */
  const voteIdea = async (id: string, direction: 1 | -1) => {
    const userId = getUserId();
    if (!userId) return;

    const ref = doc(db, "ideas", id);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;

      const prev: 0 | 1 | -1 = (snap.data().votes?.[userId] ?? 0) as 0 | 1 | -1;

      if (prev === direction) {
        // Same button clicked again → undo the vote
        tx.update(ref, {
          [`votes.${userId}`]: deleteField(),
          rating: increment(-direction),
        });
      } else {
        // New vote or switch (delta accounts for removing previous vote)
        const delta = direction - prev;
        tx.update(ref, {
          [`votes.${userId}`]: direction,
          rating: increment(delta),
        });
      }
    });
  };

  const solveIdea = async (id: string, solutionText: string, imageFile?: File) => {
    let solutionImageUrl: string | undefined;

    if (imageFile) {
      const storageRef = ref(storage, `solutions/${id}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      solutionImageUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "ideas", id), {
      solved: true,
      solutionText,
      ...(solutionImageUrl ? { solutionImageUrl } : {}),
    });
  };

  return { ideas, addIdea, voteIdea, solveIdea, userVotes, isLoaded };
}
