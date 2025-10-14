// admin/screens/ManageAds.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

export default function ManageAds(): React.ReactElement {
  const navigation = useNavigation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`${ApiService.baseURL}/ads/admin`, {
        headers: await ApiService.getAuthHeaders(),
      });
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch ads');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleAdStatus = async (adId, currentStatus) => {
    try {
      const response = await fetch(`${ApiService.baseURL}/ads/${adId}`, {
        method: 'PUT',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchAds();
        Alert.alert('Success', `Ad ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update ad status');
    }
  };

  const renderAdItem = ({ item }) => (
    <View style={styles.adCard}>
      <Image source={{ uri: item.bannerImage }} style={styles.adImage} />
      <View style={styles.adInfo}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.adStats}>
          <Text style={styles.statText}>Views: {item.currentViews}/{item.targetUsers}</Text>
          <Text style={styles.statText}>Clicks: {item.clicks}</Text>
        </View>
        <View style={styles.adActions}>
          <TouchableOpacity
            style={[styles.actionButton, item.isActive ? styles.deactivateButton : styles.activateButton]}
            onPress={() => toggleAdStatus(item._id, item.isActive)}
          >
            <Text style={styles.actionButtonText}>
              {item.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Ads</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAds')}>
          <Ionicons name="add" color={COLORS.cyan} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ads}
        renderItem={renderAdItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAds(true)}
            colors={[COLORS.cyan]}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
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
  },
  listContent: {
    padding: 20,
  },
  adCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 120,
  },
  adInfo: {
    padding: 16,
  },
  adTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  adStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    color: COLORS.cyan,
    fontSize: 12,
  },
  adActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activateButton: {
    backgroundColor: COLORS.cyan,
  },
  deactivateButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
