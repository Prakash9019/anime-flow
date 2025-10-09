// types/index.ts
export interface Episode {
  id: string;
  name: string;
  date: string;
  thumb: any;
  synopsis: string;
  rating: number;
  votes?: string;
}

export interface Anime {
  _id: string;
  title: string;
  poster: any;
  episodes: Episode[];
}

// Fix: Include Splash and Auth in RootStackParamList
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
  Detail: { anime: Anime };
};
