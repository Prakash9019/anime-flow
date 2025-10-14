// types/index.ts
export interface Episode {
  _id: string;
  number: number;
  title: string;
  synopsis: string;
  airDate: string;
  thumbnail?: string;
  averageRating: number;
  userRatings: Array<{
    user: string;
    rating: number;
  }>;
}

export interface AnimeItem {
  _id: string;
  id: string;
  title: string;
  poster: string;
  averageRating: number;
  rank: number;
  genres: string[];
  status: string;
  episodes?: Episode[];
  synopsis?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdFree?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  UserAuth: undefined;
  UserMain: undefined;
  AdminLogin: undefined;
  AdminMain: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: { anime: AnimeItem };
};

// types/index.ts (Add admin navigation types)
export type AdminStackParamList = {
  AdminMain: undefined;
  AdminPanel: undefined;
  CreateAds: undefined;
  ManageAds: undefined;
  CreateEmployee: undefined;
  ManageAccount: undefined;
  PostAnimeContent: undefined;
  EditContent: undefined;
  BulkUpload: undefined;
  BulkEdit: undefined;
  AdminLogin: undefined;
};
