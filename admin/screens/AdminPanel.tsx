// admin/screens/AdminPanel.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../theme';

const adminMenuItems = [
  { title: 'Post Anime Content', screen: 'PostAnimeContent', icon: 'add-circle' },
  { title: 'Edit Existing Anime Content', screen: 'EditContent', icon: 'create' },
  { title: 'Bulk Upload', screen: 'BulkUpload', icon: 'cloud-upload' },
  { title: 'Bulk Edit', screen: 'BulkEdit', icon: 'create-outline' },
  { title: 'Manage Account', screen: 'ManageAccount', icon: 'person-circle' },
  { title: 'Create Employees', screen: 'CreateEmployee', icon: 'people' },
];

export default function AdminPanel(): React.ReactElement {
  const navigation = useNavigation();

  const handleMenuPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.menuContainer}>
        {adminMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} color={COLORS.text} size={24} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" color="#666" size={20} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
    marginLeft: 16,
  },
});
