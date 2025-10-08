// screens/Detail.tsx (UPDATE)
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';
import { HomeStackParamList } from '../types';
import RatingModal from '../components/RatingModal';

type DetailRouteProp = RouteProp<HomeStackParamList, 'Detail'>;

interface Episode {
  _id: string;
  number: number;
  title: string;
  synopsis: string;
  airDate: string;
  averageRating: number;
}

export default function Detail(): React.ReactElement {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const [animeData, setAnimeData] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  const animeId = route.params.anime.id;

  useEffect(() => {
    loadAnimeDetails();
  }, [animeId]);

  const loadAnimeDetails = async () => {
    try {
      const data = await ApiService.getAnimeById(animeId);
      setAnimeData(data);
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error loading anime details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodePress = (episode: Episode) => {
    setSelectedEpisode(episode._id);
    setRatingModalVisible(true);
  };

  const renderEpisode = ({ item }: { item: Episode }) => (
    <TouchableOpacity 
      style={styles.episodeCard}
      onPress={() => handleEpisodePress(item)}
    >
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeNumber}>Episode {item.number}</Text>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        {item.synopsis && (
          <Text style={styles.episodeSynopsis} numberOfLines={2}>
            {item.synopsis}
          </Text>
        )}
        <View style={styles.episodeFooter}>
          {item.airDate && (
            <Text style={styles.episodeDate}>
              {new Date(item.airDate).toLocaleDateString()}
            </Text>
          )}
          {item.averageRating > 0 && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" color="#FFD700" size={14} />
              <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.rateButton}
        onPress={() => handleEpisodePress(item)}
      >
        <Ionicons name="star-outline" color={COLORS.cyan} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" color={COLORS.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Anime Details</Text>
        </View>

        {/* Anime Info */}
        <View style={styles.animeInfo}>
          <Image
            source={{ uri: animeData?.poster }}
            style={styles.poster}
          />
          <View style={styles.infoText}>
            <Text style={styles.title}>{animeData?.title}</Text>
            {animeData?.titleEnglish && (
              <Text style={styles.englishTitle}>{animeData.titleEnglish}</Text>
            )}
            <Text style={styles.synopsis}>{animeData?.synopsis}</Text>
          </View>
        </View>

        {/* Episodes List */}
        <View style={styles.episodesSection}>
          <Text style={styles.sectionTitle}>
            Episodes ({episodes.length})
          </Text>
          {episodes.length > 0 ? (
            <FlatList
              data={episodes}
              renderItem={renderEpisode}
              keyExtractor={item => item._id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={styles.noEpisodes}>No episodes available</Text>
          )}
        </View>
      </ScrollView>

      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        episodeId={selectedEpisode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginLeft: 16,
  },
  animeInfo: {
    flexDirection: 'row',
    padding: 20,
  },
  poster: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginRight: 16,
  },
  infoText: { flex: 1 },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  englishTitle: {
    color: '#999',
    fontSize: 16,
    marginBottom: 8,
  },
  synopsis: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
  },
  episodesSection: { padding: 20 },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  episodeInfo: { flex: 1 },
  episodeNumber: {
    color: COLORS.cyan,
    fontSize: 12,
    fontFamily: FONTS.body,
    fontWeight: 'bold',
  },
  episodeTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  episodeSynopsis: {
    color: '#999',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  episodeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episodeDate: {
    color: '#666',
    fontSize: 11,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    marginLeft: 4,
  },
  rateButton: {
    padding: 8,
  },
  separator: { height: 12 },
  noEpisodes: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
