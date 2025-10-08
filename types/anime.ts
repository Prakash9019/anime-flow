// types/anime.ts
export interface AnimeNode {
  id: number;
  title: string;
  main_picture?: { medium: string; large: string };
  alternative_titles?: { synonyms: string[]; en?: string; ja?: string };
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_episodes?: number;
  my_list_status?: { status?: string; score?: number; num_watched_episodes?: number };
}

export type UserAnimeListResponse = {
  data: { node: AnimeNode }[];
  paging: { next?: string; previous?: string };
};
