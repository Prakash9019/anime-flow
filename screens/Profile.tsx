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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import StarRating from '../components/StarRating';
import DonationModal from '../components/DonationModal';

interface UserRating {
  _id: string;
  episode: {
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
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("hiiii");
      fetchUserRatings();
      checkAdFreeStatus();
    }
  }, [user]);

  const checkAdFreeStatus = async () => {
    try {
      const response = await fetch(`${ApiService.baseURL}/user/ad-free-status`, {
        headers: await ApiService.getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAdFree(data.isAdFree || false);
      }
    } catch (error) {
      console.error('Error checking ad-free status:', error);
      // Default to showing ads if we can't check status
      setIsAdFree(false);
    }
  };

  const fetchUserRatings = async () => {
    setLoading(true);
    try {
      const headers = await ApiService.getAuthHeaders();
        console.log("Headers for /user/ratings:", headers);

        const response = await fetch(`${ApiService.baseURL}/user/ratings`, {
            method: 'GET',
            headers: headers, // Use the logged headers
        });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUserRatings(data.ratings || []);
      } else if (response.status === 404) {
        // Endpoint not found, use mock data or empty array
        console.log('User ratings endpoint not found, using empty array');
        setUserRatings([]);
      }
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      // Use mock data for demonstration
      const mockRatings: UserRating[] = [
        {
          _id: '1',
          episode: {
            _id: '1',
            title: 'Attack on Titan',
            poster: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg'
          },
          rating: 9,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          episode: {
            _id: '2',
            title: 'Demon Slayer',
            poster: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg'
          },
          rating: 8,
          createdAt: new Date().toISOString()
        }
      ];
      setUserRatings(mockRatings);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSuccess = () => {
    setIsAdFree(true);
    Alert.alert(
      'Thank You!', 
      'You now have lifetime ad-free access to Anime Flow!',
      [{ text: 'Awesome!', style: 'default' }]
    );
    checkAdFreeStatus(); // Refresh status from server
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const renderRatingItem = ({ item }: { item: UserRating }) => (
    <View style={styles.ratingCard}>
      <Image source={{ uri: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' }} style={styles.ratingPoster} />
      <View style={styles.ratingInfo}>
        <Text style={styles.ratingTitle} numberOfLines={2}>
          {item.episode.title}
        </Text>
        <StarRating rating={item.rating} size={16} />
        <Text style={styles.ratingDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderEmptyRatings = () => (
    <View style={styles.emptyState}>
      <Ionicons name="star-outline" color="#666" size={48} />
      <Text style={styles.emptyText}>No ratings yet</Text>
      <Text style={styles.emptySubtext}>
        Start rating anime to see them here
      </Text>
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
            {isAdFree && (
              <View style={styles.adFreeBadge}>
                <Ionicons name="star" color="#FFD700" size={16} />
                <Text style={styles.adFreeText}>Ad-Free Member</Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            {!isAdFree && (
              <TouchableOpacity 
                style={styles.donateButton} 
                onPress={() => setDonationModalVisible(true)}
              >
                <Ionicons name="heart-outline" color={COLORS.text} size={20} />
                <Text style={styles.donateText}>Donate</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" color={COLORS.text} size={20} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
            ListEmptyComponent={renderEmptyRatings}
          />
        ) : (
          renderEmptyRatings()
        )}
      </View>

     

      {/* Donation Modal */}
      <DonationModal
        visible={donationModalVisible}
        onClose={() => setDonationModalVisible(false)}
        onSuccess={handleDonationSuccess}
      />
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
  errorText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
    textAlign: 'center',
  },

  // Header
  header: {
    height: 240,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.cyan,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  name: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#999',
    fontSize: 14,
    fontFamily: FONTS.body,
    marginBottom: 8,
  },
  adFreeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  adFreeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: FONTS.body,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    margin: 20,
    gap: 12,
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  donateText: {
    color: COLORS.text,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.body,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.text,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.body,
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  ratingCount: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.body,
  },

  // Ratings List
  ratingsList: {
    paddingBottom: 20,
  },
  ratingCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  ratingPoster: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  ratingInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ratingTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingDate: {
    color: '#666',
    fontSize: 12,
    fontFamily: FONTS.body,
    marginTop: 8,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: FONTS.body,
  },
  loader: {
    marginTop: 40,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.cyan,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#333',
  },
});
