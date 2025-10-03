import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../theme';
import ApiService from '../services/api';

export default function Home({ navigation }: any) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const res = await ApiService.getAnimeList();
    setList(res.anime);
    setLoading(false);
  };

  useEffect(() => {
    ApiService.init().then(fetchList);
  }, []);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) return fetchList();
    setSearching(true);
    const res = await ApiService.getAnimeList(); // replace with search endpoint if exists
    setList(res.anime.filter(a => a.title.toLowerCase().includes(text.toLowerCase())));
    setSearching(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Detail', { anime: item })
      }
    >
      <Image source={{ uri: item.poster }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading || searching) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ANIME FLOW</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" color="#666" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search anime..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20,
  },
  title: {
    color: COLORS.cyan, fontFamily: FONTS.title,
    fontSize: 24, fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', margin: 20,
    padding: 12, borderRadius: 12,
  },
  searchInput: {
    flex: 1, marginLeft: 12, color: COLORS.text, fontSize: 16,
  },
  list: { paddingHorizontal: 16 },
  card: {
    flex: 1, margin: 8, backgroundColor: '#1A1A1A',
    borderRadius: 12, overflow: 'hidden',
  },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  cardTitle: {
    color: COLORS.text, fontFamily: FONTS.body,
    fontSize: 14, padding: 8,
  },
});
