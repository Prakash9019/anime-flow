// data/anime.ts
import { Anime } from '../types';

const data: Anime[] = [
  {
    id: 'solo',
    title: 'Solo Leveling',
    poster: require('../assets/images/logo.png'),
    episodes: [
      {
        id: 'e1',
        name: "E1 • I'm Used to It",
        date: 'SAT · JAN 6, 2024',
        thumb: "",
        synopsis: 'Ten years ago, gates that connected our world to another dimension began to appear, leading to the rise of hunters who would traverse these gates to fight the magic beasts within. Sung Jin-woo, E-Rank hunter, is the weakest of them all.',
        rating: 8.1
      },
      {
        id: 'e2',
        name: 'E2 • If I Had One More Chance',
        date: 'SAT · JAN 13, 2024',
        thumb:"",
        synopsis: 'After a near-death encounter, a mysterious system assigns quests that only Jin-woo can see, offering him one more chance to grow.',
        rating: 9.1
      },
      {
        id: 'e3',
        name: "E3 • It's Like a Game",
        date: 'SAT · JAN 20, 2024',
        thumb: "",
        synopsis: 'Jin-woo realizes the rules of the system mirror a video game as he grinds daily quests and dungeon runs to level up.',
        rating: 8.0
      },
      {
        id: 'e4',
        name: "E4 • I've Gotta Get Stronger",
        date: 'SAT · JAN 27, 2024',
        thumb: "",
        synopsis: 'The grind intensifies as new stat thresholds unlock skills; Jin-woo takes on risks to accelerate growth.',
        rating: 8.6
      },
      {
        id: 'e5',
        name: 'E5 • A Pretty Good Deal',
        date: 'SAT · FEB 03, 2024',
        thumb:"",
        synopsis: 'Jin-woo discovers the value of strategic partnerships and resource management in his leveling journey.',
        rating: 8.4
      }
      // Add remaining episodes as needed
    ]
  }
];

export default data;
