// components/AdBanner.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { COLORS, FONTS } from '../theme';
import ApiService from '../services/api';

interface Ad {
  _id: string;
  title: string;
  description: string;
  bannerImage: string;
  ctaText: string;
  targetUrl?: string;
}

export default function AdBanner() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      const response = await fetch(`${ApiService.baseURL}/ads/active`);
      const data = await response.json();
      
      if (data.ads && data.ads.length > 0) {
        const randomAd: Ad = data.ads[0];
        setAd(randomAd);
        trackView(randomAd._id);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (adId: string) => {
    try {
      await fetch(`${ApiService.baseURL}/ads/${adId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleAdClick = async () => {
    if (!ad) return;

    try {
      const response = await fetch(`${ApiService.baseURL}/ads/${ad._id}/click`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (ad.targetUrl) {
        const supported = await Linking.canOpenURL(ad.targetUrl);
        if (supported) {
          await Linking.openURL(ad.targetUrl);
        }
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading || !ad) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.adLabel}>Advertisement</Text>
      <View style={styles.adContent}>
        <Image 
          source={{ uri: ad.bannerImage }}
          style={styles.adImage}
          resizeMode="cover"
        />
        <Text style={styles.adTitle}>{ad.title}</Text>
        <Text style={styles.adDescription} numberOfLines={2}>
          {ad.description}
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleAdClick}>
          <Text style={styles.ctaText}>{ad.ctaText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  adLabel: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 4,
    backgroundColor: '#333',
    fontFamily: FONTS.body,
  },
  adContent: {
    padding: 16,
    alignItems: 'center',
  },
  adImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  adTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  adDescription: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: FONTS.body,
  },
  ctaButton: {
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontFamily: FONTS.body,
  },
});
