export interface FeatureWish {
  id: string;
  title: string;
  description: string;
  creator: string;
  rating: number;
  createdAt: number;
}

export interface Idea {
  id: string;
  title: string;
  subtitle: string;
  creator: string;
  category: string;
  costs?: string;
  rating: number;
  solved: boolean;
  createdAt: number;
}
