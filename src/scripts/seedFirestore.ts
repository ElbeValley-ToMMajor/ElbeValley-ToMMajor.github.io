/**
 * One-time seed script — run once to populate Firestore with initial ideas & wishes.
 * After running, delete or ignore this file.
 *
 * Usage (from project root):
 *   npx tsx src/scripts/seedFirestore.ts
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzioYfNd0r_R_HhCcHVjUUdssSqCtzADg",
  authDomain: "elbevalley-tom.firebaseapp.com",
  projectId: "elbevalley-tom",
  storageBucket: "elbevalley-tom.firebasestorage.app",
  messagingSenderId: "853615371111",
  appId: "1:853615371111:web:afe1dc3f7ee6401de785c2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const initialIdeas = [
  {
    title: "Build a new community shelter",
    subtitle:
      "A covered gathering place for the community to meet during bad weather — also usable for local events and pop-up markets.",
    creator: "Alice Smith",
    category: "Infrastructure",
    costs: "50,000 EUR",
    rating: 120,
    solved: false,
    createdAt: Date.now() - 100000,
  },
  {
    title: "Community Garden",
    subtitle:
      "Convert the empty lot on Hauptstraße into a shared permaculture garden space — open to all residents.",
    creator: "Bob Johnson",
    category: "Environment",
    rating: 85,
    solved: true,
    createdAt: Date.now() - 200000,
  },
  {
    title: "Weekly Farmers Market",
    subtitle:
      "Establish a weekly market to support local farmers and give residents access to fresh, regional produce.",
    creator: "Carol Williams",
    category: "Community",
    costs: "Minimal",
    rating: 200,
    solved: false,
    createdAt: Date.now() - 50000,
  },
];

const initialWishes = [
  {
    title: "Email notifications for idea status changes",
    description:
      "Notify users by email when an idea they voted for is marked as solved or receives a comment from the administration.",
    creator: "Admin",
    rating: 34,
    createdAt: Date.now() - 500000,
  },
  {
    title: "Comment section on each idea",
    description:
      "Allow community members to leave comments and discuss ideas directly on the idea detail page.",
    creator: "Admin",
    rating: 21,
    createdAt: Date.now() - 300000,
  },
];

async function seed() {
  // Only seed if collections are empty
  const ideasSnap = await getDocs(collection(db, "ideas"));
  if (ideasSnap.empty) {
    for (const idea of initialIdeas) {
      await addDoc(collection(db, "ideas"), idea);
    }
    console.log(`✅ Seeded ${initialIdeas.length} ideas`);
  } else {
    console.log(`⏭️  Ideas collection already has data — skipping`);
  }

  const wishesSnap = await getDocs(collection(db, "wishes"));
  if (wishesSnap.empty) {
    for (const wish of initialWishes) {
      await addDoc(collection(db, "wishes"), wish);
    }
    console.log(`✅ Seeded ${initialWishes.length} wishes`);
  } else {
    console.log(`⏭️  Wishes collection already has data — skipping`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
