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
  id: string;
  title: string;
  poster: any;
  episodes: Episode[];
}

export type RootStackParamList = {
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
