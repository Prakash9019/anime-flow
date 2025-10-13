// screens/Home.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';
import AdBanner from '../components/AdBanner';
import { useAuth } from '../hooks/useAuth';

// Define types locally if not exported from types file
interface AnimeItem {
  _id: string;
  id: string;
  title: string;
  poster: string;
  averageRating: number;
  rank: number;
  genres: string[];
  status: string;
  episodes?: any[];
  synopsis?: string;
}

type HomeStackParamList = {
  Home: undefined;
  Detail: { anime: AnimeItem };
};

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function Home(): React.ReactElement {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  useEffect(() => {
    fetchAnimeList();
    if (user) {
      checkAdFreeStatus();
    }
  }, [user]);

  const checkAdFreeStatus = async () => {
    if (!user) {
      setIsAdFree(false);
      return;
    }

    try {
      const response = await fetch(`${ApiService.baseURL}/user/ad-free-status`, {
        headers: await ApiService.getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAdFree(data.isAdFree || false);
      } else {
        setIsAdFree(false);
      }
    } catch (error) {
      console.error('Error checking ad-free status:', error);
      setIsAdFree(false);
    }
  };

  const fetchAnimeList = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await ApiService.getAnimeList({
        sort: 'rating',
        limit: 50
      });
      setAnimeList(response.anime || []);
    } catch (error) {
      console.error('Error fetching anime list:', error);
      // Use mock data if API fails
      const mockAnime: AnimeItem[] = [
        {
          _id: '1',
          id: '1',
          title: 'Attack on Titan',
          poster: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
          averageRating: 9.0,
          rank: 1,
          genres: ['Action', 'Drama'],
          status: 'Completed'
        },
        {
          _id: '2',
          id: '2',
          title: 'Demon Slayer',
          poster: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
          averageRating: 8.7,
          rank: 2,
          genres: ['Action', 'Supernatural'],
          status: 'Completed'
        },
        {
          _id: '3',
          id: '3',
          title: 'One Piece',
          poster: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          averageRating: 8.9,
          rank: 3,
          genres: ['Action', 'Adventure'],
          status: 'Ongoing'
        },
        {
          _id: '4',
          id: '4',
          title: 'Naruto',
          poster: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
          averageRating: 8.4,
          rank: 4,
          genres: ['Action', 'Martial Arts'],
          status: 'Completed'
        },
        {
          _id: '5',
          id: '5',
          title: 'Your Name',
          poster: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg',
          averageRating: 8.4,
          rank: 5,
          genres: ['Romance', 'Drama'],
          status: 'Completed'
        },
        {
          _id: '6',
          id: '6',
          title: 'Spirited Away',
          poster: 'https://cdn.myanimelist.net/images/anime/6/79597.jpg',
          averageRating: 9.3,
          rank: 6,
          genres: ['Adventure', 'Family'],
          status: 'Completed'
        }
      ];
      setAnimeList(mockAnime);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      return fetchAnimeList();
    }

    setSearching(true);
    try {
      const response = await ApiService.getAnimeList({
        search: text,
        sort: 'rating',
        limit: 30
      });
      setAnimeList(response.anime || []);
    } catch (error) {
      console.error('Error searching anime:', error);
    } finally {
      setSearching(false);
    }
  };

  const onRefresh = () => {
    fetchAnimeList(true);
    if (user) {
      checkAdFreeStatus();
    }
  };

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '#1 Rated';
    if (rank <= 10) return `#${rank} Top`;
    return null;
  };

  const renderAnimeCard = ({ item, index }: { item: AnimeItem; index: number }) => {
    const isTopRated = index === 0 || item.rank === 1;
    
    return (
      <>
        <TouchableOpacity
          style={[
            styles.animeCard,
            isTopRated && styles.topRatedCard
          ]}
          onPress={() => navigation.navigate('Detail', { anime: item })}
          activeOpacity={0.8}
        >
          {/* Rank Badge for Top Anime */}
          {getRankBadge(item.rank) && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>{getRankBadge(item.rank)}</Text>
            </View>
          )}

          {/* Poster Image */}
          <Image
            source={{ uri: item.poster }}
            style={[
              styles.animePoster,
              isTopRated && styles.topRatedPoster
            ]}
            resizeMode="cover"
          />

          {/* Rating Overlay */}
          {item.averageRating > 0 && (
            <View style={styles.ratingOverlay}>
              <Ionicons name="star" color="#FFD700" size={16} />
              <Text style={styles.ratingText}>
                {formatRating(item.averageRating)}/10
              </Text>
            </View>
          )}

          {/* Title and Info */}
          <View style={styles.animeInfo}>
            <Text 
              style={[
                styles.animeTitle,
                isTopRated && styles.topRatedTitle
              ]} 
              numberOfLines={2}
            >
              {item.title}
            </Text>
            
            {item.genres && item.genres.length > 0 && (
              <Text style={styles.animeGenres} numberOfLines={1}>
                {item.genres.slice(0, 2).join(' • ')}
              </Text>
            )}
            
            {item.status && (
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: item.status === 'Completed' ? '#4CAF50' : COLORS.cyan }
                ]} />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}
          </View>

          {/* Special styling for top anime */}
          {isTopRated && (
            <View style={styles.topRatedBorder} />
          )}
        </TouchableOpacity>

        {/* Show ad after every 4 anime cards for non-donors */}
        {!isAdFree && user && (index + 1) % 4 === 0 && (
          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        )}
      </>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="film-outline" color="#666" size={64} />
      <Text style={styles.emptyTitle}>No Anime Found</Text>
      <Text style={styles.emptySubtitle}>
        {query ? 'Try searching with different keywords' : 'Check your connection and try again'}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
        <Text style={styles.loadingText}>Loading anime...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.appTitle}>ANIME FLOW</Text>
        </View>
        <View style={styles.headerRight}>
          {isAdFree && (
            <View style={styles.adFreeIndicator}>
              <Ionicons name="star" color="#FFD700" size={16} />
            </View>
          )}
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" color={COLORS.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" color="#666" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search anime..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {(query.length > 0 || searching) && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons 
                name={searching ? "hourglass-outline" : "close-circle"} 
                color="#666" 
                size={20} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Anime List */}
      <FlatList
        data={animeList}
        renderItem={renderAnimeCard}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContainer,
          animeList.length === 0 && styles.emptyListContainer
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.cyan]}
            tintColor={COLORS.cyan}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Bottom Tab Indicator */}
      <View style={styles.tabIndicator}>
        <View style={styles.activeTabLine} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONTS.body,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  appTitle: {
    color: COLORS.cyan,
    fontSize: 20,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  adFreeIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  notificationButton: {
    padding: 8,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 12,
    fontFamily: FONTS.body,
  },

  // List
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },

  // Anime Cards
  animeCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  topRatedCard: {
    borderWidth: 2,
    borderColor: COLORS.cyan,
    transform: [{ scale: 1.02 }],
  },
  topRatedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    backgroundColor: 'transparent',
  },

  // Rank Badge
  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.cyan,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 2,
  },
  rankBadgeText: {
    color: COLORS.black,
    fontSize: 10,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },

  // Poster
  animePoster: {
    width: '100%',
    height: 200,
  },
  topRatedPoster: {
    height: 220,
  },

  // Rating Overlay
  ratingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 1,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    marginLeft: 4,
    fontFamily: FONTS.body,
    fontWeight: 'bold',
  },

  // Anime Info
  animeInfo: {
    padding: 12,
  },
  animeTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 18,
  },
  topRatedTitle: {
    color: COLORS.cyan,
    fontSize: 15,
  },
  animeGenres: {
    color: '#999',
    fontSize: 11,
    marginBottom: 6,
    fontFamily: FONTS.body,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: '#666',
    fontSize: 10,
    fontFamily: FONTS.body,
  },

  // Ad Container
  adContainer: {
    width: '100%',
    marginBottom: 16,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: FONTS.body,
  },

  // Tab Indicator
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  activeTabLine: {
    height: '100%',
    backgroundColor: COLORS.cyan,
    width: '50%',
  },
});
