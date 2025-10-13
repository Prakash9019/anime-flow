// components/AdBanner.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function AdBanner() {
  const handleAdClick = () => {
    // Handle ad click - could open browser, navigate to ad content, etc.
    console.log('Ad clicked');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.adLabel}>Advertisement</Text>
      <View style={styles.adContent}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/300x150/333/fff?text=Your+Ad+Here' }}
          style={styles.adImage}
        />
        <Text style={styles.adTitle}>Support Anime Flow</Text>
        <Text style={styles.adDescription}>
          Help us keep the app running by supporting our sponsors
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleAdClick}>
          <Text style={styles.ctaText}>Learn More</Text>
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
