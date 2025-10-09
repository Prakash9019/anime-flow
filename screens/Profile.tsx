// screens/Profile.tsx
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
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import StarRating from '../components/StarRating';

interface UserRating {
  _id: string;
  anime: {
    _id: string;
    title: string;
    poster: string;
  };
  rating: number;
  createdAt: string;
}

export default function Profile(): React.ReactElement {
  const { user, logout } = useAuth();
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserRatings();
    }
  }, [user]);

  // screens/Profile.tsx (update fetchUserRatings function)
const fetchUserRatings = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${ApiService.baseURL}/user/ratings`, {
      headers: await ApiService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setUserRatings(data.ratings || []);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    // You could show an alert or toast here
  } finally {
    setLoading(false);
  }
};


  const handleLogout = async () => {
    await logout();
    // Navigation will be handled automatically by auth state change
  };

  const renderRatingItem = ({ item }: { item: UserRating }) => (
    <View style={styles.ratingCard}>
      <Image source={{ uri: item.anime.poster }} style={styles.ratingPoster} />
      <View style={styles.ratingInfo}>
        <Text style={styles.ratingTitle} numberOfLines={2}>
          {item.anime.title}
        </Text>
        <StarRating rating={item.rating} />
        <Text style={styles.ratingDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Please sign in to view profile</Text>
      </View>
    );
  }

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
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" color="#666" size={40} />
              )}
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" color={COLORS.text} size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* My Ratings Section */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Ratings</Text>
          <Text style={styles.ratingCount}>
            {userRatings.length} {userRatings.length === 1 ? 'Rating' : 'Ratings'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.cyan} size="large" style={styles.loader} />
        ) : userRatings.length > 0 ? (
          <FlatList
            data={userRatings}
            renderItem={renderRatingItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ratingsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" color="#666" size={48} />
            <Text style={styles.emptyText}>No ratings yet</Text>
            <Text style={styles.emptySubtext}>
              Start rating anime to see them here
            </Text>
          </View>
        )}
      </View>

      {/* Bottom tabs */}
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
  header: { height: 220 },
  bgImage: { flex: 1, justifyContent: 'space-between' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  profileInfo: { alignItems: 'center', padding: 20, marginTop: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#333', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
    borderWidth: 3, borderColor: COLORS.cyan,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  name: {
    color: COLORS.text, fontSize: 22,
    fontFamily: FONTS.title, fontWeight: 'bold', marginBottom: 4,
  },
  email: {
    color: '#999', fontSize: 14,
    fontFamily: FONTS.body,
  },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-end', margin: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.text, marginLeft: 8,
    fontSize: 14, fontFamily: FONTS.body,
  },
  content: { flex: 1, padding: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text, fontSize: 24,
    fontFamily: FONTS.title, fontWeight: 'bold',
  },
  ratingCount: {
    color: COLORS.cyan, fontSize: 14,
    fontFamily: FONTS.body,
  },
  ratingsList: { paddingBottom: 20 },
  ratingCard: {
    flexDirection: 'row', backgroundColor: '#1A1A1A',
    borderRadius: 12, padding: 12, marginBottom: 12,
  },
  ratingPoster: { width: 60, height: 80, borderRadius: 8, marginRight: 12 },
  ratingInfo: { flex: 1, justifyContent: 'space-between' },
  ratingTitle: {
    color: COLORS.text, fontSize: 16,
    fontFamily: FONTS.body, fontWeight: 'bold',
  },
  ratingDate: {
    color: '#666', fontSize: 12,
    fontFamily: FONTS.body,
  },
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text, fontSize: 18,
    fontFamily: FONTS.title, marginTop: 16,
  },
  emptySubtext: {
    color: '#666', fontSize: 14,
    fontFamily: FONTS.body, marginTop: 8, textAlign: 'center',
  },
  loader: { marginTop: 40 },
  errorText: {
    color: COLORS.text, fontSize: 16,
    fontFamily: FONTS.body, textAlign: 'center',
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
