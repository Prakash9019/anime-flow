import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

export default function BulkUpload(): React.ReactElement {
  const navigation = useNavigation();
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

const handlePickFile = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: 'text/csv',
    copyToCacheDirectory: false,
    multiple: false,
  });
  if (!res.canceled && res.assets && res.assets.length > 0) {
    setFile(res.assets[0]);
  }
};

  const handleUpload = async () => {
    if (!file) return Alert.alert('Please select a CSV file first');
    setUploading(true);
    try {
      const fileToSend =
        Platform.OS === 'web'
          ? file
          : {
              uri: file.uri,
              name: file.name,
              type: 'text/csv',
            };

      await ApiService.bulkUpload(fileToSend);
      Alert.alert('Success', 'Bulk upload complete', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      setFile(null);
    } catch (e) {
      Alert.alert('Bulk upload failed', 'Could not upload file.');
    }
    setUploading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Bulk Upload</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.instructions}>
          1. Download the skeleton file and fill it with proper data.{'\n'}
          2. Upload the skeleton file below and submit.{'\n'}
          3. For multiple options/answers, separate items with a comma.
        </Text>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => {/* implement download if needed */}}
          >
          <Text style={styles.downloadText}>Download Skeleton File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={handlePickFile}
          activeOpacity={0.85}
        >
          <Ionicons name="document-outline" color="#666" size={40} />
          <Text style={styles.uploadText}>
            {file?.name || 'Drag and drop files or Browse'}
            {"\n"}
            <Text style={{ color: COLORS.cyan }}>Supported Format : CSV Only</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, { opacity: uploading ? 0.7 : 1 }]}
          onPress={handleUpload}
          disabled={uploading}
        >
          <Text style={styles.submitText}>
            {uploading ? 'Uploading...' : 'Upload File'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
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
  instructions: {
    color: COLORS.text,
    fontFamily: FONTS.body,
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadBtn: {
    backgroundColor: COLORS.cyan,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  downloadText: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: 16,
  },
  uploadArea: {
    height: 160,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    color: '#666',
    fontFamily: FONTS.body,
    textAlign: 'center',
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: COLORS.cyan,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitText: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#777',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 16,
  },
});
