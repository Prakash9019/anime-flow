// admin/screens/EditContent.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../components/AdminHeader';
import { COLORS, FONTS } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminParamList } from '../navigation/AdminStack';

type EditNavProp = NativeStackNavigationProp<AdminParamList, 'EditContent'>;

const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const shows = [
  'Solo Levelling',
  'Naruto',
  'Demon’s Slayer',
  'Attack on Titan',
  'One Piece',
  'Death Note',
  'Hunter X Hunter',
  'Dragon Ball Z',
];

export default function EditContent(): React.ReactElement {
  const navigation = useNavigation<EditNavProp>();
  const [season, setSeason] = useState('WINTER');

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Edit Existing Anime Content" showBack />
      <ScrollView style={styles.content}>
        {/* Season dropdown */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{season}</Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>

        {/* List of shows */}
        <FlatList
          data={shows}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('Dashboard') /* or navigate into detail flow */
              }
            >
              <Text style={styles.itemText}>{item}</Text>
              <Text style={styles.itemIcon}>▸</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
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
  chevron: { color: '#999', fontSize: 18 },
  item: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: { color: COLORS.text, fontFamily: FONTS.body },
  itemIcon: { color: '#999', fontSize: 18 },
  sep: { height: 12 },
});
