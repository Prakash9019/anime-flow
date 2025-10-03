import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../theme';
import ApiService from '../services/api';
import StarRating from '../components/StarRating';

export default function Profile(): React.ReactElement {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService.init().then(async () => {
      const res = await ApiService.getAnimeList(); // user-specific list from backend
      setList(res.anime);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardSeason}>{item.seasonLabel || ''}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <StarRating rating={item.userRating || 0} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ImageBackground
          source={require('../assets/images/bg-collage.jpg')}
          style={styles.bgImage}
        >
          <View style={styles.overlay} />
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" color="#666" size={40} />
            </View>
            <Text style={styles.name}>{/* Replace with user name */}Praneeth Kumar</Text>
          </View>
        </ImageBackground>
      </View>

      {/* My Ratings */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>My Ratings</Text>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        />
        <TouchableOpacity style={styles.cardEmpty}>
          <Ionicons name="add" size={32} color="#666" />
          <Text style={styles.emptyText}>RATE NEW EPISODE</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <View style={styles.indicator} />
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="home-outline" color="#999" size={22} />
          <Text style={[styles.tabText, { color: '#999' }]}>Home</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="person" color={COLORS.cyan} size={22} />
          <Text style={[styles.tabText, { color: COLORS.cyan }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { height: 200 },
  bgImage: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  profileInfo: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#333', alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
    borderWidth: 2, borderColor: '#444',
  },
  name: {
    color: COLORS.text, fontSize: 20,
    fontFamily: FONTS.title, fontWeight: 'bold',
  },
  content: { padding: 16 },
  sectionTitle: {
    color: COLORS.text, fontSize: 24,
    fontFamily: FONTS.title, marginBottom: 16,
  },
  grid: { paddingRight: 16 },
  card: {
    width: 140, marginRight: 16,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    overflow: 'hidden',
  },
  poster: { width: '100%', height: 180, resizeMode: 'cover' },
  cardOverlay: {
    padding: 8, backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cardSeason: {
    color: COLORS.cyan, fontSize: 12,
    fontFamily: FONTS.body, marginBottom: 4,
  },
  cardTitle: {
    color: COLORS.text, fontSize: 14,
    fontFamily: FONTS.title, fontWeight: 'bold',
    marginBottom: 6,
  },
  cardEmpty: {
    width: 140, height: 200, borderRadius: 12,
    borderWidth: 2, borderColor: '#444', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  emptyText: {
    color: '#666', fontSize: 12,
    fontFamily: FONTS.body, marginTop: 8,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row', height: 60,
    backgroundColor: '#111', alignItems: 'center',
  },
  indicator: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 4, backgroundColor: COLORS.cyan,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, fontFamily: FONTS.body, marginTop: 4 },
  divider: { width: 1, height: '60%', backgroundColor: '#333' },
});
