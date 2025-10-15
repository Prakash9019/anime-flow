import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

// Define expected structure for an anime
interface AnimeItem {
  _id: string;
  title: string;
  synopsis: string;
  poster?: string;
  status?: string;
  genres?: string[];
  [key: string]: any;
}

export default function EditAnimeContent() {
    const navigation = useNavigation();
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<AnimeItem>>({});

  useEffect(() => {
    fetchAnimeList();
  }, []);

  const fetchAnimeList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ApiService.baseURL}/anime?limit=100`, {
        headers: await ApiService.getAuthHeaders(),
      });
      const data = await res.json();
      setAnimeList(data.anime || []);
    } catch (e) {
      Alert.alert('Error', 'Failed to load anime list');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimeDetail = async (animeId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${ApiService.baseURL}/anime/${animeId}`, {
        headers: await ApiService.getAuthHeaders(),
      });
      const data = await res.json();
      setSelectedAnime(data);
      setEditData(data);  // Start edit form with all fields filled
    } catch (e) {
      Alert.alert('Error', 'Could not load anime data');
    } finally {
      setLoading(false);
    }
  };

  const saveAnimeEdits = async () => {
    if (!selectedAnime) return;
    setSaving(true);
    try {
      const res = await fetch(`${ApiService.baseURL}/anime/${selectedAnime._id}`, {
        method: 'PUT',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      const result = await res.json();
      if (res.ok) {
        // Success
        Alert.alert('Success', 'Anime updated.');
        setSelectedAnime(result.anime);
        fetchAnimeList(); // Refresh the list with new data
      } else {
        Alert.alert('Error', result.message || 'Failed to update anime.');
      }
    } catch (e) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
        <Text style={{ color: COLORS.text, marginTop: 20 }}>Loading...</Text>
      </View>
    );
  }

  // -------------------- MAIN UI ------------------------
  return (
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Existing Anime Content</Text>
      </View>
    <View style={{ flex: 1, backgroundColor: COLORS.black, padding: 16 }}>
      {!selectedAnime ? (
        // Anime List
        <FlatList
          data={animeList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#181818',
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => fetchAnimeDetail(item._id)}
            >
              <Ionicons name="chevron-forward-circle" color={COLORS.cyan} size={22} />
              <Text style={{ color: COLORS.text, marginLeft: 16, fontSize: 16 }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        // Edit Form
        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => setSelectedAnime(null)}
          >
            <Ionicons name="arrow-back" color={COLORS.cyan} size={24} />
            <Text style={{ color: COLORS.cyan, marginLeft: 8 }}>Back to List</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={editData.title || ""}
            onChangeText={(txt) => setEditData((prev) => ({ ...prev, title: txt }))}
          />

          {/* Synopsis */}
          <Text style={styles.label}>Synopsis</Text>
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
            value={editData.synopsis || ""}
            onChangeText={(txt) => setEditData((prev) => ({ ...prev, synopsis: txt }))}
            multiline
            numberOfLines={5}
          />

          {/* Genres */}
          <Text style={styles.label}>Genres (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={(editData.genres && editData.genres.join(", ")) || ""}
            onChangeText={(txt) =>
              setEditData((prev) => ({
                ...prev,
                genres: txt.split(",").map((g) => g.trim()).filter(Boolean)
              }))
            }
          />

          {/* Status */}
          <Text style={styles.label}>Status</Text>
          <TextInput
            style={styles.input}
            value={editData.status || ""}
            onChangeText={(txt) => setEditData((prev) => ({ ...prev, status: txt }))}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.saveBtn, { opacity: saving ? 0.7 : 1 }]}
            onPress={saveAnimeEdits}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
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
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },content: { padding: 20 },
  label: {
    color: COLORS.cyan,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    alignItems: "center",
    padding: 16,
    marginTop: 12,
  },
  saveBtnText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: 16,
  },
});
