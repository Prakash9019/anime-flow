// screens/Detail.tsx
import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, Episode } from '../types';
import { COLORS } from '../theme';
import HeaderBack from '../components/HeaderBack';
import EpisodeCard from '../components/EpisodeCard';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

const SeasonHeader: React.FC = () => (
  <View style={styles.seasonRow}>
    <View style={styles.seasonBtn}>
      <Text style={{ color: '#000', fontWeight: '800' }}>Season 1 ▾</Text>
    </View>
    <Text style={styles.count}>12 Episodes</Text>
  </View>
);

export default function Detail({ navigation, route }: Props): React.ReactElement {
  const { anime } = route.params;

  const renderEpisode = ({ item }: { item: Episode }) => (
    <EpisodeCard episode={item} />
  );

  return (
    <View style={styles.container}>
      <HeaderBack title={anime.title} onBack={() => navigation.goBack()} />
      <FlatList
        data={anime.episodes}
        keyExtractor={(item) => item.id}
        renderItem={renderEpisode}
        ListHeaderComponent={<SeasonHeader />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  seasonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10 
  },
  seasonBtn: { 
    backgroundColor: COLORS.cyan, 
    borderRadius: 10, 
    paddingVertical: 8, 
    paddingHorizontal: 12 
  },
  count: { 
    color: '#8E8E93' 
  }
});
