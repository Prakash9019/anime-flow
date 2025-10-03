// screens/PostAnimeContent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../components/AdminHeader';
import FormInput from '../components/FormInput';
import { COLORS, FONTS } from '../../theme';

export default function PostAnimeContent() {
  const [selectedMonth, setSelectedMonth] = useState('OCTOBER');
  const [animeTitle, setAnimeTitle] = useState('');
  const [seasons, setSeasons] = useState('2');
  const [episodes, setEpisodes] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(1);

  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const renderPosterGrid = () => {
    const posters = Array.from({ length: 13 }, (_, i) => i + 1);
    
    return (
      <View style={styles.posterGrid}>
        {posters.map((index) => (
          <View key={index} style={styles.posterItem}>
            {index <= 12 ? (
              <Image 
                source={require('../assets/images/sample-poster.jpg')} 
                style={styles.poster}
              />
            ) : (
              <TouchableOpacity style={styles.addPoster}>
                <Text style={styles.addIcon}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Post Anime Content" showBack />
      
      <ScrollView style={styles.content}>
        <FormInput
          label="Select Month"
          value={selectedMonth}
          dropdown
          options={months}
          onSelect={setSelectedMonth}
        />

        <FormInput
          label="Title of the Anime"
          placeholder="Enter Anime Title"
          value={animeTitle}
          onChangeText={setAnimeTitle}
        />

        <FormInput
          label="No of Seasons"
          value={seasons}
          dropdown
          options={['1', '2', '3', '4', '5']}
          onSelect={setSeasons}
        />

        <FormInput
          label="Episode Count"
          placeholder="Write using commas (e.g., 13, 15)"
          value={episodes}
          onChangeText={setEpisodes}
        />

        <View style={styles.posterSection}>
          <Text style={styles.sectionTitle}>Add Episode Posters</Text>
          
          <View style={styles.seasonTabs}>
            <TouchableOpacity 
              style={[styles.seasonTab, selectedSeason === 1 && styles.activeTab]}
              onPress={() => setSelectedSeason(1)}
            >
              <Text style={[styles.tabText, selectedSeason === 1 && styles.activeTabText]}>
                SEASON 1
              </Text>
            </TouchableOpacity>
            <Text style={styles.posterCount}>13 Posters Added</Text>
          </View>

          {renderPosterGrid()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  posterSection: {
    marginTop: 30,
  },
  sectionTitle: {
    color: COLORS.cyan,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginBottom: 20,
  },
  seasonTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seasonTab: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.cyan,
  },
  tabText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: COLORS.black,
  },
  posterCount: {
    color: '#999',
    fontSize: 14,
  },
  posterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  posterItem: {
    width: '18%',
    aspectRatio: 0.7,
    marginBottom: 10,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  addPoster: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: '#555',
    fontSize: 24,
  },
});
