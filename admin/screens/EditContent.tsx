// admin/screens/EditContent.tsx (updated)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

export default function EditContent(): React.ReactElement {
  const navigation = useNavigation();
  const [season, setSeason] = useState('WINTER');
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    fetchAnimeList();
  }, []);

  const fetchAnimeList = async () => {
    try {
      const response = await ApiService.getAnimeList();
      setAnimeList(response.anime || []);
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // Navigate to edit detail or handle edit
        console.log('Edit anime:', item.title);
      }}
    >
      <Text style={styles.itemText}>{item.title}</Text>
      <Ionicons name="chevron-forward" color="#999" size={18} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Existing Anime Content</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{season}</Text>
          <Ionicons name="chevron-down" color="#999" size={18} />
        </TouchableOpacity>

        <FlatList
          data={animeList}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginLeft: 16,
  },
  content: { padding: 20 },
  dropdown: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dropdownText: { color: COLORS.text, fontFamily: FONTS.body, fontSize: 16 },
  item: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: { color: COLORS.text, fontFamily: FONTS.body, fontSize: 16 },
  separator: { height: 12 },
});
