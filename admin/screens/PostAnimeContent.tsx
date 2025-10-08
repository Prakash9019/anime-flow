// admin/screens/PostAnimeContent.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

export default function PostAnimeContent(): React.ReactElement {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    synopsis: '',
    poster: '',
    type: 'TV',
    status: 'Airing',
    genres: '',
    studios: '',
    source: '',
    numEpisodes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      const animeData = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()),
        studios: formData.studios.split(',').map(s => s.trim()),
        numEpisodes: parseInt(formData.numEpisodes) || 0,
      };

      await ApiService.createAnime(animeData);
      Alert.alert('Success', 'Anime posted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post anime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Post Anime Content</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
            placeholder="Enter anime title"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>English Title</Text>
          <TextInput
            style={styles.input}
            value={formData.titleEnglish}
            onChangeText={(text) => setFormData({...formData, titleEnglish: text})}
            placeholder="Enter English title"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Synopsis</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.synopsis}
            onChangeText={(text) => setFormData({...formData, synopsis: text})}
            placeholder="Enter synopsis"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Poster URL</Text>
          <TextInput
            style={styles.input}
            value={formData.poster}
            onChangeText={(text) => setFormData({...formData, poster: text})}
            placeholder="Enter poster URL"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(text) => setFormData({...formData, type: text})}
            placeholder="TV, Movie, OVA, etc."
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Status</Text>
          <TextInput
            style={styles.input}
            value={formData.status}
            onChangeText={(text) => setFormData({...formData, status: text})}
            placeholder="Airing, Completed, Upcoming"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Genres (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.genres}
            onChangeText={(text) => setFormData({...formData, genres: text})}
            placeholder="Action, Adventure, Drama"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Studios (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.studios}
            onChangeText={(text) => setFormData({...formData, studios: text})}
            placeholder="Studio A, Studio B"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Number of Episodes</Text>
          <TextInput
            style={styles.input}
            value={formData.numEpisodes}
            onChangeText={(text) => setFormData({...formData, numEpisodes: text})}
            placeholder="24"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Posting...' : 'POST ANIME'}
            </Text>
          </TouchableOpacity>
        </View>
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
  content: { flex: 1 },
  form: { padding: 20 },
  label: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.body,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});
