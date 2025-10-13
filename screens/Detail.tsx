// screens/Detail.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';
import RatingModal from '../components/RatingModal';

type RootRouteParamList = {
  Detail: {
    anime: {
      id?: string;
      _id?: string;
      title?: string;
      poster?: string;
    };
  };
};

type DetailRouteProp = RouteProp<RootRouteParamList, 'Detail'>;

interface Episode {
  _id: string;
  number: number;
  title: string;
  thumbnail?: string;
  synopsis: string;
  airDate: string;
  averageRating: number;
  userRatings: Array<{
    user: string;
    rating: number;
  }>;
}

interface AnimeData {
  _id: string;
  title: string;
  poster: string;
  episodes: Episode[];
  averageRating: number;
  synopsis?: string;
}

export default function Detail(): React.ReactElement {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');
  const [synopsisModalVisible, setSynopsisModalVisible] = useState(false);
  const [selectedSynopsis, setSelectedSynopsis] = useState('');

  const animeId = route.params?.anime?.id || route.params?.anime?._id;

  useEffect(() => {
    if (animeId) {
      loadAnimeDetails();
    } else {
      Alert.alert('Error', 'No anime selected', [
        { text: 'Go Back', onPress: () => navigation.goBack() }
      ]);
    }
  }, [animeId]);

  const loadAnimeDetails = async () => {
    if (!animeId) return;
    setLoading(true);
    try {
      const data = await ApiService.getAnimeById(animeId);
      setAnimeData(data);
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error loading anime details:', error);
      Alert.alert('Error', 'Failed to load anime details');
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeRating = (episode: Episode) => {
    setSelectedEpisode(episode._id);
    setRatingModalVisible(true);
  };

  const handleCheckSynopsis = (episode: Episode) => {
    if (!episode.synopsis || episode.synopsis.trim() === '') {
      Alert.alert('No Synopsis', 'Synopsis not available for this episode.');
      return;
    }
    setSelectedSynopsis(episode.synopsis);
    setSynopsisModalVisible(true);
  };

  const onRatingSubmitted = () => {
    loadAnimeDetails();
    setRatingModalVisible(false);
  };

  const formatRating = (rating: number) => rating ? `${rating.toFixed(1)}/10` : 'Not rated';

  const renderEpisode = ({ item }: { item: Episode }) => (
    <View style={styles.episodeCard}>
      <Image
        source={{ uri: item.thumbnail || animeData?.poster }}
        style={styles.episodeThumbnail}
      />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeAirDate}>
          {item.airDate ? new Date(item.airDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase() : 'TBA'}
        </Text>
        <Text style={styles.episodeTitle}>
          E{item.number} • {item.title}
        </Text>
        <TouchableOpacity
          style={styles.synopsisButton}
          onPress={() => handleCheckSynopsis(item)}
        >
          <Text style={styles.synopsisButtonText}>Check Synopsis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => handleEpisodeRating(item)}
        >
          <Text style={styles.rateButtonText}>RATE EPISODE</Text>
        </TouchableOpacity>
        {item.averageRating > 0 && (
          <View style={styles.ratingDisplay}>
            <Ionicons name="star" color="#FFD700" size={16} />
            <Text style={styles.ratingText}>
              {formatRating(item.averageRating)} ({item.userRatings?.length || 0})
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
        <Text style={styles.loadingText}>Loading anime details...</Text>
      </View>
    );
  }

  if (!animeData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Anime not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {animeData.title}
        </Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Season Selector */}
        <View style={styles.seasonSelector}>
          <TouchableOpacity style={styles.seasonDropdown}>
            <Text style={styles.seasonText}>Season 1</Text>
            <Ionicons name="chevron-down" color={COLORS.text} size={16} />
          </TouchableOpacity>
          <Text style={styles.episodeCount}>{episodes.length} Episodes</Text>
        </View>

        {/* Episodes List */}
        {episodes.length > 0 ? (
          <FlatList
            data={episodes}
            renderItem={renderEpisode}
            keyExtractor={item => item._id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.episodesList}
          />
        ) : (
          <View style={styles.noEpisodes}>
            <Ionicons name="film-outline" color="#666" size={48} />
            <Text style={styles.noEpisodesText}>No episodes available</Text>
          </View>
        )}
      </ScrollView>

      {/* Rating Modal */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        episodeId={selectedEpisode}
        onRatingSubmitted={onRatingSubmitted}
      />

      {/* Synopsis Modal */}
      <Modal
        visible={synopsisModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSynopsisModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.synopsisModal}>
            <View style={styles.synopsisHeader}>
              <Text style={styles.synopsisTitle}>Episode Synopsis</Text>
              <TouchableOpacity onPress={() => setSynopsisModalVisible(false)}>
                <Ionicons name="close" color={COLORS.text} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.synopsisContent}>
              <Text style={styles.synopsisText}>{selectedSynopsis}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#666', marginTop: 12, fontSize: 14 },
  errorText: { color: COLORS.text, fontSize: 16, marginBottom: 16 },
  backButton: { 
    backgroundColor: COLORS.cyan, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  backButtonText: { color: COLORS.black, fontWeight: 'bold' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },

  content: { flex: 1 },
  seasonSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  seasonDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  seasonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    marginRight: 8,
  },
  episodeCount: {
    color: COLORS.text,
    fontSize: 16,
  },

  episodesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  episodeThumbnail: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  episodeAirDate: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: FONTS.body,
  },
  episodeTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  synopsisButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  synopsisButtonText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  rateButtonText: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    marginLeft: 4,
  },
  separator: { height: 16 },
  noEpisodes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noEpisodesText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  synopsisModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
  },
  synopsisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  synopsisTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  synopsisContent: {
    padding: 20,
  },
  synopsisText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.body,
  },
});
