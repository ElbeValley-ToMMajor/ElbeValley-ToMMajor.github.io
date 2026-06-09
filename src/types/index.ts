export interface FeatureWish {
  id: string;
  title: string;
  description: string;
  creator: string;
  rating: number;
  createdAt: number;
  solved?: boolean;
  solutionText?: string;
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
  inProgress?: boolean;
  progressPercent?: number;
  progressNote?: string;
  createdAt: number;
  solutionText?: string;
  solutionImageUrl?: string;
}
